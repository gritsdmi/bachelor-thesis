import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Paper from '@material-ui/core/Paper';

class Header extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                <Paper>
                    <Box>
                        GruSt - application for managing state exam topics.
                    </Box>
                    <Box>
                        <Button>Commissions List</Button>
                        <Button>Auto Generating</Button>
                        <Button>Manual Generating</Button>
                        <Button>Manage teachers</Button>
                        <Button>
                            <AccountBoxIcon>

                            </AccountBoxIcon>
                        </Button>
                    </Box>
                </Paper>


            </>
        )
    }
}

export default Header;