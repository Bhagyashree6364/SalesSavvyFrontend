import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import CustomerHomePage from "./CustomerHomePage";
import CartPage from "./CartPage";
import OrdersPage from "./OrdersPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/customerhome" element={<CustomerHomePage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/orders" element={<OrdersPage />} />
  </Routes>
);

export default AppRoutes;
