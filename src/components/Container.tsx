import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/styles";
import { StyledEngineProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import theme from "../styles/Theme";
import GamePage from "../pages/GamePage/GamePage";
import HomePage from "../pages/HomePage/HomePage";
import ResultPage from "../pages/ResultPage/ResultPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import LandingPage from "../pages/LandingPage/LandingPage";
import useAuthContext from "../hooks/useAuthContext";

import "react-toastify/dist/ReactToastify.min.css";

const Container = () => {
  const { authState } = useAuthContext();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {authState.authIsReady && (
          <Router>
            <Routes>
              <Route path="/game" element={authState.user ? <GamePage /> : <Navigate to="/" />} />
              <Route path="/results" element={authState.user ? <ResultPage /> : <Navigate to="/" />} />
              <Route path="/home" element={authState.user ? <HomePage /> : <Navigate to="/" />} />
              <Route path="/dashboard" element={authState.user ? <DashboardPage /> : <Navigate to="/" />} />
              <Route path="/" element={!authState.user ? <LandingPage /> : <Navigate to="/dashboard" />} />
              {/* <Route path="*" element={<404Page />} /> */}
            </Routes>
          </Router>
        )}
        <ToastContainer />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Container;
