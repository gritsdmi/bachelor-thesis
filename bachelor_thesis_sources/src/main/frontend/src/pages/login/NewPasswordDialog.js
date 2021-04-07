import React, {useState} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";

//TODO css
export default function NewPasswordDialog({open, onClose, onCancel, onChangeInput, onSubmit}) {

    const [inputPas, setInputPas] = useState('')
    const [inputRep, setInputRep] = useState('')
    const [match, setMatch] = useState(false)

    function onChangePass(e) {
        console.log('onChangePass', e.target.value)
        setInputPas(e.target.value)
        controlMatch(e.target.value, inputRep)
    }

    function onChangePassRepeat(e) {
        console.log('onChangeRep', e.target.value)
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
                New password dialog
            </DialogTitle>
            <DialogContent>
                <TextField
                    onChange={onChangePass}
                    // type={'password'}
                    placeholder={'New password'}
                    autoFocus
                />
                <TextField
                    onChange={onChangePassRepeat}
                    type={'password'}
                    placeholder={'Repeat password'}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onSubmit(inputPas)}
                    disabled={!match}
                >
                    Save
                </Button>

                <Button
                    onClick={onCancel}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}