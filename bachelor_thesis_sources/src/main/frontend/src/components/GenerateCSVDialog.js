import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    TextField
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import {download, get, handleResponseError} from "../utils/request";


const dateFormatMoment = "DD.MM.yyyy"


const useStyles = theme => ({
    title: {
        textAlign: 'center',
    },
    dialog: {
        width: '40%',
    },
    typography: {
        alignSelf: 'center',
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
    },
    radioGroup: {
        paddingLeft: theme.spacing(2),
    },
    datePick: {
        maxWidth: '120px',
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
    gridLine: {
        padding: theme.spacing(2),
    },
    semSelect: {
        paddingLeft: theme.spacing(2),
    }
});

const InitialState = {
    selectedDateFrom: new Date(),
    selectedDateTo: new Date(),
    selectedSemester: '',
    semesters: [],

    radioBy: 'sem',

}

class GenerateCSVDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
            ...this.props,
        }
    }

    componentDidMount() {
        get('/exam/semesters')
            .then(res => this.setState({
                    semesters: res.data,
                    selectedSemester: res.data[res.data.length - 1],
                }
            ))
            .catch(err => handleResponseError(err))
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (prevProps !== this.props) {
    //         if (this.props.open) {
    //             this.setState({
    //                 selectedSemester: this.props.semesters[this.props.semesters.length - 1]
    //             })
    //         }
    //     }
    // }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    handleChangeDateFrom = e => {
        this.setState({
            selectedDateFrom: e,
        })
    }

    handleChangeDateTo = e => {
        this.setState({
            selectedDateTo: e,
        })
    }

    onClickDownload = () => {
        const payload = {
            dateFrom: moment(this.state.selectedDateFrom).format(dateFormatMoment),
            dateTo: moment(this.state.selectedDateTo).format(dateFormatMoment),
            semester: this.state.selectedSemester === 'sem' ? this.state.selectedSemester : null,
        }

        download(`/util/download`, payload)

    }

    render() {
        const {classes} = this.props

        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                fullWidth
            >
                <DialogTitle
                    className={classes.title}
                >CSV</DialogTitle>
                <DialogContent dividers>
                    <Grid
                        className={classes.gridRoot}
                        container
                        direction={'column'}>

                        <Grid item container className={classes.gridLine}>
                            <Grid xs={3} item className={classes.typography}>
                                <Typography>Period</Typography>
                            </Grid>
                            <Grid xs item>
                                <RadioGroup
                                    name={'radioBy'}
                                    value={this.state.radioBy}
                                    onChange={this.onChange}
                                    className={`${classes.flexRow} ${classes.radioGroup}`}>
                                    <FormControlLabel value='date'
                                                      control={<Radio color={'primary'} size={'small'}/>}
                                                      label="by Date"
                                    />
                                    <FormControlLabel value='sem'
                                                      control={<Radio color={'primary'} size={'small'}/>}
                                                      label="by Semester"
                                    />
                                </RadioGroup>
                            </Grid>
                        </Grid>
                        <Grid item container className={classes.gridLine}>
                            <Grid xs={3} item className={classes.typography}>
                                {this.state.radioBy === 'date' ?
                                    <Typography>Dates</Typography> :
                                    <Typography>Semester</Typography>}
                            </Grid>
                            {this.state.radioBy === 'date' ?
                                <Grid xs item className={classes.flexRow}>
                                    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={"en-gb"}>
                                        <DatePicker
                                            id="date-picker-inline-from"
                                            format={dateFormatMoment}
                                            autoOk={true}
                                            value={this.state.selectedDateFrom}
                                            onChange={this.handleChangeDateFrom}
                                            className={classes.datePick}
                                            maxDate={this.state.selectedDateTo}
                                            helperText="Date from"

                                        />
                                        <DatePicker
                                            id="date-picker-inline-to"
                                            format={dateFormatMoment}
                                            autoOk={true}
                                            value={this.state.selectedDateTo}
                                            onChange={this.handleChangeDateTo}
                                            className={classes.datePick}
                                            minDate={this.state.selectedDateFrom}
                                            helperText="Date to"
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                :
                                <Grid xs item className={classes.flexRow}>
                                    <TextField
                                        id="semester-select"
                                        name={'selectedSemester'}
                                        select
                                        value={this.state.selectedSemester}
                                        onChange={this.onChange}
                                        helperText="Semester"
                                        className={classes.semSelect}
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
                                </Grid>
                            }
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={this.props.onClose}
                        color={'secondary'}
                        variant={'contained'}
                    >Cancel</Button>

                    <Button
                        color={'primary'}
                        variant={'contained'}
                        onClick={this.onClickDownload}
                    >
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(useStyles)(GenerateCSVDialog)
