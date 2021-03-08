import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import {Divider, ListItem, ListItemText, Paper} from "@material-ui/core";

import List from '@material-ui/core/List';
import {get, del} from "../utils/request"
import Button from "@material-ui/core/Button";

class CommissionsListPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            commissions: [],
        }

    }

    componentDidMount() {
        get("/commission").then((response) => {
            this.setState({commissions: response.data},
                () => console.log(this.state.commissions))
        })
    }

    componentDidUpdate(prevProps) {
        // console.log(this.state.commissions);
    }

    onGenerateButtonClick = () => {
        get("/util/gen/2").then((response) => {
            this.setState({commissions: response.data},
                () => console.log(this.state.commissions))
        })
    }

    onClearButtonClick = () => {
        del("/commission").then((response) => {
            this.setState({commissions: response.data},
                () => console.log(this.state.commissions))
        })
    }

    render() {

        const list =
            this.state.commissions &&
            this.state.commissions.map((commission, key) => {
                let text = commission.id + ". ";
                commission.teachers.forEach(teacher => {
                        text += teacher.surname + " ";
                    }
                )
                return (
                    <Box key={key}>
                        <ListItem>
                            <ListItemText primary={text}/>
                        </ListItem>
                        <Divider/>
                    </Box>
                )
            })
        return (
            <>
                <Container>
                    <Box>
                        <h1>
                            Commissions List Page
                        </h1>
                    </Box>
                    <Box>
                        <Button onClick={this.onGenerateButtonClick}>Generate 2</Button>
                        <Button onClick={this.onClearButtonClick}>Clear commissions</Button>
                        <Paper>
                            bla bla bla
                        </Paper>
                        <Card>
                            bla bla bla
                        </Card>
                        <Card>
                            bla bla bla
                        </Card>
                        <List>
                            {list}
                        </List>
                    </Box>
                </Container>
            </>


        )
    }

}

export default CommissionsListPage;