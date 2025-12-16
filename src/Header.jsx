import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CartIcon from "./CartIcon";
import "./styles.css";

export default function Header({ cartCount, username }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleCartClick = () => {
    navigate("/cart");
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };
const handleLogout = async () => {
  try {
    const response = await fetch("http://localhost:9090/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    console.log("Logout status:", response.status);

    // Clear all local auth data regardless
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    // Always navigate to login page after calling logout
    if (response.ok) {
      navigate("/login");
    } else {
      // even if backend sends some error, still push to login
      navigate("/login");
    }
  } catch (error) {
    console.error("Error during logout", error);
    // on network error, also push to login
    navigate("/login");
  }
};
  const handleOrdersClick = (e) => {
    e.preventDefault();
    navigate("/orders");
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo-text">SalesSavvy</h1>
      </div>

      <div className="header-actions">
        <div onClick={handleCartClick} style={{ cursor: "pointer" }}>
          <CartIcon count={cartCount} />
        </div>

        <div className="profile-dropdown">
          <button className="profile-button" onClick={toggleDropdown}>
            <span className="username">{username || "Guest"}</span>
          </button>

          {isOpen && (
            <div className="dropdown-menu">
              <Link to="/orders" onClick={handleOrdersClick}>
                My Orders
              </Link>
              <button className="profile-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
