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
import {get, handleResponseError, post} from "../../utils/request";
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
        this.setState({...this.props})
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.open) {
            if (this.props !== prevProps) {
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
        this.setState({
            emailDialogOpen: true,
        })
    }

    onCloseEmailButtonClick = () => {
        this.setState({
            emailDialogOpen: false,
        })
    }

    onApproveButtonClick = commission => () => {
        const payload = {
            ...this.props.commission,
            state: 'APPROVED',
        }
        post(`/commission/${commission.id}`, payload)
            .then(response => this.setState({commission: response.data}
                , () => {
                    this.props.updComm(response.data)
                    this.props.onClose()
                }))
            .catch(error => handleResponseError(error))
    }

    onCommissionEditButtonClick = () => {
        this.state.history.push({
            pathname: "/manual",
            commission: this.state.commission,
        });
    }

    render() {
        if (!this.props.open || !this.state.commission) {
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
                        <Button
                            color={'primary'}
                            variant={'contained'}
                            onClick={this.onSendEmailButtonClick(teacher)}
                        >Send email</Button>
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
                                Exam date {this.state.commission.exam.date}
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
                            color={'secondary'}
                            variant={'contained'}
                            onClick={this.props.onClose}
                        >Close</Button>
                        <Button
                            color={'primary'}
                            variant={'contained'}
                            disabled={this.state.commission.state === 'APPROVED'}
                            onClick={this.onCommissionEditButtonClick}
                        >Edit</Button>
                        <Button
                            color={'primary'}
                            variant={'contained'}
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

export default withStyles(useStyles)(CommissionInfoDialog)
