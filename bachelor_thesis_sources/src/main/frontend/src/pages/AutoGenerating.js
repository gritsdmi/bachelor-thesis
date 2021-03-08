import React from "react";
import Container from "@material-ui/core/Container";
import {get} from "../utils/request";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

class AutoGeneratingPage extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    onGenerateButtonClick() {
        get("/util/gen/2").then((response) => {
            this.state({commissions: response.data})
        })
    }

    render() {
        return (
            <>
                <Container>
                    <h1>
                        AutoGenerating Page
                    </h1>
                    <Button onClick={this.onGenerateButtonClick}>Generate 2</Button>

                </Container>

            </>
        )
    }
}

export default AutoGeneratingPage;