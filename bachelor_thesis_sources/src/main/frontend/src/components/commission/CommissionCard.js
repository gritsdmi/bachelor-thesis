import React from "react";
import {ListItem, ListItemText, makeStyles, Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(2),
        width: '250px',
    },
    cardActions: {
        display: "flex",
        justifyContent: "space-evenly",
        margin: theme.spacing(2),
    },
    list: {
        padding: theme.spacing(2),
        minHeight: '430px',
    },
}));

export default function CommissionCard({commission, onInfoClick, onEditClick}) {

    const classes = useStyles();

    if (!commission || !commission.exam) {
        return
    }

    const teachers = () => {
        return commission.teachers.map((teacher, idx) => {
            return (
                <ListItem key={idx}>
                    <ListItemText primary={teacher.name + " " + teacher.surname}/>
                </ListItem>
            )
        })
    }
    const buttonText = () => {
        if (commission.state === "DRAFT") {
            return "Create"
        } else {
            return "Edit"
        }
    }

    function strLocations() {
        let string = "Location "
        if (commission.exam.location !== null) {
            string += commission.exam.location.building + ":" + commission.exam.location.classroom
        }
        return string
    }

    return (
        <Paper className={classes.card}>
            <Box className={'titleBack'}>
                <Typography className={'title'} variant={'h6'}>Exam {commission.exam.date}</Typography>
            </Box>
            <List dense className={classes.list}>
                <ListItem>
                    <ListItemText>State: {commission.state}</ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText>Time: {commission.exam.time}</ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText>Degree: {commission.exam.degree}</ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText>Study field: {commission.exam.fieldOfStudy}</ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText>{strLocations()}</ListItemText>
                </ListItem>
                <ListItem>
                    <List>
                        {teachers()}
                    </List>
                </ListItem>
            </List>
            <Box className={classes.cardActions}>
                {commission.state !== 'DRAFT' &&
                <Button
                    color={'primary'}
                    variant={"contained"}
                    onClick={() => onInfoClick(commission)}
                >Info</Button>}

                <Button
                    color={'primary'}
                    variant={"contained"}
                    disabled={commission.state === 'APPROVED'}
                    onClick={() => onEditClick(commission)}
                >{buttonText()}</Button>
            </Box>
        </Paper>
    )
}
