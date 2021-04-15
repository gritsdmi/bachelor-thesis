import React from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = theme => ({
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    item: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    }

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
            // console.log(this.props)
            this.setState({
                color: this.handleColor(),
            })
        }
    }

    onClickAccept = () => {
        console.log("onClickAccept")
    }

    handleColor() {
        if (!this.props.color) {
            return
        }
        if (this.props.color === "green") {
            console.log("click green Color")
            return "green"
        }
        if (this.props.color === "red") {
            console.log("click red Color")
            return "red"
        }

        // console.log("click blank Color")
        return "blank"
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <DialogTitle>
                    {this.props.date}
                </DialogTitle>
                <DialogContent>

                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={this.props.onClose}
                    >Close</Button>
                    {this.state.color === "blank" &&
                    <Button
                        onClick={this.props.onClickCantAttend}
                    >Can't attend</Button>
                    }
                    {this.state.color === "red" &&
                    <Button
                        onClick={this.props.onClickCan}
                    >Can attend</Button>
                    }
                </DialogActions>
            </Dialog>
        );
    }

}

export default withStyles(useStyles)(TeacherDateDialog)
