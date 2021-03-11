import React from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles, TextField,} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {post} from "../utils/request";

const useStyles = makeStyles((theme) => ({
    container: {
        // display: 'grid',
        // gridTemplateColumns: 'repeat(12, 1fr)',
        // gridGap: theme.spacing(3),
        // padding: theme.spacing(1),

    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
    },
    item: {
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        paddingRight: theme.spacing(2),

    },
    button: {
        // marginLeft: theme.spacing(26),
        // float:"right",
        position: "relative",
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
}));

const InitialState = {
    openContractInput: false,
    inputContactValue: '',
    teacherContract: '',
}

export default function EditTeacherDialog({open, onClose, teacher}) {
    const styles = useStyles();

    const [openContractInput, setOpenContractInput] = React.useState(false);
    const [inputContactValue, setInputContactValue] = React.useState('');
    const [teacherContract, setTeacherContract] = React.useState(teacher ? teacher.contract : '');

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };
    // const handleClose = () => {
    //     setOpen(false);
    // };

    // function onClickEditContract() {
    //     console.log("onclick edit contract")
    //     const input = document.getElementById("contractInput");
    //     const data = document.getElementById("contract");
    //     if (input.style.display === "none") {
    //         input.style.display = "block";
    //         data.style.display = "none";
    //
    //     } else {
    //         input.style.display = "none";
    //         data.style.display = "block";
    //
    //     }
    // }

    const onClickEditContract = (evt) => {
        console.log("onClick test")
        if (!openContractInput) {
            console.log("Open input")
        } else {
            console.log(inputContactValue)

            if (inputContactValue == null || inputContactValue === '') {
                console.log('returmn')
                return
            }
            console.log("close input and send new contract", inputContactValue)
            //todo control/validate input
            updateContract()
        }
        setOpenContractInput(!openContractInput)
    }

    const onChangeContract = (e) => {
        console.log("onChangeContract  ", e.target.value)
        setInputContactValue(e.target.value)
    }

    function updateContract() {
        let newT = {...teacher}
        newT.contract = inputContactValue;
        setTeacherContract(inputContactValue);

        const payload = {...newT}
        console.log(payload)
        post(`/teacher/${teacher.id}`, payload).then().catch()
    }

    // function onCloseDialog() {
    //     console.log("onclodedialog")
    //     setOpenContractInput(InitialState.openContractInput)
    //     setInputContactValue(InitialState.inputContactValue)
    //     setTeacherContract(InitialState.teacherContract)
    //
    // }

    return (

        <div>

            {teacher &&
            <Dialog
                fullWidth={true}
                open={open}
                onClose={onClose}
            >
                <DialogTitle>Edit teacher {teacher.surname} </DialogTitle>
                <DialogContent dividers>
                    {/*<List>*/}
                    {/*    <ListItem> /!* //todo copy to clip button*!/*/}
                    {/*        <ListItemText primary={"Email: " + teacher.emailAddress}/>*/}
                    {/*    </ListItem>*/}
                    {/*    <ListItem>*/}
                    {/*        <ListItemText primary={"Degree: " + teacher.degree}/>*/}
                    {/*    </ListItem>*/}
                    {/*    <ListItem>*/}
                    {/*        <ListItemText primary={"Degree: " + teacher.degree}/>*/}
                    {/*    </ListItem>*/}
                    {/*    <ListItem>*/}
                    {/*        <ListItemText primary={"Degree: " + teacher.degree}/>*/}
                    {/*    </ListItem>*/}
                    {/*    <ListItem>*/}
                    {/*        <ListItemText id={"contract"} primary={"Contract: " + teacher.contract}/>*/}
                    {/*        {openContractInput &&*/}
                    {/*        <>*/}
                    {/*            <TextField*/}
                    {/*                id={"contractInput"}*/}
                    {/*                autoFocus={true}*/}
                    {/*                defaultValue={teacher.contract}*/}
                    {/*                // label={"Contract"}*/}
                    {/*                placeholder={"placeholder"}*/}
                    {/*                size={"small"}*/}
                    {/*            >*/}
                    {/*            </TextField>*/}
                    {/*            <Button onClick={onClickEditContract}>Save contract</Button>*/}
                    {/*        </>*/}
                    {/*        }*/}
                    {/*        {!openContractInput &&*/}
                    {/*        <>*/}
                    {/*            <Button onClick={onClickEditContract}>Edit contract</Button>*/}
                    {/*        </>*/}
                    {/*        }*/}
                    {/*    </ListItem>*/}
                    {/*    <ListItem>*/}
                    {/*        <ListItemText primary={"Personal number: " + teacher.personalNumber}/>*/}
                    {/*    </ListItem>*/}
                    {/*    <ListItem>*/}
                    {/*        <ListItemText primary={"Position: " + teacher.position}/>*/}
                    {/*    </ListItem>*/}

                    {/*</List>*/}
                    <Grid className={styles.container} container direction={'row'}>
                        <Grid item xs={4}>
                            <Grid className={styles.item} item>Full name</Grid>
                            <Grid className={styles.item} item>Email</Grid>
                            <Grid className={styles.item} item>Degree</Grid>
                            <Grid className={styles.item} item>Contract</Grid>
                            <Grid className={styles.item} item>Personal number</Grid>
                            <Grid className={styles.item} item>Position</Grid>
                        </Grid>
                        <Grid item xs>
                            <Grid className={styles.item} item>{teacher.name + " " + teacher.surname} </Grid>
                            <Grid className={styles.item} item>{teacher.emailAddress} </Grid>
                            <Grid className={styles.item} item>{teacher.degree} </Grid>
                            <Grid className={styles.item} item>
                                {teacherContract || "_"}
                                {openContractInput &&
                                <>
                                    <TextField
                                        id={"contractInput"}
                                        autoFocus={true}
                                        defaultValue={teacherContract}
                                        placeholder={"placeholder"}
                                        size={"small"}
                                        onChange={onChangeContract}
                                    />
                                    <Button className={styles.button} onClick={onClickEditContract}>Save</Button>
                                </>
                                }
                                {!openContractInput &&
                                <>
                                    <Button className={styles.button} onClick={onClickEditContract}>Edit</Button>
                                </>
                                }</Grid>
                            <Grid className={styles.item} item>{teacher.personalNumber}</Grid>
                            <Grid className={styles.item} item>{teacher.position}</Grid>
                        </Grid>

                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                    {/*<Button>Save</Button>*/}
                </DialogActions>
            </Dialog>
            }
        </div>

    );
}