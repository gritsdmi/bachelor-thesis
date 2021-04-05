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
import {get, post} from "../../utils/request";

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
        this.setState({
            ...this.props,
            ...InitialState,
        }, () => console.log(this.state))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            if (this.props.teacher) {
                this.fetchTeacher()
            } else {
                this.setState({
                    ...InitialState
                })
            }
        }
    }

    fetchTeacher() {
        get(`/user/teacher/${this.props.teacher.id}`)
            .then((response) => {
                this.setState({
                        teacher: response.data
                    }, () => this.setState({
                        currentTeacherContract: this.state.teacher.teacher.contract
                    }
                    , () => console.log(response.data)
                    )
                )
            })
            .catch(err => console.log(err))
    }

    onClickEditButton = () => {
        console.log("onClickEditButton", this.state.openInputField)
        if (!this.state.openInputField) {
            console.log(this.props)
        } else {
            //todo validate input, control input type
            if (this.state.contractInput == null || this.state.contractInput === '') {
                console.log(this.props.teacher.contract)
                this.setState({
                    currentTeacherContract: this.state.teacher.contract,
                    openInputField: !this.state.openInputField,
                })
                return
            }
            let payload = {
                ...this.props.teacher,
                // id: undefined
            }
            payload.teacher.contract = parseFloat(this.state.contractInput)
            console.log("update payload ", payload) //UserTO
            post(`/user/teacher/${this.props.teacher.id}`, payload)
                .then(response => console.log(response.data))
                .catch(err => console.log(err))
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

    positionsStr() {
        let str = "";
        this.state.teacher.teacher.positionInCommissions.map(pos => {
            str += pos.description + ' '
        })
        return str
    }

    datesStr() {
        let str = "";
        this.state.teacher.teacher.unavailableDates.map(date => {
            str += date.date + ' '
        })
        return str
    }


    render() {
        if (!this.state.teacher) {
            return <></>
        }

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
                                    <TableCell className={classes.cell}>{teacher.emailAddress}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.firstCol}>Degree</TableCell>
                                    <TableCell className={classes.cell}>{teacher.teacher.degree}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.firstCol}>Contract</TableCell>
                                    <TableCell className={classes.inputCell}>
                                        {!this.state.openInputField && this.state.currentTeacherContract}
                                        {this.state.openInputField &&
                                        <TextField
                                            id={"contractInput"}
                                            autoFocus={true}
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
                                    <TableCell className={classes.firstCol}>Positions</TableCell>
                                    <TableCell className={classes.cell}>{this.positionsStr()}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.firstCol}>Unavailable dates</TableCell>
                                    <TableCell className={classes.cell}>{this.datesStr()}</TableCell>
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
