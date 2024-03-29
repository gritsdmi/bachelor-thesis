import React from "react";
import {Backdrop, CircularProgress, Grid, MenuItem, Paper, TextField,} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import {del, get, handleResponseError, post} from "../utils/request"
import {DateTimePicker, MuiPickersUtilsProvider,} from '@material-ui/pickers';
import {dateFormatMoment, dateTimeFormatMoment, timeFormatMoment} from "../utils/constants";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import "moment/locale/en-gb"
import Box from "@material-ui/core/Box";

const useStyles = theme => ({
    item: {
        margin: theme.spacing(1),
        // marginLeft: theme.spacing(2),
        // marginRight: theme.spacing(2),
    },
    datePicker: {
        cursor: `pointer !important`,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    buttonBox: {
        padding: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
    },
});

const InitialState = {
    degrees: [],
    fields: [],
    locations: [],
    commissionSizes: [1, 2, 3],

    selectedDegree: '',
    selectedField: '',
    selectedLocation: '',
    selectedCommissionSize: '',
    selectedDate: new Date().setHours(9, 0),
    selectedTime: new Date().setHours(9, 0),
    selectedDateTime: new Date().setHours(9, 0),
    openBackdrop: false,

}

//used in autogenerate page
class CommissionGenerateParameters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
            selectedCommissionSize: 2,
        }
    }

    componentDidMount() {
        this.fetchDegrees()
        this.fetchLocations(this.state.selectedDate);
    }

    fetchDegrees() {
        get("/exam/degrees")
            .then(response => {
                this.setState({
                    degrees: this.fixDegreesArr(response.data),
                    selectedDegree: response.data[0],
                }, () => {
                    this.fetchFields()
                })
            })
            .catch(err => handleResponseError(err))
    }

    fetchFields(didMount) {

        get(`/field/degree/${this.state.selectedDegree}`)
            .then(res => {
                this.setState({
                        fields: res.data,
                        selectedField: res.data.length > 0 ? res.data[0] : '',
                    }
                )
            })
            .catch(err => handleResponseError(err))
    }

    fetchLocations(date) {

        const dateF = moment(date).format(dateFormatMoment)

        get(`/location/free/${dateF}`)
            .then(response => {
                this.setState({
                        locations: response.data,
                        selectedLocation: response.data.length ? response.data[0] : '',
                    }
                )
            })
            .catch(err => handleResponseError(err))
    }

    fixDegreesArr(arr) {
        arr.shift()
        return arr
    }

    handleChangeDateTime = (event) => {
        this.setState({
            selectedDate: event,
            selectedTime: event,
            selectedDateTime: event,
        }, () => this.fetchLocations(this.state.selectedDate))
    }

    // handleChangeDegree = (event) => {
    //     this.setState({
    //         selectedDegree: event.target.value,
    //     }, () => {
    //         this.fetchFields()
    //     })
    // }
    //
    // handleChangeLocation = (event) => {
    //     this.setState({
    //         selectedLocation: event.target.value,
    //     })
    // }
    //
    // handleChangeField = (e) => {
    //     this.setState({
    //         selectedField: e.target.value,
    //     })
    // }

    handleChangeSelect = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        }, () => {
            if (e.target.name === 'selectedDegree') {
                this.fetchFields()
            }
        })
    }

    onClickGenerateButton = () => {
        //creatorTO object
        const payload = {
            date: moment(this.state.selectedDate).format(dateFormatMoment),
            time: moment(this.state.selectedTime).format(timeFormatMoment),
            degree: this.state.selectedDegree,
            field: this.state.selectedField.field,
            locationId: this.state.selectedLocation ? this.state.selectedLocation.id : null,
            teachers: [],
        }
        console.log("onClickGenerateButton", payload)
        this.openBackdrop()

        post(`/util/gen/${this.state.selectedCommissionSize}`, payload)
            .then(() => {
                this.props.onComplete()
                this.handleCloseBackdrop()
            })
            .catch(err => handleResponseError(err))
    }

    onClickDeleteDrafts = () => {
        console.log('onClickDeleteDrafts')
        this.openBackdrop()

        del(`/commission`)
            .then(res => {
                console.log(res)
                this.props.onComplete()
                this.handleCloseBackdrop()
            })
            .catch(err => handleResponseError(err))
    }

    openBackdrop = () => {
        this.setState({
            openBackdrop: true,
        })
    }

    handleCloseBackdrop = () => {
        this.setState({
            openBackdrop: false,
        })
    }

    render() {
        if (!this.state.locations || !this.state.degrees) {
            return <></>
        }

        const {classes} = this.props

        return (
            <Paper>
                <Backdrop
                    className={classes.backdrop}
                    open={this.state.openBackdrop}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>
                <Grid container>
                    <Grid item xs={1} className={classes.item}>
                        <TextField
                            name={'selectedDegree'}
                            select
                            fullWidth
                            value={this.state.selectedDegree}
                            onChange={this.handleChangeSelect}
                            helperText="Degree"
                            className={classes.item}
                        >
                            {
                                this.state.degrees.map((degree, idx) => {
                                    return (
                                        <MenuItem
                                            key={idx}
                                            value={degree}
                                        >{degree}
                                        </MenuItem>
                                    )
                                })
                            }
                        </TextField>
                    </Grid>
                    <Grid item xs={1} className={classes.item}>
                        <TextField
                            name={'selectedField'}
                            select
                            fullWidth
                            value={this.state.selectedField}
                            onChange={this.handleChangeSelect}
                            helperText="Field of study"
                            className={classes.item}
                        >
                            {this.state.fields.map((field, idx) => (
                                <MenuItem
                                    key={idx}
                                    value={field}
                                >
                                    {field.field}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item className={classes.item}>
                        <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={"en-gb"}>
                            <DateTimePicker
                                value={this.state.selectedDateTime}
                                disablePast
                                ampm={false}
                                minutesStep={5}
                                format={dateTimeFormatMoment}
                                onChange={this.handleChangeDateTime}
                                helperText="Date and time"
                                className={`${classes.item} ${classes.datePicker}`}
                                showTodayButton
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <TextField
                            name={'selectedLocation'}
                            select
                            fullWidth
                            value={this.state.selectedLocation}
                            onChange={this.handleChangeSelect}
                            helperText="Location"
                            error={!!!this.state.locations.length}
                            className={classes.item}
                        >
                            {this.state.locations &&
                            this.state.locations.map((location, idx) => {
                                return (
                                    <MenuItem
                                        key={idx}
                                        value={location}
                                    >{location.building + ":" + location.classroom}
                                    </MenuItem>
                                )
                            })
                            }
                        </TextField>
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <TextField
                            name={'selectedCommissionSize'}
                            select
                            value={this.state.selectedCommissionSize}
                            onChange={this.handleChangeSelect}
                            helperText="Commission size"
                            className={classes.item}
                        >
                            {
                                this.state.commissionSizes.map((int, idx) => {
                                    return (
                                        <MenuItem
                                            key={idx}
                                            value={int}
                                        >{int}
                                        </MenuItem>
                                    )
                                })
                            }
                        </TextField>
                    </Grid>
                    <Grid item className={classes.item}>
                        <Box className={classes.buttonBox}>
                            <Button
                                color={'primary'}
                                variant={'contained'}
                                onClick={this.onClickGenerateButton}
                            >
                                Generate
                            </Button>

                            <Button
                                color={'secondary'}
                                onClick={this.onClickDeleteDrafts}
                            >
                                delete drafts
                            </Button>
                        </Box>

                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(useStyles)(CommissionGenerateParameters);
