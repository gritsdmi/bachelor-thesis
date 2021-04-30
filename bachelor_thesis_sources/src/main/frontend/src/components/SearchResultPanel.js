import React from "react";
import List from "@material-ui/core/List";
import {Divider, ListItem, ListItemText, makeStyles, Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    button: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },

}));

export default function SearchResultPanel({
                                              data,
                                              onClick,
                                              add,
                                              edit,
                                              rec,
                                              disabledCheck,
                                              editButton,
                                          }) {
    const classes = useStyles();
    const searchResult = data && data.map((item, key) => {
        return (
            <Box key={key}>
                <ListItem>
                    <ListItemText
                        primary={item.name + " " + item.surname}/>

                    {editButton &&
                    <Button
                        className={classes.button}
                        color={'primary'}
                        variant={'contained'}
                        onClick={() => editButton(item)}
                    >
                        Edit teacher
                    </Button>}
                    <Button
                        className={classes.button}
                        color={'primary'}
                        variant={'contained'}
                        onClick={() => onClick(item)}
                        disabled={disabledCheck ? disabledCheck(item) : false}
                    >
                        {add && "Add"}
                        {edit && "Edit"}
                        {rec && "Recommend"}
                    </Button>
                </ListItem>
                {data.length - 1 !== key && <Divider/>}
            </Box>
        )
    });

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
