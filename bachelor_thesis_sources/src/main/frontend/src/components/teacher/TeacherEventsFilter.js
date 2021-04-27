import React from "react";
import {makeStyles, MenuItem, Paper, TextField} from "@material-ui/core";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {dateFormatMoment} from "../../utils/constants";

const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(2),
        width: '250px',
    },
    cardActions: {
        display: "flex",
        justifyContent: "center"
    },

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
}));

export default function TeacherEventsFilter({
                                                degrees,
                                                comStates,
                                                selectedDegree,
                                                selectedState,
                                                onChangeSelect,
                                                selectedDateFrom,
                                                selectedDateTo,
                                                handleChangeDateFrom,
                                                handleChangeDateTo,
                                            }) {
    const classes = useStyles();

    if (!degrees || !comStates) {
        return <></>
    }

    return (
        <Paper>
            <TextField
                select
                value={selectedState}
                name={'selectedState'}
                helperText={'Commission state'}
                onChange={onChangeSelect}
                className={classes.item}
            >
                {
                    comStates.map((state, idx) => {
                        return (
                            <MenuItem
                                key={idx}
                                value={state}
                            >
                                {state}
                            </MenuItem>
                        )
                    })
                }
            </TextField>

            <TextField
                select
                name={'selectedDegree'}
                value={selectedDegree}
                helperText={'Degrees'}
                onChange={onChangeSelect}
                className={classes.item}
            >
                {
                    degrees.map((deg, idx) => {
                        return (
                            <MenuItem
                                key={idx}
                                value={deg}
                            >
                                {deg}
                            </MenuItem>
                        )
                    })
                }
            </TextField>
            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={"en-gb"}>
                <DatePicker
                    id="date-picker-inline"
                    format={dateFormatMoment}
                    autoOk={true}
                    value={selectedDateFrom}
                    onChange={handleChangeDateFrom}
                    className={classes.item}
                    maxDate={selectedDateTo}
                    helperText="Date from"
                />
                <DatePicker
                    id="date-picker-inline"
                    format={dateFormatMoment}
                    autoOk={true}
                    value={selectedDateTo}
                    onChange={handleChangeDateTo}
                    className={classes.item}
                    minDate={selectedDateFrom}
                    helperText="Date to"
                />
            </MuiPickersUtilsProvider>
        </Paper>
    )
}