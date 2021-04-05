import React from "react";
import {Grid, MenuItem, Select,} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import {get, post} from "../utils/request"
import {DatePicker, MuiPickersUtilsProvider,} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import format from 'date-fns/format';

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
    }

});

const dateFormat = 'dd.MM.yyyy'

class CommissionParameters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            degrees: [],
            locations: [],
            commissions: [],

            selectedDegree: '',
            selectedLocation: '',
            selectedDate: format(new Date(), dateFormat),

            paperOpen: false,
            collapsesOpen: [],
        }

    }

    componentDidMount() {
        console.log("CommissionParameters DID MOUNT")
        get("/exam/degrees")
            .then(response => {
                this.setState({
                    degrees: response.data,
                }, () => console.log(response.data))
            })
            .catch(error => console.log(error))

        this.fetchLocations(this.state.selectedDate);

    }

    test(loc) {
        let test = []
        for (let [key, value] of Object.entries(loc)) {
            let obj = {}
            obj[key] = value;
            test.push(obj)
        }
        console.log(test)
        return test
    }

    handlePaper = () => {
        console.log("handle paper")
        this.setState({
            paperOpen: !this.state.paperOpen,
        }, () => console.log(this.state.paperOpen))
    }

    handlePaperItem = item => () => {
        console.log("handle item", item)
        let obj = {
            item: true,
        }
    }

    handleChangeDate = (event) => {
        //dd.MM.yyyy
        console.log("handleChangeDate", format(event, dateFormat))
        this.setState({
            selectedDate: format(event, dateFormat),
        }, () => this.fetchLocations(this.state.selectedDate))

    }

    fetchLocations(dateF) {
        const payload = {
            date: '',
            semester: ''
        }
        console.log("fetchLocations payload", payload)

        get(`/location/free/${dateF}`)
            .then(response => {
                this.setState({
                    // locations: this.test(response.data),
                    locations: response.data,
                }, () => console.log(this.state.locations))
            })
            .catch(error => console.log(error))
    }

    handleChangeDegree = (event) => {
        console.log("handleChangeDegree")
        this.setState({
            selectedDegree: event.target.value,
        })
    }

    handleChangeLocation = (event) => {
        console.log("handleChangeLocation")
        this.setState({
            selectedLocation: event.target.value,
        })
    }

    onClickGenerateButton = () => {
        //todo make button disable, until generation complete

        //creationTO object
        const payload = {
            date: this.state.selectedDate,
            degree: this.state.selectedDegree,
            locationId: this.state.selectedLocation.id,
            teachers: [],
        }
        console.log("onClickGenerateButton", payload)

        post("/util/gen/2", payload)
            // .then(response => console.log(response))
            .then(response => this.props.onComplete(response))

    }


    render() {
        if (!this.state.locations || !this.state.degrees) {
            return <></>
        }

        const {classes} = this.props

        return (
            <div>
                <Grid container>
                    <Grid
                        item
                        xs={1}
                        className={classes.item}
                    >
                        <Select
                            fullWidth
                            onChange={this.handleChangeDegree}
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
                        </Select>
                    </Grid>
                    <Grid
                        className={classes.item}
                        item
                    >
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                //todo css
                                disableToolbar
                                // variant="inline"
                                // format="MM.dd.yyyy"//poebat мб это изза разных версий пикера и форматера
                                // dateFormat="dd.MM.yyyy"
                                autoOk={true}
                                // placeholderText={"Enter date"}
                                // margin="normal"
                                id="date-picker-inline"
                                // label="Date picker inline"
                                value={this.state.selectedDate}
                                onChange={this.handleChangeDate}
                                // KeyboardButtonProps={{
                                //     'aria-label': 'change date',
                                // }}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid
                        item
                        xs={2}
                        className={classes.item}
                    >
                        <Select
                            fullWidth
                            onChange={this.handleChangeLocation}
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
                        </Select>
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
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(useStyles)(CommissionParameters);
