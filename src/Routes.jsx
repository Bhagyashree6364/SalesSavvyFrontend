import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    {/* later: /register, /customerhome, /adminhome */}
  </Routes>
);

export default AppRoutes;
