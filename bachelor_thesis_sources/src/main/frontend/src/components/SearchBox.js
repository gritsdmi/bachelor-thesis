import React, {useState} from "react";
import {Paper, TextField} from "@material-ui/core";

export default function SearchBox({onClickButton, searchPattern, onChange}) {
    const [target] = useState('');

    //todo pass label to props
    return (
        <>
            <Paper> {/*todo css*/}
                <TextField
                    fullWidth
                    variant={"outlined"}
                    size={"small"}
                    label={"Name or username"}
                    defaultValue=""
                    onChange={onChange}
                />
                {/*<Button onClick={target.onClickButton}>Search</Button>*/}
            </Paper>
        </>
    );
}

