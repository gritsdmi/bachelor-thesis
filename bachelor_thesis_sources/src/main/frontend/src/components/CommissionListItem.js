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

export default function CommissionListItem({commission, onClickInfoButton}) {
    const classes = useStyles();

    function comTeachers() {
        let string = ""
        commission.teachers.forEach(teacher => string
            += teacher.name ? teacher.name : '' + ' ' + teacher.surname)
        return string
    }

    return (
        <Paper>
            <Grid container direction={'row'} wrap={"nowrap"}>
                <Grid direction={'column'} container item xs>
                    <Grid item>
                        {"Location: " + commission.exam.location.building
                        + ":" + commission.exam.location.classroom}
                    </Grid>
                    <Grid item>
                        {"Date " + commission.exam.date
                        + " Time " + commission.exam.time}
                    </Grid>
                </Grid>
                <Grid direction={'column'} container item xs>
                    <Grid item>
                        {"State " + commission.state}
                    </Grid>
                    <Grid item> {"Teachers " + comTeachers()} </Grid>
                </Grid>
                <Grid direction={'column'} container item xs={1}>
                    <Grid item container justify={"center"}>
                        <Button
                            onClick={onClickInfoButton(commission)}
                        >
                            Info
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}