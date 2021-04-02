import React from "react";
import {Grid, makeStyles, Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";

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

export default function EmailListItem({template, onEditClick}) {
    const classes = useStyles();

    if (!template) {
        return <></>
    }

    return (
        <Paper className={classes.item}>
            <h3>{template.emailType}</h3>
            <Grid container direction={'row'} wrap={'nowrap'}>
                <Grid container direction={'column'} item xs={2}>
                    <Grid item>Subject </Grid>
                    <Grid item>Text </Grid>

                </Grid>
                <Grid container direction={'column'} item xs>
                    <Grid item>{template.subject}</Grid>
                    <Grid item>{template.text}</Grid>
                </Grid>
                <Grid container direction={'column'} item xs={2}>
                    <Grid container justify={"center"}>
                        <Button
                            onClick={onEditClick(template)}
                        >
                            Edit Template
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )

}