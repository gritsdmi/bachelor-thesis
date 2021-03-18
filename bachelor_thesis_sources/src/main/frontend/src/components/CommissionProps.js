import React from "react";
import {MenuItem, Paper, Select} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";

export default function CommissionProps({date, onChangeDate, onChangeDegree, onChangeLoc, degrees, locations}) {


    return (

        <Paper>
            commission props
            <Select
                // fullWidth
                onChange={onChangeDegree}
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

                    // KeyboardButtonProps={{
                    //     'aria-label': 'change date',
                    // }}
                />
            </MuiPickersUtilsProvider>

            <Select
                // fullWidth
                onChange={onChangeLoc}
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