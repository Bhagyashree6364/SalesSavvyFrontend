import React, { useState } from "react";
import "./styles.css";

export default function ProfileDropdown({ username, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const displayName = username || "User";

  return (
    <div className="profile-dropdown">
      <button className="profile-button" onClick={toggle}>
        <span className="profile-avatar">👤</span>
        <span>{displayName}</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <a href="#profile">Profile</a>
          <a href="#orders">Orders</a>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
