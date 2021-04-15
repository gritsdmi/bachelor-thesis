import React from "react";
import {InputAdornment, makeStyles, MenuItem, Paper, TextField} from "@material-ui/core";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import TodayIcon from "@material-ui/icons/Today";

const dateTimeFormatMoment = "DD.MM.yyyy HH:mm"

const useStyles = makeStyles((theme) => ({
    item: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),

        width: "150px",
    },
    datePicker: {
        cursor: `pointer !important`,
        width: "200px",
    }

}));

//used in manual creating
export default function CommissionProps({
                                            date,
                                            onChangeDate,
                                            onChangeDegree,
                                            onChangeField,
                                            onChangeLoc,
                                            fields,
                                            degrees,
                                            locations,
                                            defaults,
                                        }) {
    const classes = useStyles();

    return (

        <Paper>
            <TextField
                // fullWidth
                select
                value={defaults.degree ? defaults.degree : "Bc"}
                helperText="Degree"
                onChange={onChangeDegree}
                className={classes.item}
            >
                {
                    degrees.map((degree, idx) => {
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
            <TextField
                id="field-select"
                select
                fullWidth
                value={defaults.field ? defaults.field : "BP_SIT"}
                onChange={onChangeField}
                helperText="Field of study"
                className={classes.item}
            >
                {fields.map((field, idx) => (
                    <MenuItem
                        key={idx}
                        value={field}
                    >
                        {field.field}
                    </MenuItem>
                ))}
            </TextField>
            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={"en-gb"}>
                <DateTimePicker
                    value={date}
                    disablePast
                    ampm={false}
                    minutesStep={15}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment
                                position="end"
                            >
                                <TodayIcon/>
                            </InputAdornment>
                        )
                    }}
                    format={dateTimeFormatMoment}
                    onChange={onChangeDate}
                    helperText="Date and time"
                    className={`${classes.item} ${classes.datePicker}`}
                    showTodayButton
                />
            </MuiPickersUtilsProvider>

            <TextField
                select
                onChange={onChangeLoc}
                className={classes.item}
                helperText="Location"
                value={defaults.loc ? defaults.loc : locations.length > 0 ? locations[0] : ''}
            >
                {
                    locations.map((loc, idx) => {
                        return (
                            <MenuItem
                                key={idx}
                                value={loc}
                            >{loc.building + ":" + loc.classroom}
                            </MenuItem>
                        )
                    })
                }
            </TextField>
        </Paper>
    )
}
