import React from "react";
import {makeStyles, Paper, TextField} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    searchBox: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },

}));

export default function SearchBox({onClickButton, searchPattern, onChange, label}) {
    const classes = useStyles();

    const lbl = label ? label : 'Name or username';

    return (
        <Paper
            className={classes.searchBox}
        >
            <TextField
                autoFocus
                fullWidth
                variant={"outlined"}
                size={"small"}
                label={lbl}
                defaultValue=""
                onChange={onChange}
            />
        </Paper>
    );
}
