import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import {get, post} from "../utils/request";


const useStyles = theme => ({
    item: {
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        paddingRight: theme.spacing(2),

    },
    cell: {
        border: 'none',
    },
    firstCol: {
        width: '150px',
        border: 'none',
    },
    inputCell: {
        maxWidth: '50px',
        border: 'none',
    }
});

const InitialState = {
    entries: [
        "Full name",
        "Email",
        "Degree",
        "Contract",
        "Personal number",
        "Position"
    ],
    currentTeacherContract: '',
    contractInput: '',
    openInputField: false,
    teacher: null,

}

class EditTeacherDialogClass extends React.Component {
    //add name of value dialog
    constructor(props) {
        super(props);
        this.state = {
            openInputField: false,
            currentTeacherContract: '',
        }
    }

    componentDidMount() {
        console.log("EditTeacherDialogClass DID MOUNT")
        this.setState({
            ...this.props,
            ...InitialState,
            // currentTeacherContract: this.props.teacher.contract
        }, () => console.log(this.state))
        console.log("props", this.props)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            console.log("component did update", this.props)
            if (this.props.teacher) { //todo clean code
                get(`/teacher/${this.props.teacher.id}`).then((response) => {
                    this.setState({teacher: response.data}
                        , () => this.setState({currentTeacherContract: this.state.teacher.contract})
                    )
                })
                // this.setState({currentTeacherContract: this.state.teacher.contract})
            } else {
                console.log("INITIAL STATE")
                this.setState({
                    ...InitialState
                })
            }
        }
    }

    onClickEditButton = () => {
        console.log("onClickEditButton", this.state.openInputField)
        if (!this.state.openInputField) {
            console.log("edit", this.props)
        } else {
            //todo validate input, control input type
            if (this.state.contractInput == null || this.state.contractInput === '') {
                console.log('returmn', this.props.teacher.contract)
                this.setState({
                    currentTeacherContract: this.state.teacher.contract,
                    openInputField: !this.state.openInputField,
                })
                return
            }
            let payload = {
                ...this.props.teacher,
                id: undefined
            }
            payload.contract = this.state.contractInput
            console.log("save payload ", payload)
            post(`/teacher/${this.props.teacher.id}`, payload).then(response => console.log(response.data)).catch()
        }

        this.setState({
            openInputField: !this.state.openInputField,
            currentTeacherContract: this.state.contractInput,
        })
    }

    handleContractInput = (evt) => {
        const value = evt.target.value;
        console.log("handleContractInput", value)
        this.setState({contractInput: value})

    }

    render() {
        const {open, onClose, teacher, classes} = this.props;
        const buttonText = this.state.openInputField ? "Save" : "Edit";

        return (

            <div>
                {teacher &&
                <Dialog
                    open={open}
                    fullWidth={true}
                    onClose={onClose}
                >
                    <DialogTitle>Edit teacher {teacher.surname}</DialogTitle>
                    <DialogContent dividers>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className={classes.firstCol}>Full name </TableCell>
                                    <TableCell className={classes.cell}>
                                        {teacher.name} {teacher.surname}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.firstCol}>Email</TableCell>
                                    <TableCell className={classes.cell}>{teacher.email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.firstCol}>Degree</TableCell>
                                    <TableCell className={classes.cell}>{teacher.degree}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.firstCol}>Contract</TableCell>
                                    <TableCell className={classes.inputCell}>
                                        {!this.state.openInputField && this.state.currentTeacherContract}
                                        {this.state.openInputField &&
                                        <TextField
                                            id={"contractInput"}
                                            autoFocus={true}
                                            // defaultValue={this.state.currentTeacherContract
                                            //     ? this.state.currentTeacherContract
                                            //     : teacher.contract}

                                            // variant={"filled"}
                                            size={"small"}
                                            onChange={this.handleContractInput}
                                        />
                                        }
                                    </TableCell>
                                    <TableCell align="right" className={classes.cell}>
                                        <Button onClick={() => this.onClickEditButton()}>{buttonText}</Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.firstCol}>Personal number</TableCell>
                                    <TableCell className={classes.cell}>{teacher.personalNumber}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.firstCol}>Position</TableCell>
                                    <TableCell className={classes.cell}>{teacher.position}</TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Close</Button>
                    </DialogActions>
                </Dialog>}
            </div>
        );
    }

}

export default withStyles(useStyles)(EditTeacherDialogClass);