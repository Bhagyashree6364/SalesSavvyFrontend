import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import CategoryNavigation from "./CategoryNavigation";
import ProductList from "./ProductList";
import Footer from "./Footer";
import "./styles.css";

// Always send cookies if backend also uses them
axios.defaults.withCredentials = true;

export default function CustomerHomePage() {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [username, setUsername] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Helper to get Authorization header from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const loadProducts = async (category) => {
    try {
      const response = await axios.get(
        "http://localhost:9090/api/products",
        {
          params: category ? { category } : {},
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      // EXPECTED BACKEND RESPONSE EXAMPLES:
      // Option A: returns array directly -> data is Product[]
      // Option B: returns wrapper -> { products: [...], user: {...} }

      const data = response.data;

      // If backend sends username separately, use that; otherwise from localStorage
      if (data.user && data.user.username) {
        setUsername(data.user.username);
      } else {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);
      }

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.products) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }

      // Optional: if backend returns cartCount
      if (data.cartCount !== undefined) {
        setCartCount(data.cartCount);
      }
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    loadProducts(selectedCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = async (product) => {
    try {
      await axios.post(
        "http://localhost:9090/api/cart/add",
        {
          productId: product.product_id, // make sure this matches your backend field
          quantity: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          withCredentials: true,
        }
      );

      alert("Item added to cart");
      setCartCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart");
    }
  };

  const handleLogout = async () => {
    try {
      // Optional: if you have logout endpoint
      await axios.post(
        "http://localhost:9090/api/logout",
        {},
        { headers: { ...getAuthHeaders() } }
      );
    } catch (err) {
      console.error("Error during logout", err);
    } finally {
      // Clear localStorage and go to login
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      window.location.href = "/";
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

