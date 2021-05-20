import React, {useState} from "react";
import {InputAdornment, makeStyles, MenuItem, Paper, TextField} from "@material-ui/core";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import TodayIcon from "@material-ui/icons/Today";
import Button from "@material-ui/core/Button";
import LocationEditDialog from "./LocationEditDialog";
import Box from "@material-ui/core/Box";

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
    },
    commissionPropsPaper: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        display: "flex",
        flexDirection: 'row',
    },
    buttonBox: {
        padding: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
    },

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
                                            edit,
                                            onSaveNewLoc,
                                        }) {
    const classes = useStyles();
    const [newLocationDialogOpen, setNewLocationDialogOpen] = useState(false);

    function onClickNewLocation() {
        setNewLocationDialogOpen(true)
    }

    function onCloseNewLocation() {
        setNewLocationDialogOpen(false)
        onSaveNewLoc()
    }

    return (
        <Paper
            className={classes.commissionPropsPaper}
        >
            <LocationEditDialog
                open={newLocationDialogOpen}
                onClose={onCloseNewLocation}
                location={''}
            />
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
                error={!!!locations.length && !edit}
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
                {edit && defaults &&
                <MenuItem
                    key={'default'}
                    value={defaults.loc}
                >{defaults.loc.building + ":" + defaults.loc.classroom}
                </MenuItem>}
            </TextField>

            <TextField
                id="degree-select"
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
                onChange={onChangeField}
                helperText="Field of study"
                className={classes.item}
                value={defaults.field ? defaults.field : "BP_SIT"}
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
            <Box className={classes.buttonBox}>
                <Button
                    color={"primary"}
                    variant={"contained"}
                    onClick={() => onClickNewLocation()}
                >
                    new location
                </Button>
            </Box>
        </Paper>
    )
}
