import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Paper from '@material-ui/core/Paper';
import {NavLink} from "react-router-dom";
import {get} from "../utils/request"
import {Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";


const useStyles = theme => ({

    header: {},

})

const InitialState = {
    userId: null,
    username: null,
    role: null,
}

class Header extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            userId: JSON.parse(localStorage.getItem('userId')),
            username: JSON.parse(localStorage.getItem('username')),
            role: JSON.parse(localStorage.getItem('role')),

        }
        // localStorage.setItem('token', JSON.stringify(data.jwt));
        // localStorage.setItem('userId', JSON.stringify(data.userId));
        // localStorage.setItem('username', JSON.stringify(data.username));
        // localStorage.setItem('role', JSON.stringify(data.role));
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
            <Paper className='header'>
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
                </Box>
                <Box>
                    <Button>
                        <NavLink to="/commissions">Commissions List</NavLink>
                    </Button>
                    <Button>
                        <NavLink to="/auto">Auto Generating</NavLink>
                    </Button>
                    <Button>
                        <NavLink to="/manual">Manual Generating</NavLink>
                    </Button>
                    <Button>
                        <NavLink to="/manage">Manage teachers</NavLink>
                    </Button>

                    <Button>
                        <NavLink to="/emails"><AccountBoxIcon/></NavLink>
                    </Button>

                    <Button>
                        <NavLink to="/permissions"><AccountBoxIcon/></NavLink>
                    </Button>

                    <Button>
                        <NavLink to="/teacher">Teacher</NavLink>
                    </Button>
                    <Button>
                        <NavLink to="/teacher/settings">Teacher settings</NavLink>
                    </Button>
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
