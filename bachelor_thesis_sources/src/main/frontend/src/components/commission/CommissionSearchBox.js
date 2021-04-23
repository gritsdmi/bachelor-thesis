import React from "react";
import {MenuItem, Paper, TextField} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {get, handleResponseError} from "../../utils/request";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import moment from 'moment'
import MomentUtils from '@date-io/moment';
import "moment/locale/en-gb"
import Button from "@material-ui/core/Button";
import {dateFormatMoment} from "../../utils/constants";
import Box from "@material-ui/core/Box";

moment.locale("en-gb")

const useStyles = theme => ({
    item: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),

        width: "150px",
    },
    flex: {
        display: 'flex',
        alignItems: 'center',
    },
    buttonBox: {
        display: 'flex',

    },
    button: {
        marginLeft: theme.spacing(0.5),
    },
});

const InitialState = {
    degrees: [],
    fields: [],
    states: ['ALL', 'EDITABLE', 'APPROVED', 'DRAFT'],

    selectedDegree: 'ALL',
    selectedField: {field: 'ALL', degree: 'ALL'},
    selectedDateFrom: new Date(),
    selectedDateTo: new Date(),
    selectedState: 'ALL',

}

const enumerateDaysBetweenDates = function (startDate, endDate) {
    let dates = [];

    let currDate = moment(startDate).startOf('day');
    const lastDate = moment(endDate).startOf('day');

    dates.push(currDate.clone().format(dateFormatMoment))
    while (currDate.add(1, 'days').diff(lastDate) <= 0) {
        dates.push(currDate.clone().format(dateFormatMoment));
    }

    return dates;
};

const filterProps = (state) => {

    return {
        selectedDegree: state.selectedDegree,
        selectedField: state.selectedField,
        selectedDatesRange: enumerateDaysBetweenDates(state.selectedDateFrom, state.selectedDateTo),
        selectedState: state.selectedState,
    }
}

//used in commissions list overview
class CommissionSearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState
        }
    }

    componentDidMount() {
        this.fetchAll(true)
    }

    fetchAll(didMount) {
        this.fetchDegrees(didMount)
        this.fetchFields(didMount)
    }

    fetchDegrees(didMount) {
        get("/exam/degrees")
            .then(res => {
                this.setState({
                        degrees: res.data,
                        selectedDegree: res.data.length > 0 ? res.data[0] : 'Bc',
                    }
                    // , () => console.log(res.data)
                    , () => this.props.onChange(filterProps(this.state), didMount)
                )
            })
            .catch(err => handleResponseError(err))
    }

    fetchFields(didMount) {

        get(`/field/degree/${this.state.selectedDegree}`)
            .then(res => {
                this.setState({
                        fields: this.addItemALL(res.data, true),
                        selectedField: res.data.length > 0 ? res.data[0] : 'ALL'
                    }
                    , () => {
                        this.props.onChange(filterProps(this.state), didMount)
                    }
                )
            })
            .catch(err => handleResponseError(err))
    }

    addItemALL(data) {
        let ret = data
        ret.unshift({
            field: 'ALL',
            degree: this.state.selectedDegree,
        })
        return ret
    }

    fixDegree(field) {
        this.setState({
                selectedDegree: field.degree,
            }, this.props.onChange(filterProps(this.state))
        )
    }

    handleChangeDegree = (e) => {
        this.setState({
            selectedDegree: e.target.value,
        }, () => this.fetchFields())

    }

    handleChangeField = (e) => {
        this.setState({
                selectedField: e.target.value,
            }
            , () => {
                //todo if field != all todo change correct degree
                if (this.state.selectedField !== 'ALL') {
                    this.fixDegree(this.state.selectedField)
                } else {
                    this.props.onChange(filterProps(this.state))
                }
            })
    }

    handleChangeState = (e) => {
        this.setState({
            selectedState: e.target.value,
        }, () => this.props.onChange(filterProps(this.state)))
    }

    handleChangeDateFrom = (e) => {
        this.setState({
            selectedDateFrom: e,
        }, () => this.props.onChange(filterProps(this.state)))
    }

    handleChangeDateTo = (e) => {
        this.setState({
            selectedDateTo: e,
        }, () => this.props.onChange(filterProps(this.state)))
    }


    render() {

        const {classes} = this.props

        return (
            <div>
                <Paper className={classes.flex}>
                    <TextField
                        id="degree-select"
                        select
                        value={this.state.selectedDegree}
                        onChange={this.handleChangeDegree}
                        helperText="Degree"
                        className={classes.item}
                    >
                        {this.state.degrees.map((degree, idx) => (
                            <MenuItem
                                key={idx}
                                value={degree}
                            >
                                {degree}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        id="field-select"
                        select
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

                    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={"en-gb"}>
                        <DatePicker
                            id="date-picker-inline"
                            format={dateFormatMoment}
                            autoOk={true}
                            value={this.state.selectedDateFrom}
                            onChange={this.handleChangeDateFrom}
                            className={classes.item}
                            maxDate={this.state.selectedDateTo}
                            helperText="Date from"
                        />
                        <DatePicker
                            id="date-picker-inline"
                            format={dateFormatMoment}
                            autoOk={true}
                            value={this.state.selectedDateTo}
                            onChange={this.handleChangeDateTo}
                            className={classes.item}
                            minDate={this.state.selectedDateFrom}
                            helperText="Date to"
                        />
                    </MuiPickersUtilsProvider>

                    <TextField
                        id="state-select"
                        select
                        value={this.state.selectedState}
                        onChange={this.handleChangeState}
                        helperText="Commission state"
                        className={classes.item}
                    >
                        {this.state.states.map((state, idx) => (
                            <MenuItem
                                key={idx}
                                value={state}
                            >
                                {state}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box className={classes.buttonBox}>
                        <Button
                            onClick={this.props.onClickGenButton}
                            color={'primary'}
                            variant={"contained"}
                            className={classes.button}
                        >
                            Generate CSV
                        </Button>
                        <Button
                            color={'primary'}
                            onClick={this.props.onClickChangeView}
                            variant={'contained'}
                            className={classes.button}
                        >
                            Change view
                        </Button>
                    </Box>
                </Paper>
            </div>
        );
    }

}

export default withStyles(useStyles)(CommissionSearchBox);
