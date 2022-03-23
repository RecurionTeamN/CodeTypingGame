import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

const DashboardPage = () => (
  <div>
    <Header />
    <h1>DashboardPage</h1>
    <div>
      <Link to="/game">GamePage</Link>
      <Link to="/results">ResultPage</Link>
    </div>
  </div>
);

export default DashboardPage;
