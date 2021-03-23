import React from "react";
import {makeStyles, MenuItem, Paper, Select} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";


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
    }
}));

export default function CommissionProps({
                                            date,
                                            onChangeDate,
                                            onChangeDegree,
                                            onChangeLoc,
                                            degrees,
                                            locations,
                                            defaults
                                        }) {
    const classes = useStyles();


    return (

        <Paper>
            <Select
                // fullWidth
                defaultValue={defaults ? defaults.degree : " "}
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
            </Select>

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

                    value={date}
                    onChange={onChangeDate}
                    className={classes.item}

                    // KeyboardButtonProps={{
                    //     'aria-label': 'change date',
                    // }}
                />
            </MuiPickersUtilsProvider>

            <Select
                // fullWidth
                onChange={onChangeLoc}
                className={classes.item}

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
            </Select>


        </Paper>
    )

}