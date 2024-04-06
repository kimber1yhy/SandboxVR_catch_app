import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./pages/App";
import "./styles/index.css";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" Component={App} />
      </Routes>
    </Router>
  </React.StrictMode>
);
