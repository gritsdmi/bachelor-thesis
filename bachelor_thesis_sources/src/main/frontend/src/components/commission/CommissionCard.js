import React from "react";
import {Card, CardActions, CardContent, CardHeader, ListItem, ListItemText, makeStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";

const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(2),
        width: '250px',
    },
    cardActions: {
        display: "flex",
        justifyContent: "center"
    }
}));

export default function CommissionCard({commission, onInfoClick, onEditClick, onClose}) {

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
        let string = ""
        if (commission.exam.location !== null) {
            string = commission.exam.location.building + ":" + commission.exam.location.classroom
        }
        return string
    }

    return (
        <>
            <Card className={classes.card}>
                <CardHeader title={`Exam date ${commission.exam.date}`}/>
                <CardContent>
                    <List>
                        {/*<ListItem>*/}
                        {/*    <ListItemText>State: {commission.state}</ListItemText>*/}
                        {/*</ListItem>*/}
                        <ListItem>
                            <ListItemText>Time: {commission.exam.time}</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemText>Degree: {commission.exam.degree}</ListItemText>
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
                </CardContent>
                <CardActions className={classes.cardActions}>
                    {commission.state !== 'DRAFT' &&
                    <Button
                        color={'primary'}
                        variant={"contained"}
                        onClick={() => onInfoClick(commission)}
                    >Info</Button>}
                    {commission.state !== 'APPROVED' &&
                    <Button
                        color={'primary'}
                        variant={"contained"}
                        onClick={() => onEditClick(commission)}
                    >{buttonText()}</Button>}
                </CardActions>
            </Card>
        </>
    )
}
