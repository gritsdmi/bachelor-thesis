import React from "react";
import {withStyles} from "@material-ui/core/styles";

const useStyles = theme => ({
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    item: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    }

});

class EmailTemplates extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        console.log("EmailTemplates DID MOUNT")
    }

    render() {
        return (
            <div>
                <h1>Email Templates</h1>
            </div>
        );
    }

}

export default withStyles(useStyles)(EmailTemplates)