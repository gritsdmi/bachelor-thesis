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

    if (!commission || commission.exam) {
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

    return (
        <>
            <Card className={classes.card}>
                <CardHeader title={"Exam date "}>

                </CardHeader>
                <CardContent>
                    <List>
                        <ListItem>
                            <ListItemText>State: {commission.state}</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemText>Degree: </ListItemText>
                        </ListItem>
                        <ListItem>
                            <List>
                                {teachers()}
                            </List>
                        </ListItem>
                    </List>
                </CardContent>
                <CardActions className={classes.cardActions}>
                    <Button
                        onClick={() => onInfoClick(commission)}
                    >Info</Button>
                    {commission.state !== 'APPROVED' &&
                    <Button
                        onClick={() => onEditClick(commission)}
                    >Edit</Button>}
                </CardActions>
            </Card>
        </>
    )

}