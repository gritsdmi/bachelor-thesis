import React from "react";
import {makeStyles} from "@material-ui/core";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({}))

export default function Footer() {
    const classes = useStyles();

    return (
        <Box
            className={'footerBox'}
        >
            this is footer
        </Box>
    )
}