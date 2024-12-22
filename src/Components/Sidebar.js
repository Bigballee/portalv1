import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(""); // Track active menu item

  // Menu items array for easier scaling
  const menuItems = [
    { path: "/admin", label: "Admin Page", icon: "bi-house-door" },
    { path: "/manage-users", label: "Manage Users", icon: "bi-person-lines-fill" },
    { path: "/view-reports", label: "View Reports", icon: "bi-file-earmark-bar-graph" },
    { path: "/dbs", label: "DBS", icon: "bi-file-earmark-lock" },
    { path: "/payslip", label: "Payslip", icon: "bi-cash" },
    { path: "/cv", label: "CV", icon: "bi-file-person" },
    { path: "/employment-contract", label: "Employment Contract", icon: "bi-file-earmark-text" },
    { path: "/rota", label: "Rota", icon: "bi-calendar-check" },
    { path: "/annual-leave", label: "Annual Leave", icon: "bi-calendar-heart" },
    { path: "/client-ppe-order", label: "Client PPE Order", icon: "bi-box-seam" },
  ];

  return (
    <div className="sidebar bg-dark text-white p-4" style={{ width: "250px" }}>
      <h4>Admin Dashboard</h4>
      <ul className="nav flex-column">
        {menuItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link text-white ${activeItem === item.path ? "bg-success" : ""}`}
              onClick={() => setActiveItem(item.path)} // Update active item on click
              style={{ borderRadius: "5px" }}
            >
              <i className={`bi ${item.icon} me-2`}></i>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
