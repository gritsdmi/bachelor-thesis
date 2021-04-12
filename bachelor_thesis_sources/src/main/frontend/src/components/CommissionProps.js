import React from "react";
import {makeStyles, MenuItem, Paper, Select} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";


const useStyles = makeStyles((theme) => ({
    item: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),

        width: "150px",
    },

}));

//used in manual creating
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

    if (!locations || locations.length < 1) {
        console.log("!locations")
        return <></>
    }

    return (

        <Paper>
            <Select
                // fullWidth
                // defaultValue={defaults.degree ? defaults.degree : "Bc"}
                value={defaults.degree ? defaults.degree : "Bc"}
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
                onChange={onChangeLoc}
                className={classes.item}
                // labelId="loc"
                value={defaults.loc ? defaults.loc : locations[0]}
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
