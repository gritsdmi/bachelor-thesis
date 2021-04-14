import React from "react";
import {Checkbox, ListItem, ListItemIcon, ListItemText, makeStyles, Paper} from "@material-ui/core";
import List from "@material-ui/core/List";

const useStyles = makeStyles((theme) => ({}));

export default function TeacherFieldPreferences({
                                                    teacher,
                                                    allDegrees,
                                                    fieldsClass,
                                                    fieldsChecked,
                                                    handleClickField,
                                                    handleCheck,
                                                    handleClick,
                                                }) {
    const classes = useStyles();

    function handleChecked(field) {
        return !!fieldsChecked.has(field);
    }

    return (
        <>
            <Paper>
                <List>
                    {allDegrees.map((deg, ixd) => {
                        return (
                            <ListItem
                                key={ixd}
                            >
                                <List
                                    dense
                                >
                                    {fieldsClass.map((field, idx) => {
                                        return (
                                            field.degree === deg &&
                                            <ListItem
                                                key={idx}
                                                value={field}
                                                button
                                                onClick={() => handleClickField(field)}
                                            >
                                                <ListItemIcon>
                                                    <Checkbox
                                                        checked={handleChecked(field)}
                                                        // onChange={test(field)}
                                                        color={"primary"}
                                                        // tabIndex={-1}
                                                        disableRipple
                                                        // inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={field.field}
                                                >
                                                </ListItemText>
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </ListItem>
                        )
                    })}

                </List>

            </Paper>
        </>
    )
}
