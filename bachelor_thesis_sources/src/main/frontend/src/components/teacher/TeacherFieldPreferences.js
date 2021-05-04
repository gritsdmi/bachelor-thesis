import React from "react";
import {Checkbox, ListItem, ListItemIcon, ListItemText, makeStyles} from "@material-ui/core";
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
    typography: {
        padding: theme.spacing(2),
    },
    buttonBox: {
        margin: theme.spacing(2),
        marginTop: '0px',
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
        <Box className={classes.paper}>
            <Typography variant={'h4'} className={classes.typography}>Preference</Typography>
            <List
                className={classes.container}
            >
                {allDegrees.map((deg, ixd) => {
                    return (
                        <ListItem
                            key={ixd}
                            className={classes.listItem}
                        >
                            <Typography variant={'h6'}>{deg}</Typography>
                            <List dense>
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
                    color={'primary'}
                    variant={'contained'}
                    onClick={() => onClickSave()}
                    className={classes.buttonBox}
                >Save</Button>
            </Box>
        </Box>
    )
}
