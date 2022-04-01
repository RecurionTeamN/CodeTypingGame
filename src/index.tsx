import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/auth/AuthContext";
import { ProfileContextProvider } from "./context/profile/ProfileContext";

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ProfileContextProvider>
        <App />
      </ProfileContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
