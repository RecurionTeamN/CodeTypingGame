import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/styles";
import theme from "../styles/Theme";
import GamePage from "../pages/GamePage/GamePage";
import HomePage from "../pages/HomePage/HomePage";
import ResultPage from "../pages/ResultPage/ResultPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";

const Container = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/game" element={<GamePage />} />
        <Route path="/results" element={<ResultPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<DashboardPage />} />

        {/* <Route path="*" element={<404Page />} /> */}
      </Routes>
    </Router>
  </ThemeProvider>
);

export default Container;
