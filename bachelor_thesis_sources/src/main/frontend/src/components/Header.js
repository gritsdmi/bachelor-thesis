import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Paper from '@material-ui/core/Paper';
import {NavLink} from "react-router-dom";
import {get, getUserFromLS} from "../utils/request"
import {Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";


const useStyles = theme => ({

    buttons: {
        padding: theme.spacing(1),
    },
    flex: {
        display: 'flex',
    },
    log: {
        display: 'flex',
        flexDirection: 'column',
    },
    flexVert: {
        display: "flex",
        flexDirection: 'column',

    }

})

const InitialState = {
    userId: null,
    username: null,
    role: null,
    user: '',
    fullUser: '',
}

class Header extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            ...InitialState,
            user: getUserFromLS() ? getUserFromLS() : '',
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.setState({
                user: getUserFromLS() ? getUserFromLS() : '',
            })
            console.log(this.state, this.props)
            // this.fetchUser()
        }
    }

    fetchUser() {
        if (this.props.loggedUserId) {
            get(`/user/${this.props.loggedUserId}`)
                .then(res => this.setState({
                    fullUser: res.data,
                }))

        }
    }

    onClickParseTeachers = () => {
        get("/util/4")
            .then(res => console.log("parsing ok"))
            .catch((error) => console.log(error))
    }

    logout = () => {
        localStorage.clear()
        this.props.onLogout()
        this.setState(InitialState, () => console.log(this.state))
        window.location.href = '/fem/index.html'
    }

    render() {
        const {classes} = this.props
        return (

            <Paper className={'header'}>
                <Grid container>
                    <Grid item xs>

                        <Box>
                            <Typography variant={'h3'}>
                                Final exam commissions manager
                            </Typography>
                        </Box>
                        <>

                            <Box className={classes.buttons}>
                                {(this.state.user.role === 'ROLE_MANAGER'
                                    || this.state.user.role === 'ROLE_TEST'
                                    || this.props.loggedUserRole === 'ROLE_TEST'
                                    || this.props.loggedUserRole === 'ROLE_MANAGER')
                                &&
                                <Box className={classes.flex}>
                                    <NavLink to="/commissions"> Commissions List </NavLink>
                                    <NavLink to="/auto">Auto Generating</NavLink>
                                    <NavLink to="/manual">Manual Generating</NavLink>
                                    <NavLink to="/manage">Manage teachers</NavLink>
                                    <NavLink to="/emails">emails</NavLink>
                                    <NavLink to="/permissions">admin</NavLink>
                                </Box>
                                }
                                {(this.state.user.role === 'ROLE_TEACHER'
                                    || this.state.user.role === 'ROLE_TEST'
                                    || this.props.loggedUserRole === 'ROLE_TEST'
                                    || this.props.loggedUserRole === 'ROLE_TEACHER')
                                &&
                                <Box className={classes.flex}>
                                    <NavLink to="/teacher">Teacher</NavLink>
                                    <NavLink to="/teacherPref">Teacher settings</NavLink>
                                </Box>
                                }
                                {/*<Button*/}
                                {/*    color={'secondary'}*/}
                                {/*    variant={'contained'}*/}
                                {/*    onClick={this.onClickParseTeachers}*/}
                                {/*>*/}
                                {/*    Parse teachers*/}
                                {/*</Button>*/}

                            </Box>
                        </>
                    </Grid>
                    <Grid item xs={2} className={classes.log}>
                        {/*{this.props.loggedUserRole &&*/}
                        <Box className={classes.flexVert}>
                            <Button
                                color={'secondary'}
                                variant={'contained'}
                                onClick={this.logout}
                            >
                                Logout
                            </Button>
                            <Typography>
                                {this.state.fullUser.name}
                                {" "}
                                {this.state.fullUser.surname}
                                {" "}
                            </Typography>
                        </Box>
                        {/*}*/}
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}

export default withStyles(useStyles)(Header)
