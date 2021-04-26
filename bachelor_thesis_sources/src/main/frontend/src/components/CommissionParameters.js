import React from "react";
import {Grid, InputAdornment, MenuItem, Paper, TextField,} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import {del, get, handleResponseError, post} from "../utils/request"
import {DateTimePicker, MuiPickersUtilsProvider,} from '@material-ui/pickers';
import {dateFormatMoment, dateTimeFormatMoment, timeFormatMoment} from "../utils/constants";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import "moment/locale/en-gb"

import TodayIcon from '@material-ui/icons/Today';

const useStyles = theme => ({
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    item: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),

    },
    datePicker: {
        cursor: `pointer !important`,
    },

});

const InitialState = {
    degrees: [],
    fields: [],
    locations: [],
    commissions: [],

    selectedDegree: '',
    selectedField: '',
    selectedLocation: '',
    selectedDate: new Date(),
    selectedTime: new Date(),
    selectedDateTime: new Date(),

}


//used in autogenerate page
class CommissionGenerateParameters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState
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
            .catch(error => console.log(error))
    }

    fetchFields(didMount) {

        console.log("fetchFields", this.state.selectedDegree)

        get(`/field/degree/${this.state.selectedDegree}`)
            .then(res => {
                this.setState({
                        fields: res.data,
                        selectedField: res.data.length > 0 ? res.data[0] : ''
                    }
                )
            })
            .catch(err => handleResponseError(err))
    }

    fetchLocations(date) {

        const dateF = moment(date).format(dateFormatMoment)
        console.log("fetchLocations payload", dateF)

        get(`/location/free/${dateF}`)
            .then(response => {
                this.setState({
                    locations: response.data,
                    selectedLocation: response.data ? response.data[0] : '',
                }, () => console.log(this.state.locations))
            })
            .catch(err => handleResponseError(err))
    }

    fixDegreesArr(arr) {
        arr.shift()
        return arr
    }

    handleChangeDate = (event) => {
        console.log("handleChangeDate", moment(event).format(dateFormatMoment))
        this.setState({
            selectedDate: event,
        }, () => this.fetchLocations(this.state.selectedDate))

    }

    handleChangeDateTime = (event) => {
        console.log("handleChangeDate", moment(event).format(dateFormatMoment))
        const date = moment(event).format(dateFormatMoment)
        const time = moment(event).format(timeFormatMoment)
        console.log(date, time)
        this.setState({
            selectedDate: event,
            selectedTime: event,
            selectedDateTime: event,
        }, () => this.fetchLocations(this.state.selectedDate))

    }

    handleChangeDegree = (event) => {
        this.setState({
            selectedDegree: event.target.value,
        }, () => {
            this.fetchFields()
        })
    }

    handleChangeLocation = (event) => {
        this.setState({
            selectedLocation: event.target.value,
        })
    }

    handleChangeField = (e) => {
        this.setState({
            selectedField: e.target.value,
        })
    }

    onClickGenerateButton = () => {
        //todo make button disable, until generation complete

        //creationTO object
        const payload = {
            date: moment(this.state.selectedDate).format(dateFormatMoment),
            time: moment(this.state.selectedTime).format(timeFormatMoment),
            degree: this.state.selectedDegree,
            locationId: this.state.selectedLocation.id,
            teachers: [],
        }
        console.log("onClickGenerateButton", payload)

        post("/util/gen/2", payload)
            // .then(response => console.log(response))
            .then(response => this.props.onComplete(response))
            .catch(err => handleResponseError(err))

    }


    render() {
        if (!this.state.locations || !this.state.degrees) {
            return <></>
        }

        const {classes} = this.props

        return (
            <Paper>
                <Grid container>
                    <Grid
                        item
                        xs={1}
                        className={classes.item}
                    >
                        <TextField
                            id="degree-select"
                            select
                            fullWidth
                            value={this.state.selectedDegree}
                            onChange={this.handleChangeDegree}
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
                    <Grid
                        className={classes.item}
                        item
                        xs={1}
                    >
                        <TextField
                            id="field-select"
                            select
                            fullWidth
                            value={this.state.selectedField}
                            onChange={this.handleChangeField}
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
                    <Grid
                        className={classes.item}
                        item
                    >
                        <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={"en-gb"}>
                            <DateTimePicker
                                value={this.state.selectedDateTime}
                                disablePast
                                ampm={false}
                                minutesStep={15}
                                // rightArrowIcon={<TodayIcon/>}

                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment
                                            // position="end"
                                        >
                                            <TodayIcon/>
                                        </InputAdornment>
                                    )
                                }}
                                format={dateTimeFormatMoment}
                                onChange={this.handleChangeDateTime}
                                helperText="Date and time"
                                className={`${classes.item} ${classes.datePicker}`}
                                showTodayButton
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid
                        item
                        xs={2}
                        className={classes.item}
                    >
                        <TextField
                            id="location-select"
                            select
                            fullWidth
                            value={this.state.selectedLocation}
                            onChange={this.handleChangeLocation}
                            helperText="Location"
                            error={!!!this.state.locations.length}
                            className={classes.item}
                        >
                            {
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
                    <Grid
                        item
                        className={classes.item}
                    >
                        <Button
                            onClick={this.onClickGenerateButton}
                        >
                            Generate 2
                        </Button>

                        <Button
                            onClick={() => {
                                del(`/commission`)
                                    .then(res => console.log(res))
                                    .catch(err => handleResponseError(err))
                            }}
                        >
                            delete drafts
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(useStyles)(CommissionGenerateParameters);
