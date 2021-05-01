import React from "react";
import {FormControlLabel, makeStyles, MenuItem, Paper, Radio, RadioGroup, TextField} from "@material-ui/core";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {dateFormatMoment} from "../../utils/constants";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
    item: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        width: "170px",
    },
    flex: {
        display: 'flex',
        alignItems: 'center',
    },
    radioGroup: {
        display: 'flex',
    },
    rightBox: {
        display: 'flex',
        alignItems: 'center !important',
        // flexGrow: 1,
        paddingRight: theme.spacing(8),
    },
    leftBox: {
        display: 'flex',
        alignItems: 'center !important',
        flexGrow: 1,
    },

}));

export default function TeacherEventsFilter({
                                                degrees,
                                                comStates,
                                                selectedDegree,
                                                onChangeSelect,
                                                selectedDateFrom,
                                                selectedDateTo,
                                                handleChangeDateFrom,
                                                handleChangeDateTo,
                                                semesters,
                                                bySemester,
                                                selectedSemester,
                                                onChangeRadio,
                                            }) {
    const classes = useStyles();

    if (!degrees || !comStates) {
        return <></>
    }

    return (
        <Paper
            className={classes.flex}
        >
            <Box
                className={classes.leftBox}
            >
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
                {bySemester === 'sem' ?
                    <TextField
                        id="semester-select"
                        name={'selectedSemester'}
                        select
                        value={selectedSemester}
                        onChange={onChangeSelect}
                        helperText="Semester"
                        className={classes.item}
                    >
                        {semesters.map((semester, idx) => (
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
                }
            </Box>
            <Box
                className={classes.rightBox}
            >
                <RadioGroup
                    name={"bySemester"}
                    value={bySemester}
                    onChange={onChangeRadio}
                    className={classes.radioGroup}
                >
                    <FormControlLabel value={"date"}
                                      control={<Radio color={'primary'} size={'small'}/>}
                                      label="By date"
                    />
                    <FormControlLabel value={"sem"}
                                      control={<Radio color={'primary'} size={'small'}/>}
                                      label="By semester"
                    />
                </RadioGroup>
            </Box>
        </Paper>
    )
}