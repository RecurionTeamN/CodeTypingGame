import React from "react";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import theme from "../../styles/Theme";

const DashboardPageHeader = () => (
  <ThemeProvider theme={theme}>
    <Box
      sx={{
        bgcolor: "primary.dark",
        color: "white",
      }}
    >
      <h1>Dashboard</h1>
    </Box>
  </ThemeProvider>
);

export default DashboardPageHeader;
