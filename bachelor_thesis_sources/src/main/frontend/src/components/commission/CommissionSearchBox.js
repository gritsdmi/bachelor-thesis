import React from "react";
import {MenuItem, Paper, TextField} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {get, handleResponseError} from "../../utils/request";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import moment from 'moment'
import MomentUtils from '@date-io/moment';
import "moment/locale/en-gb"

moment.locale("en-gb")

const useStyles = theme => ({
    item: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),

        width: "150px",
    },
});

const dateFormatMoment = "DD.MM.yyyy"

const InitialState = {
    degrees: [],
    fields: [],
    states: ['ALL', 'EDITABLE', 'APPROVED', 'DRAFT'],

    selectedDegree: 'ALL',
    selectedField: {field: 'ALL', degree: 'ALL'},
    // selectedDatesRange: [],
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
        console.log("did mount", didMount)
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
        // get("/field")
        //     .then(res => {
        //         this.setState({
        //                 fields: res.data,
        //             }
        //             , () => console.log(res.data)
        //         )
        //     })
        //     .catch(err => handleResponseError(err))
        console.log("did mount", didMount)

        get(`/field/degree/${this.state.selectedDegree}`)
            .then(res => {
                this.setState({
                        fields: this.addItemALL(res.data, true),
                        // fields: res.data,
                        selectedField: res.data.length > 0 ? res.data[0] : 'ALL'
                    }
                    // , () => console.log(res.data)
                    // , () =>
                    , () => {
                        console.log(this.state)
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
        // let degree
        // if (field.degree.startsWith('BP')) {
        //     degree = 'Bc'
        // } else if (field.startsWith('MP')) {
        //     degree = 'Ing'
        // } else {
        //     degree = 'PhD'
        // }
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
        console.log("handleChangeDate", moment(e).format(dateFormatMoment))
        this.setState({
            selectedDateFrom: e,
        }, () => this.props.onChange(filterProps(this.state)))
    }

    handleChangeDateTo = (e) => {
        console.log("handleChangeDate", moment(e).format(dateFormatMoment))
        this.setState({
            selectedDateTo: e,
        }, () => this.props.onChange(filterProps(this.state)))
    }


    render() {

        const {classes} = this.props

        return (
            <div>
                <Paper>
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
                </Paper>
            </div>
        );
    }

}

export default withStyles(useStyles)(CommissionSearchBox);
