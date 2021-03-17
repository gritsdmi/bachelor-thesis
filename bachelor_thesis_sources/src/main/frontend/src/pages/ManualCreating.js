import React from "react";
import Container from "@material-ui/core/Container";
import {withStyles} from "@material-ui/core/styles";
import SearchBox from "../components/SearchBox";
import CommissionParameters from "../components/CommissionParameters";
import {Grid} from "@material-ui/core";

const InitialState = {
    searchPattern: '',
}

const useStyles = theme => ({
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    }
});

class ManualCreatingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
    }

    componentDidMount() {
        console.log("ManualCreatingPage DID MOUNT")
    }

    handleSearchBoxInput = (event) => {
        const value = event.target.value;
        if (value && value !== '') {
            console.log("apply filter")
            this.setState({searchPattern: value})
        } else {
            console.log("clear filter")
            this.setState({searchPattern: ''})
        }
    }

    render() {
        return (
            <>
                <Container>
                    <h1>
                        Manual Creating Page
                    </h1>
                    <SearchBox
                        // onClickButton={}
                        searchPattern={this.state.searchPattern}
                        onChange={this.handleSearchBoxInput}
                    />
                    <CommissionParameters>

                    </CommissionParameters>
                    <Grid container>
                        <Grid item>
                            <Paper>
                                Search results
                            </Paper>
                        </Grid>
                        <Grid item>
                            Current mission
                        </Grid>
                    </Grid>

                </Container>

            </>
        )
    }
}

export default withStyles(useStyles)(ManualCreatingPage);