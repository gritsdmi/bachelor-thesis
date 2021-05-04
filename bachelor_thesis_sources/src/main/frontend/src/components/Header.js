import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Paper from '@material-ui/core/Paper';
import {NavLink} from "react-router-dom";
import {get} from "../utils/request"
import {Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";


const useStyles = theme => ({

    buttons: {
        padding: theme.spacing(1),
    },

})

const InitialState = {
    userId: null,
    username: null,
    role: null,
    user: null,
}

class Header extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            userId: JSON.parse(localStorage.getItem('userId')),
            username: JSON.parse(localStorage.getItem('username')),
            role: JSON.parse(localStorage.getItem('role')),
            user: JSON.parse(localStorage.getItem('user')),
        }
    }

    onClickParseTeachers = () => {
        get("/util/4")
            .then(res => console.log("parsing ok"))
            .catch((error) => console.log(error))
    }

    clearLS = () => {
        localStorage.clear()
        this.setState(InitialState, () => console.log(this.state))
    }

    render() {
        const {classes} = this.props
        return (
            <Paper className={'header'}>
                <Box>
                    <Typography
                        variant={'h3'}
                    >
                        Final exam commissions manager
                    </Typography>
                </Box>
                <Box>
                    <Typography>
                        id:
                        {this.state.userId}
                    </Typography>
                    <Typography>
                        username:
                        {this.state.username}
                    </Typography>
                    <Typography>
                        role:
                        {this.state.role}
                    </Typography>
                    <Typography>
                        user:
                        {/*{this.state.user}*/}
                    </Typography>
                </Box>
                <Box className={classes.buttons}>
                    <NavLink to="/commissions"> Commissions List </NavLink>
                    <NavLink to="/auto">Auto Generating</NavLink>
                    <NavLink to="/manual">Manual Generating</NavLink>
                    <NavLink to="/manage">Manage teachers</NavLink>
                    <NavLink to="/emails">emails</NavLink>
                    <NavLink to="/permissions">admin</NavLink>
                    <NavLink to="/teacher">Teacher</NavLink>
                    <NavLink to="/teacherPref">Teacher settings</NavLink>
                    <Button
                        color={'secondary'}
                        variant={'contained'}
                        onClick={this.onClickParseTeachers}
                    >
                        Parse teachers
                    </Button>
                    <Button
                        color={'secondary'}
                        variant={'contained'}
                        onClick={this.clearLS}
                    >
                        ClearLocalStorage
                    </Button>
                </Box>
            </Paper>
        )
    }
}

export default withStyles(useStyles)(Header)
