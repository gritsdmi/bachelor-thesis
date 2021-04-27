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
        width: '100%',
    },
    mainContainer: {
        display: 'flex',
        flexDirection: 'row',
    },

    typography: {
        margin: theme.spacing(1),
    },
    gridColumn: {
        padding: theme.spacing(2),
        flexDirection: 'column',
    },
    title: {
        paddingLeft: '20px',
    },
    button: {
        marginTop: theme.spacing(3),
    },

}))


export default function EmailListItem({template, onEditClick}) {
    const classes = useStyles();

    if (!template) {
        return <></>
    }

    return (
        <Paper
            className={classes.item}
        >
            <Box className={'titleBack'}>
                <Typography className={classes.title} variant={'h6'}>{template.emailType} Email</Typography>
            </Box>
            <Grid className={classes.mainContainer}>
                <Grid item xs={2} container className={classes.gridColumn}>
                    <Grid item className={classes.typography}><Typography>Subject</Typography></Grid>
                    <Grid item className={classes.typography}><Typography>Text</Typography></Grid>
                </Grid>

                <Grid container item xs className={classes.gridColumn}>
                    <Grid item xs className={classes.typography}><Typography>{template.subject}</Typography></Grid>
                    <Grid item xs className={classes.typography}><Typography>{template.text}</Typography></Grid>
                </Grid>

                <Grid container direction={'column'} alignItems={'center'} item xs={3}>
                    <Button
                        className={classes.button}
                        color={'primary'}
                        variant={'contained'}
                        onClick={onEditClick(template)}
                    >
                        Edit Template
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}