import React from "react";
import {FormControlLabel, MenuItem, Paper, Radio, RadioGroup, TextField} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {get, handleResponseError} from "../../utils/request";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import moment from 'moment'
import MomentUtils from '@date-io/moment';
import "moment/locale/en-gb"
import Button from "@material-ui/core/Button";
import {dateFormatMoment, enumerateDaysBetweenDates} from "../../utils/constants";
import Box from "@material-ui/core/Box";

moment.locale("en-gb")

const useStyles = theme => ({
    item: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        width: "170px",
    },
    flex: {
        display: 'flex',
        alignItems: 'center !important',
    },
    buttonBox: {
        display: 'flex',
    },
    button: {
        marginLeft: theme.spacing(0.5),
    },
    radioGroup: {
        display: 'flex',
    },
    rightBox: {
        display: 'flex',
        alignItems: 'center !important',
    },
    leftBox: {
        display: 'flex',
        alignItems: 'center !important',
        flexGrow: 1,
    },
});

const InitialState = {
    degrees: [],
    fields: [],
    states: ['ALL', 'EDITABLE', 'APPROVED', 'DRAFT'],
    semesters: [],

    selectedDegree: 'ALL',
    selectedField: {field: 'ALL', degree: 'ALL'},
    selectedDateFrom: new Date(),
    selectedDateTo: new Date(),
    selectedState: 'ALL',
    selectedSemester: '',

    bySemester: 'sem',

}

const filterProps = (state) => {

    return {
        selectedDegree: state.selectedDegree,
        selectedField: state.selectedField,
        selectedDatesRange: enumerateDaysBetweenDates(state.selectedDateFrom, state.selectedDateTo),
        selectedState: state.selectedState,
        selectedSemester: state.bySemester === 'sem' ? state.selectedSemester : null,
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
        // this.fetchFields(didMount)
        // this.fetchSemesters(didMount)
    }

    fetchDegrees(didMount) {
        get("/exam/degrees")
            .then(res => {
                this.setState({
                        degrees: res.data,
                        selectedDegree: res.data.length > 0 ? res.data[0] : 'Bc',
                    }
                    , () => {
                        if (didMount) {
                            this.fetchFields(didMount)
                        } else {
                            this.props.onChange(filterProps(this.state))
                        }
                    }
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
                        if (didMount) {
                            this.fetchSemesters(didMount)
                        } else {
                            this.props.onChange(filterProps(this.state))
                        }
                    }
                )
            })
            .catch(err => handleResponseError(err))
    }

    fetchSemesters(didMount) {
        get('/exam/semesters')
            .then(res => this.setState({
                    semesters: res.data,
                    selectedSemester: res.data[res.data.length - 1],
                }
                , () => {
                    this.props.onChange(filterProps(this.state))
                }
            ))
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

    onChangeSelect = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        }, () => {
            console.log('on change select', this.state)
            this.props.onChange(filterProps(this.state))
        })
    }

    onChangeRadio = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        }, () => {
            this.props.onChange(filterProps(this.state))
        })
    }

    render() {

        const {classes} = this.props

        return (
            <div>
                <Paper className={classes.flex}>
                    <Box
                        className={classes.leftBox}
                    >
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
                        {this.state.bySemester === 'sem' ?
                            <TextField
                                id="semester-select"
                                name={'selectedSemester'}
                                select
                                value={this.state.selectedSemester}
                                onChange={this.onChangeSelect}
                                helperText="Semester"
                                className={classes.item}
                            >
                                {this.state.semesters.map((semester, idx) => (
                                    <MenuItem
                                        key={idx}
                                        value={semester}
                                    >
                                        {semester}
                                    </MenuItem>
                                ))}
                            </TextField>
                            :
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
                        }
                    </Box>

                    <Box
                        className={classes.rightBox}
                    >

                        <RadioGroup
                            name={"bySemester"}
                            value={this.state.bySemester}
                            onChange={this.onChangeRadio}
                            className={classes.radioGroup}
                        >
                            <FormControlLabel value={"date"}
                                              control={<Radio color={'primary'} size={'small'}/>}
                                              label="Date"
                            />
                            <FormControlLabel value={"sem"}
                                              control={<Radio color={'primary'} size={'small'}/>}
                                              label="Semester"
                            />
                        </RadioGroup>
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
                    </Box>

                </Paper>
            </div>
        );
    }

}

export default withStyles(useStyles)(CommissionSearchBox);
