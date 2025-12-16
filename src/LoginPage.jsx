import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:9090/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // EXPECTED BACKEND RESPONSE (example):
      // {
      //   "token": "jwt-token-here",
      //   "role": "CUSTOMER",
      //   "username": "Bhagya"
      // }

      if (!data.token) {
        throw new Error("No token received from server");
      }

      // Save token and basic user info for later requests
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username || username);

      if (data.role === "CUSTOMER") {
        navigate("/customerhome");
      } else if (data.role === "ADMIN") {
        navigate("/adminhome");
      } else {
        throw new Error("Invalid user role");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1 className="title-login">Login</h1>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSignin} className="form-content">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="form-button">
            Sign In
          </button>
        </form>

        <div className="form-footer">
          <a href="/register" className="form-link">
            New User? Sign up here
          </a>
        </div>
      </div>
    </div>
  );
}
