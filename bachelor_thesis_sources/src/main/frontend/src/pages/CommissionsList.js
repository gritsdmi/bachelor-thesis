import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import {Divider, ListItem, ListItemText} from "@material-ui/core";

import List from '@material-ui/core/List';
import {get} from "../utils/request"
import Header from "../components/Header";

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

    render() {

        const list = this.state.commissions && this.state.commissions.map((commission, key) => {
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
                    <Header/>
                    <Box>
                        Commissions List Page
                    </Box>
                    <Box>
                        <Card>
                            bla bla bla
                        </Card>
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