// ForgotPasswordPage.js
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import "../Styles/ForgotPasswordPage.css"; // Assuming you want to style it

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sending the reset password email (this is a mock)
    alert(`Password reset link has been sent to ${email}`);
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

      {/* Forgot Password Form */}
      <div className="container">
        <div className="card shadow-lg p-4">
          <h2 className="text-center mb-4">Forgot Your Password?</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Enter your Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-info text-white">
                Send Password Reset Link
              </button>
            </div>
            <div className="text-center mt-3">
              <p>
                <a href="/">Back to Login</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
