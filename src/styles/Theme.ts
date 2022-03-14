import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#2bbeed",
    },
    secondary: {
      main: "#8cb4c4",
    },
    error: {
      main: "#bb0000",
    },
    background: {
      default: "#e0e0e0",
    },
  },
  typography: {
    body1: {
      fontSize: 20,
    },
  },
});

export default theme;
