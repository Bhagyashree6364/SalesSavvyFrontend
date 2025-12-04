import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function CartIcon({ count }) {
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate("/usercartpage");
  };

  return (
    <div className="cart-icon" onClick={handleCartClick}>
      <span className="cart-icon-symbol">🛒</span>
      <span className="cart-badge">{count}</span>
    </div>
  );
}
