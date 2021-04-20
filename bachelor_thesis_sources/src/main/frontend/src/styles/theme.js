import {createMuiTheme, responsiveFontSizes} from "@material-ui/core";

const femTheme = createMuiTheme({
    palette: {
        primary: {
            // light: "#7986cb",
            // main: "#3f51b5",
            // dark: "#303f9f",
            light: "#67b9f0",
            main: "#18A0FB",
            dark: "#0088e3",
            contrastText: "#fff",
        },
        secondary: {
            light: "#ff4081",
            main: "#f50057",
            dark: "#c51162",
            contrastText: "#fff",
        },
    },

    // typography: {
    //     fontFamily: [
    //         'Montserrat'
    //     ],
    // }
})

export default responsiveFontSizes(femTheme)