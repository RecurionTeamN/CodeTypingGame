import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// styles
import { ThemeProvider } from "@mui/styles";
import { StyledEngineProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import theme from "../styles/Theme";
import "react-toastify/dist/ReactToastify.min.css";

// pages
import GamePage from "../pages/GamePage/GamePage";
import SettingPage from "../pages/SettingPage/SettingPage";
import ResultPage from "../pages/ResultPage/ResultPage";
import LandingPage from "../pages/LandingPage/LandingPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";

import { keyboardData } from "../data/keyboardData";
import useAuthContext from "../hooks/useAuthContext";
import useProfileContext from "../hooks/useProfileContext";

const Container = () => {
  const { authState } = useAuthContext();
  const { profileState } = useProfileContext();
  const [currGameData, setCurrGameData] = useState({
    speed: 0,
    accuracy: 0,
    keyData: keyboardData[profileState.userSettings.keyboardType],
  });

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {authState.authIsReady && (
          <Router>
            <Routes>
              <Route
                path="/game"
                element={
                  authState.user ? (
                    <GamePage currGameData={currGameData} setCurrGameData={setCurrGameData} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/results"
                element={authState.user ? <ResultPage currGameData={currGameData} /> : <Navigate to="/" />}
              />
              <Route
                path="/settings"
                element={authState.user ? <SettingPage setCurrGameData={setCurrGameData} /> : <Navigate to="/" />}
              />
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
