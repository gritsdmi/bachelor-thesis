import React, {useState} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    button: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    flex: {
        display: "flex",
        flexDirection: "column",
    },
    input: {
        margin: theme.spacing(2),
    },
    itemTypography: {
        display: 'flex',
        alignItems: 'center',
    },

}));

export default function NewPasswordDialog({open, onClose, onCancel, onChangeInput, onSubmit}) {

    const [inputPas, setInputPas] = useState('')
    const [inputRep, setInputRep] = useState('')
    const [match, setMatch] = useState(false)
    const classes = useStyles();

    function onChangePass(e) {
        setInputPas(e.target.value)
        controlMatch(e.target.value, inputRep)
    }

    function onChangePassRepeat(e) {
        setInputRep(e.target.value)
        controlMatch(inputPas, e.target.value)
    }

    function controlMatch(val1, val2) {
        if (val1 === val2) {
            setMatch(true);
        } else {
            setMatch(false)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onCancel}
        >
            <DialogTitle>
                New password
            </DialogTitle>
            <DialogContent
                className={classes.flex}
                dividers
            >
                <Grid container>
                    <Grid item xs={5} className={classes.itemTypography}><Typography>Password</Typography> </Grid>
                    <Grid item xs>
                        <TextField
                            onChange={onChangePass}
                            placeholder={'New password'}
                            autoFocus
                            className={classes.input}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={5} className={classes.itemTypography}> <Typography>Repeat
                        password</Typography></Grid>
                    <Grid item xs>
                        <TextField
                            onChange={onChangePassRepeat}
                            type={'password'}
                            placeholder={'Repeat password'}
                            className={classes.input}
                            error={inputRep && !match}
                        />
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button
                    color={'primary'}
                    variant={'contained'}
                    onClick={onSubmit(inputPas)}
                    disabled={!match}
                >
                    Save
                </Button>
                <Button
                    color={'secondary'}
                    variant={'contained'}
                    onClick={onCancel}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}