import React from "react";
import List from "@material-ui/core/List";
import {Divider, ListItem, ListItemText, Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

export default function SearchResultPanel({data, onClick, add, edit, rec}) {

    const searchResult = data && data.map((item, key) => {
            return (
                <Box key={key}>
                    <ListItem>
                        <ListItemText
                            primary={item.name + " " + item.surname}/>
                        <Button
                            onClick={() => onClick(item)}
                        >
                            {add && "Add"}
                            {edit && "Edit"}
                            {rec && "Recommend"}
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
