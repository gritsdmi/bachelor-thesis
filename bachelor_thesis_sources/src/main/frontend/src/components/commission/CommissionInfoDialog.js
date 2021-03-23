import React from "react";

import {withStyles} from "@material-ui/core/styles";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {get, post} from "../../utils/request";
import EmailDialog from "../email/EmailDialog";

const useStyles = theme => ({

    cell: {
        border: 'none',
    },
    firstCol: {
        width: '250px',
        border: 'none',
    }

});

const InitialState = {
    open: false,
    commission: null,
    emailDialogOpen: false,
}

class CommissionInfoDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commission: null,
            emailDialogOpen: false,
        }
    }

    componentDidMount() {
        console.log("CommissionInfoDialog DID mount")
        this.setState({...this.props})
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("CommissionInfoDialog DID update")
        if (this.props.open) {
            if (this.props !== prevProps) {
                console.log("CommissionInfoDialog UPDATE newprops ")
                console.log(prevProps)
                console.log(this.props)
                get(`/commission/${this.props.commission.id}`)
                    .then(response => this.setState({
                        commission: response.data
                    }, () => console.log(this.state.commission)))
            }
        } else if (!this.props.open) {
            // this.setState({...InitialState})
        }
    }

    onSendEmailButtonClick = teacher => () => {
        console.log("on send email button click", teacher)
        this.setState({
            emailDialogOpen: true,
        })
    }

    onCloseEmailButtonClick = () => {
        console.log("on onCloseEmailButtonClick")
        this.setState({
            emailDialogOpen: false,
        })
    }

    onApproveButtonClick = commission => () => {
        console.log("on approve button click", commission)
        const payload = {
            ...this.props.commission,
            state: 'APPROVED',
        }
        console.log(payload)
        post(`/commission/${commission.id}`, payload)
            .then(response => this.setState({commission: response.data}
                , () => this.props.updComm(response.data)))
            .catch(response => console.log("some error occurred", response))

    }

    render() {
        if (!this.props.open) {
            if (!this.state.commission) {
                return (<></>)
            }
            return (<></>)
        }
        if (this.state.commission === null) {
            return (<></>)
        }
        const {classes} = this.props;

        const teacherTable = this.props.commission.teachers.map((teacher, idx) => {
            return (
                <TableRow key={idx}>
                    <TableCell className={classes.firstCol}>{teacher.name} {teacher.surname}</TableCell>
                    <TableCell
                        className={classes.cell}
                        align={'right'}
                    >
                        <Button onClick={this.onSendEmailButtonClick(teacher)}>Send email</Button>
                    </TableCell>
                </TableRow>
            )
        })
        return (
            <div>

                <Dialog
                    // fullWidth
                    open={this.props.open}
                    onClose={this.props.onClose}
                >
                    <DialogTitle>Commission info </DialogTitle>
                    <DialogContent
                        dividers
                    >
                        <Grid
                            container
                            direction={'column'}
                        >
                            <Typography>
                                Exam date {this.state.commission.exam.date.date}
                            </Typography>
                            <Typography>
                                State {this.state.commission.state}
                            </Typography>
                            <Typography>
                                Location
                                {" " + this.props.commission.exam.location.building + ": " +
                                this.props.commission.exam.location.classroom}
                            </Typography>
                            <Table>
                                <TableBody>
                                    {teacherTable}
                                </TableBody>
                            </Table>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.props.onClose}
                        >Close</Button>
                        <Button
                            disabled={this.state.commission.state === 'APPROVED'}
                            onClick={this.props.onEditClick}
                        >Edit</Button>
                        <Button
                            disabled={this.state.commission.state === 'APPROVED'}
                            onClick={this.onApproveButtonClick(this.props.commission)}
                        >Approve</Button>
                    </DialogActions>
                </Dialog>

                <EmailDialog
                    open={this.state.emailDialogOpen}
                    onClose={this.onCloseEmailButtonClick}
                    teachers={this.state.commission.teachers}
                />
            </div>
        )
    }
}

export default withStyles(useStyles)(CommissionInfoDialog);
