import React from "react";
import List from "@material-ui/core/List";

class SearchResultPanel extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
    }

    componentDidMount() {

    }

    render() {
        return (
            <>
                <List></List>
            </>
        );
    }

}

export default SearchResultPanel;