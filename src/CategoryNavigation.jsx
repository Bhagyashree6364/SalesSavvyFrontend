import React from "react";
import "./styles.css";

export default function CategoryNavigation({ onCategoryClick }) {
  const categories = ["Shirts", "Pants", "Accessories", "Mobiles", "Mobile Accessories"];

  return (
    <nav className="category-nav">
      <ul className="category-list">
        {categories.map((cat) => (
          <li
            key={cat}
            className="category-item"
            onClick={() => onCategoryClick(cat)}
          >
            {cat}
          </li>
        ))}
      </ul>
    </nav>
  );
}
