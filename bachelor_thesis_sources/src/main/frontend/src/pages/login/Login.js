import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {Paper, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {get, post} from "../../utils/request"
import NewPasswordDialog from "./NewPasswordDialog";
import Box from "@material-ui/core/Box";

const useStyles = theme => ({
    paper: {
        width: "400px",
        height: "400px",
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
    form: {
        display: "flex",
        flexDirection: "column",
        width: '90%',
    },
    input: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    flex: {
        display: 'flex',
        justifyContent: 'center',
        margin: theme.spacing(3),
    },
    button: {
        margin: theme.spacing(2),
    },
});

const InitialState = {
    loginInput: '',
    passwordInput: '',
    token: '',
    newPasswordDialogOpen: false,
    data: null,
}

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...InitialState,
        }
    }

    onClickLoginButton = () => {
        const payload = {
            username: this.state.loginInput,
            password: this.state.passwordInput,
        }

        console.log("onClickLoginButton", payload)


        post('/auth', payload)
            .then(res => this.setState({
                token: res.data.jwt,
                data: res.data,
            }, () => {
                this.renameThis()
            }))
        // .catch(err => handleResponseError(err))

    }

    //todo rename
    renameThis() {
        const data = this.state.data
        console.log(data)

        if (data.firstLogin) {
            this.setState({
                newPasswordDialogOpen: true,
            })
        } else {
            this.goNext()
        }
    }

    goNext(newPass) {
        this.fillLocalStorage()
        console.log(newPass)

        console.log(this.state.data)

        if (newPass) {
            const payload = {
                id: this.state.data.userId,
                password: newPass,
            }

            post(`/user/teacher/pass/`, payload)
                .then(res => {
                    console.log(res)
                    this.redirect()
                })
                .catch(err => this.onClickCancel())
        } else {
            this.redirect()
        }
    }

    redirect() {
        const data = this.state.data
        if (data.role === "ROLE_TEACHER") {
            window.location.href = '/teacher';
        }
        if (data.role === "ROLE_MANAGER") {
            window.location.href = '/commissions'
        }
        if (data.role === "ROLE_TEST") {
            window.location.href = '/commissions'
        }
    }

    fillLocalStorage() {
        if (this.state.data) {
            const data = this.state.data
            localStorage.setItem('token', JSON.stringify(data.jwt));
            localStorage.setItem('userId', JSON.stringify(data.userId));
            localStorage.setItem('username', JSON.stringify(data.username));
            localStorage.setItem('role', JSON.stringify(data.role));
        }
    }

    onChangeInputLogin = (e) => {
        this.setState({
            loginInput: e.target.value,
        })
    }

    onChangeInputPass = (e) => {
        this.setState({
            passwordInput: e.target.value,
        })
    }

    tokenTest = () => {
        const token = this.state.token
        get('/user/teacher', token)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    onCloseDialog = () => {
        this.setState({
            newPasswordDialogOpen: false,
        })
    }

    onClickCancel = () => {
        console.log("onClickCancel")
        localStorage.clear()
        this.onCloseDialog()
        this.setState({...InitialState}, () => console.log(this.state))
        window.location.href = '/login'

    }

    onSubmit = input => () => {
        console.log("onSubmit", input)
        if (!input || input === '') {
            return
        }
        this.onCloseDialog()
        this.goNext(input)
    }

    render() {
        const {classes} = this.props

        return (
            <Box className={classes.flex}>
                <NewPasswordDialog
                    open={this.state.newPasswordDialogOpen}
                    // onClose={this.onCloseDialog}
                    onCancel={this.onClickCancel}
                    onSubmit={this.onSubmit}
                />
                <Paper
                    className={classes.paper}
                >
                    <h1>Login</h1>
                    <form
                        className={classes.form}
                    >
                        <TextField
                            className={classes.input}
                            id={"login-input"}
                            label={'Login'}
                            onChange={this.onChangeInputLogin}
                        />
                        <TextField
                            className={classes.input}
                            id={"password-input"}
                            label={'Password'}
                            type={'password'}
                            onChange={this.onChangeInputPass}
                        />
                        <Button
                            color={'primary'}
                            variant={'contained'}
                            onClick={this.onClickLoginButton}
                            className={classes.button}
                        >
                            Login
                        </Button>
                        <Button
                            color={'secondary'}
                            variant={'contained'}
                            onClick={this.tokenTest}
                            className={classes.button}

                        >token test</Button>
                    </form>
                </Paper>
            </Box>
        );
    }
}

export default withStyles(useStyles)(Login)
