import React from "react";
import "./styles.css";

export default function ProductList({ products, onAddToCart }) {
  if (!products || products.length === 0) {
    return <p>No products available.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((p) => {
        const imageUrl =
          p.images && p.images.length > 0
            ? p.images[0]
            : "https://via.placeholder.com/150";

        return (
          <div key={p.productId} className="product-card">
            <img src={imageUrl} alt={p.name} className="product-image" />
            <h3>{p.name}</h3>
            <p className="product-price">₹{p.price}</p>
            <button onClick={() => onAddToCart(p)}>
              Add to Cart
            </button>
          </div>
        );
      })}
    </div>
  );
}
