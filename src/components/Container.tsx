import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GamePage from "../pages/GamePage";
import HomePage from "../pages/HomePage";
import ResultPage from "../pages/ResultPage";

const Container = () => (
  <Router>
    <Routes>
      <Route path="/game" element={<GamePage />} />
      <Route path="/results" element={<ResultPage />} />
      <Route path="/" element={<HomePage />} />
      {/* <Route path="*" element={<404Page />} /> */}
    </Routes>
  </Router>
);

export default Container;
