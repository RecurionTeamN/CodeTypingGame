import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

const DashboardPage = () => (
  <div>
    <Header />
    <h1>DashboardPage</h1>
    <div>
      <ul>
        <li>
          <Link to="/game">GamePage</Link>
        </li>
        <li>
          <Link to="/results">ResultPage</Link>
        </li>
        <li>
          <Link to="/settings">SettingsPage</Link>
        </li>
      </ul>
    </div>
  </div>
);

export default DashboardPage;
