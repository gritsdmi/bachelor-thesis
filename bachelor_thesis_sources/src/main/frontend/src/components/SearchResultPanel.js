import React from "react";
import List from "@material-ui/core/List";
import {Divider, ListItem, ListItemText, Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

export default function SearchResultPanel({data, onEditClick, add}) {
    // const [data] = data;

    // componentDidMount() {
    //     this.setState({data: this.props.data}, () => console.log(this.state))
    //     this.setState({onEditClick: this.props.onEditClick})
    //     console.log("did mount")
    //     // this.setState({test: this.props.test})
    // }
    //
    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (this.props !== prevProps) {
    //         console.log("did update !== prevProps")
    //         this.setState({
    //             data: this.props.data
    //         })
    //     }
    // }

    const searchResult = data && data.map((item, key) => {
            return (
                <Box key={key}>
                    <ListItem>
                        <ListItemText primary={
                            item.name + " " + item.surname}/>
                        <Button
                            onClick={() => onEditClick(item)}// only this handle
                            // onClick={() => this.props.onEditClick(item.id)}// only this handle
                            // onClick={this.sendBackData(item)} // idk how, but its pass value, but call component did update
                        >
                            {add && "Add"}
                            {!add && "Edit"}
                        </Button>
                    </ListItem>
                    <Divider/>
                </Box>
            )
        }
    );

    return (
        <>
            <Paper>
                <List>
                    {searchResult}
                </List>
            </Paper>
        </>
    );
}
