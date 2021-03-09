import React from "react";
import Container from "@material-ui/core/Container";
import {get} from "../utils/request";
import Box from "@material-ui/core/Box";
import {Divider, ListItem, ListItemText} from "@material-ui/core";
import List from "@material-ui/core/List";

class ManageTeachersPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            teachers: [],
        }
    }

    componentDidMount() {
        get("/teacher/can").then((response) => {
            this.setState({teachers: response.data}
                , () => console.log(this.state.teachers)
            )
        })
    }

    render() {

        const teachersList = this.state.teachers && this.state.teachers.map((teacher, key) => {
            return (
                <Box key={key}>
                    <ListItem>
                        <ListItemText primary={teacher.id + " " + teacher.name + " " + teacher.surname}/>
                    </ListItem>
                    <Divider/>
                </Box>
            )
        })
        return (
            <>
                <Container>
                    <h1>
                        Manage Teachers Page
                    </h1>
                    <Box>
                        <List>
                            {teachersList}
                        </List>
                    </Box>
                </Container>

            </>
        )
    }
}

export default ManageTeachersPage;