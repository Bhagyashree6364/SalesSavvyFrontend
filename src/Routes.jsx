import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import CustomerHomePage from "./CustomerHomePage";
import CartPage from "./CartPage";
import OrdersPage from "./OrdersPage";
import AdminDashboard from "./AdminDashboard";

/**
 * Simple ProtectedRoute that checks role stored in localStorage.
 * Assumes you save user role as a string in localStorage under key "role"
 * and JWT token under key "token".
 */
const ProtectedRoute = ({ requiredRole, children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // role check when requiredRole is provided
  if (requiredRole && role !== requiredRole) {
    // if user is customer, push to customer home; otherwise to login
    if (role === "CUSTOMER") {
      return <Navigate to="/customerhome" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => (
  <Routes>
    {/* public login */}
    <Route path="/" element={<LoginPage />} />

    {/* customer routes */}
    <Route
      path="/customerhome"
      element={
        <ProtectedRoute requiredRole="CUSTOMER">
          <CustomerHomePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/cart"
      element={
        <ProtectedRoute requiredRole="CUSTOMER">
          <CartPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/orders"
      element={
        <ProtectedRoute requiredRole="CUSTOMER">
          <OrdersPage />
        </ProtectedRoute>
      }
    />

    {/* admin route */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute requiredRole="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      }
    />

    {/* fallback for unknown paths */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
