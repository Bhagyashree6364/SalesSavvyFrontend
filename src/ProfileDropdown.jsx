import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function ProfileDropdown({ username }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include", // send cookies with request [web:133]
      });

      if (response.ok) {
        // Clear client-side auth info
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");

        // Redirect to login page
        navigate("/login");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  const handleOrdersClick = () => {
    navigate("/orders");
  };

  return (
    <div className="profile-dropdown">
      <button className="profile-button" onClick={toggleDropdown}>
        <span className="username">{username || "Guest"}</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={handleOrdersClick}>
            My Orders
          </button>
          <button className="dropdown-item" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
