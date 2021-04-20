import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import {download} from "../utils/request";


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
    gridRoot: {
        "&.MuiGrid-root": {
            // backgroundColor: "red",
            // margin: theme.spacing(3),
        }
    },
    gridLine: {
        padding: theme.spacing(2),
    },
});

const InitialState = {
    selectedDateFrom: new Date(),
    selectedDateTo: new Date(),

    radioBy: 'date',

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
    }

    onChangeRadio = (e) => {
        this.setState({
            radioBy: e.target.value,
        })
    }

    handleChangeDateFrom = e => {
        this.setState({
            selectedDateFrom: e,
        }, () => console.log(this.state.selectedDateFrom))

    }

    handleChangeDateTo = e => {
        this.setState({
            selectedDateTo: e,
        }, () => console.log(this.state.selectedDateTo))
    }

    onClickDownload = () => {
        const payload = {
            dateFrom: moment(this.state.selectedDateFrom).format(dateFormatMoment),
            dateTo: moment(this.state.selectedDateTo).format(dateFormatMoment),
            semester: null,
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
                                <RadioGroup value={this.state.radioBy} onChange={this.onChangeRadio}
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
                                <Typography>Dates</Typography>
                            </Grid>
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
