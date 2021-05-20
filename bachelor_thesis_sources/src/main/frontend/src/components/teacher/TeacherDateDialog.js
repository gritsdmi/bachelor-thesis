import React from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = theme => ({
    title: {
        textAlign: 'center',
    },
});

const InitialState = {
    color: "blank",
}

class TeacherDateDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.setState({
                color: this.handleColor(),
            })
        }
    }

    handleColor() {
        if (!this.props.color) {
            return
        }
        if (this.props.color === "green") {
            return "green"
        }
        if (this.props.color === "red") {
            return "red"
        }
        return "blank"
    }

    render() {
        const {classes} = this.props
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <DialogTitle className={classes.title}>
                    {this.props.date}
                </DialogTitle>
                <DialogContent>

                </DialogContent>
                <DialogActions>
                    <Button
                        color={'secondary'}
                        variant={'contained'}
                        onClick={this.props.onClose}
                    >Close</Button>
                    {this.state.color === "blank" &&
                    <Button
                        color={'primary'}
                        variant={'contained'}
                        onClick={this.props.onClickCantAttend}
                    >Can't attend</Button>
                    }
                    {this.state.color === "red" &&
                    <Button
                        color={'primary'}
                        variant={'contained'}
                        onClick={this.props.onClickCan}
                    >Can attend</Button>
                    }
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(useStyles)(TeacherDateDialog)
