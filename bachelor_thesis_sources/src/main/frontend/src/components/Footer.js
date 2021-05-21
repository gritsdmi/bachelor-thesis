import React from "react";
import {makeStyles} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    flex: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: theme.spacing(1),
    }
}))

export default function Footer() {
    const classes = useStyles();

    return (
        <Box className={'footerBox'}>
            <Box className={classes.flex}>

                <Box>
                    <Typography>
                        Final exam commissions manager
                    </Typography>


                </Box>
                <Typography>
                    CTU FEE May 2021
                </Typography>
            </Box>
        </Box>

    )
}
