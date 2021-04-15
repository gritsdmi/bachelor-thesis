import React from "react";
import {Checkbox, ListItem, ListItemIcon, ListItemText, makeStyles, Paper} from "@material-ui/core";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
    },
    listItem: {
        display: "flex",
        flexDirection: "column",
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));

export default function TeacherFieldPreferences({
                                                    allDegrees,
                                                    fieldsClass,
                                                    handleClickField,
                                                    handleChecked,
                                                    onClickSave,
                                                }) {
    const classes = useStyles();

    return (
        <>
            <Paper
                className={classes.paper}
            >
                <Typography>Preference</Typography>
                <List
                    className={classes.container}
                >
                    {allDegrees.map((deg, ixd) => {
                        return (
                            <ListItem
                                key={ixd}
                                className={classes.listItem}
                            >
                                <Typography>{deg}</Typography>
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
                                                        color={"primary"}
                                                        disableRipple
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
                <Box>
                    <Button
                        onClick={() => onClickSave()}
                    >Save</Button>
                </Box>
            </Paper>
        </>
    )
}
