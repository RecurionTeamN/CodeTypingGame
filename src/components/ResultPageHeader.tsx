import React from "react";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import theme from "../styles/Theme";

const ResultPageHeader = () => (
  <ThemeProvider theme={theme}>
    <Box
      sx={{
        bgcolor: "primary.dark",
        color: "white",
      }}
    >
      <h1>Result Page *これから開発する</h1>
    </Box>
  </ThemeProvider>
);

export default ResultPageHeader;
