import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import CustomerHomePage from "./CustomerHomePage";
import CartPage from "./CartPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/customerhome" element={<CustomerHomePage />} />
    <Route path="/cart" element={<CartPage />} />
  </Routes>
);

export default AppRoutes;
