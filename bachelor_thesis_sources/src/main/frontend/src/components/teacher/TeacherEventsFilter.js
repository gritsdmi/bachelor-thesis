import React from "react";
import {makeStyles, MenuItem, Paper, Select} from "@material-ui/core";

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

export default function TeacherEventsFilter({degrees, comStates, onChangeComState, onChangeDegree}) {
    const classes = useStyles();

    if (!degrees || !comStates) {
        return <></>
    }

    return (
        <>
            <Paper>
                TeacherEventsFilter
                <Select
                    onChange={onChangeComState}
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
                </Select>

                <Select
                    onChange={onChangeDegree}
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
                </Select>
            </Paper>
        </>
    )
}