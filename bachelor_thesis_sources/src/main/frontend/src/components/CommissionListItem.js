import React from "react";
import {Grid, makeStyles, Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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

    function strTeachers() {
        let string = ""
        commission.teachers.forEach(teacher => string
            += teacher.name ? teacher.name : '' + ' ' + teacher.surname)
        return string
    }

    function strLocations() {
        let string = ""
        if (commission.exam.location !== null) {
            string = commission.exam.location.building + ":" + commission.exam.location.classroom
        }
        return string
    }

    return (
        <Paper>
            <Grid container direction={'row'} wrap={"nowrap"}>
                <Grid direction={'column'} container item xs>
                    <Grid item>
                        <Typography> {"Location " + strLocations()} </Typography>
                    </Grid>
                    <Grid item>
                        <Typography>{"Date " + commission.exam.date + " Time " + commission.exam.time}</Typography>
                    </Grid>
                </Grid>
                <Grid direction={'column'} container item xs>
                    <Grid item>
                        <Typography>{"State " + commission.state}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography> {"Teachers " + strTeachers()}</Typography>
                    </Grid>
                </Grid>
                <Grid direction={'column'} container item xs={1}>
                    <Grid item container justify={"center"}>
                        <Button
                            color={'primary'}
                            variant={"contained"}
                            onClick={() => onClickInfoButton(commission)}
                        >
                            Info
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}
