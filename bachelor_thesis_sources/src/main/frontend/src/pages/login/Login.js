import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {Paper, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";

const useStyles = theme => ({
    paper: {
        width: "400px",
        height: "400px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    input: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
});

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    onClickLoginButton = () => {
        console.log("onClickLoginButton")
    }

    render() {
        const {classes} = this.props

        return (
            <div>
                <Paper
                    className={classes.paper}
                >
                    <h1>Login page</h1>
                    <form
                        className={classes.form}
                    >
                        <TextField
                            className={classes.input}
                            id={"login-input"}
                            label={'Login'}
                        />
                        <TextField
                            className={classes.input}
                            id={"password-input"}
                            label={'Password'}
                            type={'password'}
                        />
                        <Button
                            color={'primary'}
                            onClick={this.onClickLoginButton}
                        >
                            Login
                        </Button>
                    </form>
                </Paper>
            </div>
        );
    }

}

export default withStyles(useStyles)(Login)
