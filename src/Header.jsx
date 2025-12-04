import React from "react";
import { useNavigate } from "react-router-dom";
import CartIcon from "./CartIcon";
import ProfileDropdown from "./ProfileDropdown";
import "./styles.css";

export default function Header({ cartCount, username, onLogout }) {
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate("/cart");
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
        <ProfileDropdown username={username} onLogout={onLogout} />
      </div>
    </header>
  );
}
