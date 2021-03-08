import React from "react";
import Container from "@material-ui/core/Container";
import {get} from "../utils/request";
import Box from "@material-ui/core/Box";

class ManageTeachersPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            teachers: null,
        }
    }

    componentDidMount() {
        get("/teacher").then((response) => {
            // this.setState({teachers: response.data}
            //     // , () => console.log(this.state.teachers)
            // )
        })
    }

    render() {
        return (
            <>
                <Container>
                    <h1>
                        Manage Teachers Page
                    </h1>
                    <Box>
                        {this.state.teachers}
                    </Box>
                </Container>

            </>
        )
    }
}

export default ManageTeachersPage;