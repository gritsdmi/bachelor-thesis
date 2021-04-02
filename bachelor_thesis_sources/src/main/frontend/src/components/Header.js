import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Paper from '@material-ui/core/Paper';
import {NavLink} from "react-router-dom";
import {get} from "../utils/request"

class Header extends React.Component {
    //TODO reset styles

    constructor(props) {
        super(props)
    }

    onClickParseTeachers = () => {
        console.log("onClickParseTeachers")
        get("/util/4")
            .then(() => console.log("parse ok"))
            .catch((error) => console.log(error))
    }

    render() {
        return (
            <>
                <Paper>
                    <Box>
                        <h3>
                            GruSt - application for managing state exam topics.
                        </h3>
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
                        <Button
                            onClick={this.onClickParseTeachers}
                        >
                            Parse teachers
                        </Button>

                        <Button>
                            <NavLink to="/teacher">Teacher</NavLink>
                        </Button>
                        <Button>
                            <NavLink to="/teacher/cal">Teacher cal</NavLink>
                        </Button>
                    </Box>
                </Paper>


            </>
        )
    }
}

export default Header;