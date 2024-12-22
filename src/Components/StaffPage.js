import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const StaffPage = () => {
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

      {/* Admin Page Content */}
      <div className="container mt-5">
        <h1 className="text-center">Welcome to the Staff Dashboard</h1>
        <div className="text-center mt-4">
          <p>Here you can view tasks,rota and send messages.</p>
          <button className="btn btn-secondary ml-3">View Reports</button>
          {/* Add more admin functionalities here */}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p>&copy; 2024 GoldenCore. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default StaffPage;


