import React from "react";
import List from "@material-ui/core/List";
import {Divider, ListItem, ListItemText, Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

export default function SearchResultPanel({
                                              data,
                                              onClick,
                                              add,
                                              edit,
                                              rec,
                                              disabledCheck,
                                              editButton,
                                          }) {

    const searchResult = data && data.map((item, key) => {
            return (
                <Box key={key}>
                    <ListItem>
                        <ListItemText
                            primary={item.name + " " + item.surname}/>

                        {editButton &&
                        <Button
                            onClick={() => editButton(item)}
                        >
                            Edit teacher
                        </Button>
                        }
                        <Button
                            onClick={() => onClick(item)}
                            disabled={disabledCheck ? disabledCheck(item) : false}
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
