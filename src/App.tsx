import React from "react";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import ResultPage from "./pages/ResultPage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/game" element={<GamePage />} />
      <Route path="/results" element={<ResultPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
