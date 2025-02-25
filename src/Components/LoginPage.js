import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/LoginPage.css";
import {jwtDecode} from "jwt-decode"; // Corrected import




const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError(null); // Reset error before making a new request

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);

    try {
      // Make API call to login
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/login`,
        { email, password }
      );

      // If login is successful, the backend should return a token
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token); // Store JWT in localStorage

        const decodedToken = jwtDecode(response.data.token); // Decode the token to check user role
        const userRole = decodedToken.role; // Extract user role from the decoded token

        console.log("Decoded Token:", decodedToken); // Debug: Check the decoded token

        // Redirect based on user role
        if (userRole === "admin") {
          navigate("/admin"); // Redirect to admin page
        } else if (userRole === "staff") {
          navigate("/staff"); // Redirect to staff page
        } else {
          setError("Unknown user role.");
        }
      } else {
        setError("No token received from server.");
      }
    } catch (error) {
      // Handle errors
      if (error.response && error.response.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("An error occurred. Please try again later.");
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-light bg-light custom-navbar">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img
              src="./Images/logo.png"
              alt="GoldenCore Logo"
              className="custom-logo"
              style={{ width: "150px", height: "auto" }}
            />
            GoldenCore
          </a>
        </div>
      </nav>

      {/* Login Form */}
      <div className="container">
        <div className="card shadow-lg p-4">
          <h2 className="text-center mb-4">Sign In to Your Account</h2>

          {error && <div className="alert alert-danger">{error}</div>} {/* Error Message */}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-info text-white" disabled={isLoading}>
                {isLoading ? "Loading..." : "Login"}
              </button>
            </div>
            <div className="text-center mt-3">
              <p>
                Don't have an account?{" "}
                <Link to="/create-account">Register here</Link>
              </p>
              <p>
                <Link to="/forgot-password">Forgot Password?</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
