import React from "react";
import {Checkbox, ListItem, ListItemIcon, ListItemText, makeStyles, Paper, Snackbar} from "@material-ui/core";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
    },
    listItem: {
        display: "flex",
        flexDirection: "column",
    },
}));

export default function TeacherFieldPreferences({
                                                    teacher,
                                                    allDegrees,
                                                    fieldsClass,
                                                    fieldsChecked,
                                                    handleClickField,
                                                    handleChecked,
                                                    handleClick,
                                                    onClickSave,
                                                }) {
    const classes = useStyles();
    const [snackOpen, setSnackOpen] = React.useState(false);


    function onButtonClick() {
        setSnackOpen(true)
        onClickSave()
    }

    return (
        <>
            <Paper>
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
                <Box>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={snackOpen}
                        autoHideDuration={4000}
                        onClose={() => setSnackOpen(false)}
                        message="Saved"
                        action={
                            <React.Fragment>
                                <IconButton size="small" aria-label="close" color="inherit"
                                            onClick={() => setSnackOpen(false)}
                                >
                                    <CloseIcon fontSize="small"/>
                                </IconButton>
                            </React.Fragment>
                        }
                    />
                    <Button
                        onClick={() => onButtonClick()}
                    >Save</Button>
                </Box>
            </Paper>
        </>
    )
}
