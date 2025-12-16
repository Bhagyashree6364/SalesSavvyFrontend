import React from "react";
import { useNavigate } from "react-router-dom";
import CartIcon from "./CartIcon";
import ProfileDropdown from "./ProfileDropdown";
import "./styles.css";
import { Link } from "react-router-dom";

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
      <li>
  <Link to="/orders">My Orders</Link>
</li>
    </header>
  );
}
