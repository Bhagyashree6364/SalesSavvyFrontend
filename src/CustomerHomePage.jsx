import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import CategoryNavigation from "./CategoryNavigation";
import ProductList from "./ProductList";
import Footer from "./Footer";
import "./styles.css";

axios.defaults.withCredentials = true;  // send cookies with all requests [web:29][web:32]

export default function CustomerHomePage() {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [username, setUsername] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const loadProducts = async (category) => {
    try {
      const response = await axios.get("http://localhost:9090/api/products", {
        params: category ? { category } : {},
      });
      const data = response.data;
      if (data.user) {
        setUsername(data.user.name);
      }
      if (data.products) {
        setProducts(data.products);
      }
      // if backend sends cartCount later:
      // if (data.cartCount !== undefined) setCartCount(data.cartCount);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    loadProducts(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = async (product) => {
    try {
      await axios.post(
        "http://localhost:9090/api/cart/add",
        {
          productId: product.product_id, // ensure this matches your Product field
          quantity: 1,
        },
        { withCredentials: true }
      );
      alert("Item added to cart");
      // optional: increase cartCount locally
      setCartCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:9090/api/logout");
      window.location.href = "/";
    } catch (err) {
      console.error("Error during logout", err);
    }
  };

  return (
    <div className="page">
      <Header cartCount={cartCount} username={username} onLogout={handleLogout} />
      <CategoryNavigation onCategoryClick={handleCategoryClick} />
      <main className="main-content">
        <ProductList products={products} onAddToCart={handleAddToCart} />
      </main>
      <Footer />
    </div>
  );
}
