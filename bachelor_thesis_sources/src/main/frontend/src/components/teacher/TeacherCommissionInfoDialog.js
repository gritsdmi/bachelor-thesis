import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TeacherRecommendDialog from "./TeacherRecommendDialog";

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
    commission: null,
    currentTeacherId: null,

    recommendDialogOpen: false,
}

class TeacherCommissionInfoDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
        }
    }

    comTeachers() {
        let string = ""
        this.props.commission.teachers.forEach(teacher => string
            += teacher.name ? teacher.name : '' + ' ' + teacher.surname)
        return string
    }

    onClickCantAttendButton = () => {
        console.log("onClickCantAttendButton")
        this.setState({
            recommendDialogOpen: true,

        })
    }

    onCloseRecommendDialog = () => {
        console.log("onCloseRecommendDialog")
        this.setState({
            recommendDialogOpen: false,
        })
    }

    render() {
        const {commission, classes} = this.props
        if (!this.props.commission)
            return <></>

        return (
            <>
                <TeacherRecommendDialog
                    open={this.state.recommendDialogOpen}
                    onClose={this.onCloseRecommendDialog}
                    date={commission.exam.date}
                    commission={commission}
                    currentTeacherId={this.props.currentTeacherId}
                />
                <Dialog
                    open={this.props.open}
                    onClose={this.props.onClose}
                    fullWidth
                >
                    <DialogTitle>Commission Info Dialog</DialogTitle>
                    <DialogContent dividers>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className={classes.firstCol}>Date</TableCell>
                                    <TableCell className={classes.cell}>{commission.exam.date}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.firstCol}>Time</TableCell>
                                    <TableCell className={classes.cell}>{commission.exam.time}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.firstCol}>Location</TableCell>
                                    <TableCell className={classes.cell}>{commission.exam.location.building
                                    + ":" + commission.exam.location.classroom}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.firstCol}>Commission</TableCell>
                                    <TableCell className={classes.cell}>{this.comTeachers()}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.firstCol}>Commission state</TableCell>
                                    <TableCell className={classes.cell}>{commission.state}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.firstCol}>Teacher reaction</TableCell>
                                    <TableCell className={classes.cell}>null</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </DialogContent>
                    <DialogActions>

                        <Button>
                            Will attend
                        </Button>
                        <Button
                            onClick={this.onClickCantAttendButton}
                        >
                            Can't attend
                        </Button>
                        <Button
                            onClick={this.props.onClose}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }

}

export default withStyles(useStyles)(TeacherCommissionInfoDialog)