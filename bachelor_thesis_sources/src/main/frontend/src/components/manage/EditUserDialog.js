import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {get, getUserFromLS, handleResponseError, post} from "../../utils/request"
import {Checkbox} from "@material-ui/core";

const useStyles = theme => ({
    title: {
        textAlign: 'center',
    },
    typography: {
        alignSelf: 'center',
    },
    gridLine: {
        padding: theme.spacing(2),
    },
    content: {
        width: '300px',
    },
    checkbox: {
        display: 'flex',
        justifyContent: 'center',
    },
});

const InitialState = {
    user: '',
    activeUser: true,
    loggedUserId: getUserFromLS() ? getUserFromLS().userId : '',
}

class EditUserDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.open && this.props !== prevProps) {
            this.setState({
                    user: this.props.user,
                    activeUser: this.props.user.active,
                    loggedUserId: getUserFromLS() ? getUserFromLS().userId : '',
                }
            )
        }
    }

    onClickResetPass = () => {
        get(`/user/resetPass/${this.state.user.id}`)
            .then(res => {
                this.props.onSave('pas')
            })
            .catch(err => handleResponseError(err))
    }

    onClickSave = () => {
        const payload = {
            ...this.state.user,
            active: this.state.activeUser,
        }
        post(`/user/${this.state.user.id}`, payload)
            .then(res => {
                this.props.onSave('save')
            })
            .catch(err => handleResponseError(err))
    }

    onClickCheckBox = () => {
        this.setState({
            activeUser: !this.state.activeUser,
        })

    }

    render() {
        const {classes} = this.props

        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                className={classes.dialog}
            >
                <DialogTitle
                    className={classes.title}
                >
                    Edit user
                </DialogTitle>
                <DialogContent dividers className={classes.content}>
                    <Grid container className={classes.gridLine}>
                        <Grid item xs className={classes.typography}>Active user</Grid>
                        <Grid item xs={3} className={classes.checkbox}>
                            <Checkbox
                                disabled={this.state.user.id === this.state.loggedUserId}
                                onClick={this.onClickCheckBox}
                                checked={this.state.activeUser}
                                color={"primary"}
                            />
                        </Grid>
                    </Grid>
                    <Grid>
                        <Button
                            onClick={this.onClickResetPass}
                            color={'primary'}
                            variant={'contained'}
                        >Reset Password</Button>
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
                        onClick={this.onClickSave}
                    >Save</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(useStyles)(EditUserDialog)
