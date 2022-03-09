import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#77ffff",
    },
    secondary: {
      main: "#8cb4c4",
    },
    error: {
      main: "#bb0000",
    },
    background: {
      default: "#fff",
    },
  },
});

export default theme;
