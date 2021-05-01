import {createMuiTheme, responsiveFontSizes} from "@material-ui/core";

const femTheme = createMuiTheme({
    palette: {
        primary: {
            light: "#67b9f0",
            // main: "#18A0FB",
            main: "#007ac3",//web fel
            // dark: "#0088e3",//on hover
            dark: "#004a77",//on hover web fel
            contrastText: "#fff",
            // contrastText: "#0065bd", barva kosu
        },
        secondary: {
            light: "#ff4081",
            main: "#f50057",
            dark: "#c51162",
            contrastText: "#fff",
        },
    },

})

export default responsiveFontSizes(femTheme)