import React from "react";
import {Grid, makeStyles, Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({

    item: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        // color:"red",
    },
    buttonBox: {
        justifyContent: 'center',
    },
    m1: {
        margin: theme.spacing(1),
    },
    title: {
        paddingLeft: '20px',
    }

}))

//used in commission list and teacher overview
export default function CommissionListItem({commission, onClickInfoButton, onClickEditButton, lastItem}) {

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

    const classes = useStyles()

    return (
        <Paper
            className={`${classes.item}`}
        >
            <Box className={'titleBack'}>
                <Typography className={classes.title} variant={'h6'}>Exam {commission.exam.date}</Typography>
            </Box>
            <Grid container direction={'row'} wrap={"nowrap"}>
                <Grid direction={'column'} container item xs className={classes.item}>
                    <Grid item>
                        <Typography> {"Location " + strLocations()} </Typography>
                    </Grid>
                    <Grid item>
                        <Typography>{"Date " + commission.exam.date + " Time " + commission.exam.time}</Typography>
                    </Grid>
                </Grid>
                <Grid direction={'column'} container item xs className={classes.item}>
                    <Grid item>
                        <Typography>{"State " + commission.state}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography> {"Teachers:" + strTeachers()}</Typography>
                    </Grid>
                </Grid>
                <Grid direction={'column'} container justify={"center"} item xs={2}>
                    <Grid item container justify={"space-evenly"}>
                        <Button
                            color={'primary'}
                            variant={"contained"}
                            onClick={() => onClickInfoButton(commission)}
                        >
                            Info
                        </Button>
                        <Button
                            color={'primary'}
                            variant={"contained"}
                            onClick={() => onClickEditButton(commission)}
                        >
                            Edit
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}
