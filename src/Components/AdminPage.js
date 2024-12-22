import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios";
import "../Styles/AdminPage.css"; // Custom CSS for styling

const AdminPage = () => {
  const [weather, setWeather] = useState(null); // State for weather data
  const [undergroundStatus, setUndergroundStatus] = useState([]); // State for underground service status
  const [activeItem, setActiveItem] = useState("/admin"); // Active sidebar item

  // Fetch weather data for London
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your API key
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${apiKey}`
        );
        setWeather(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    const fetchUndergroundStatus = async () => {
      try {
        const response = await axios.get("https://api.tfl.gov.uk/Line/Mode/tube/Status");
        setUndergroundStatus(response.data); // Set underground status data
      } catch (error) {
        console.error("Error fetching underground status:", error.response?.data || error.message);
        setUndergroundStatus([]); // Reset underground status on error
      }
    };

    fetchUndergroundStatus();
  }, []);

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

      <div className="d-flex">
        {/* Sidebar */}
        <div className="sidebar bg-dark text-white p-4" style={{ width: "250px" }}>
          <h4>Admin Dashboard</h4>
          <ul className="nav flex-column">
            {[
              { path: "/admin", label: "Admin Page", icon: "bi-house-door" },
              { path: "/manage-users", label: "Manage Carers", icon: "bi-person-lines-fill" },
              { path: "/view-reports", label: "View Reports", icon: "bi-file-earmark-bar-graph" },
              { path: "/dbs", label: "DBS", icon: "bi-file-earmark-lock" },
              { path: "/payslip", label: "Payslip", icon: "bi-cash" },
              { path: "/cv", label: "CV", icon: "bi-file-person" },
              { path: "/employment-contract", label: "Employment Contract", icon: "bi-file-earmark-text" },
              { path: "/rota", label: "Rota", icon: "bi-calendar-check" },
              { path: "/client-ppe-order", label: "Client PPE Order", icon: "bi-box-seam" },
            ].map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link text-white ${activeItem === item.path ? "bg-success" : ""}`}
                  onClick={() => setActiveItem(item.path)} // Highlight active link
                  style={{ borderRadius: "5px" }}
                >
                  <i className={`bi ${item.icon} me-2`}></i>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="container mt-5 flex-grow-1">
          <h1 className="text-center">Admin Dashboard</h1>
          <p className="text-center">Select an option from the sidebar to get started.</p>

          {/* Widgets Section */}
          <div className="row mt-5">
            {/* Weather Widget */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5>London Weather</h5>
                </div>
                <div className="card-body">
                  {/* Placeholder for weather widget */}
                  <iframe
                    src="https://www.meteoblue.com/en/weather/widget/daily/london_united-kingdom_2643743?geoloc=fixed&days=3&tempunit=C&windunit=kmh&layout=bright"
                    frameBorder="0"
                    scrolling="NO"
                    allowtransparency="true"
                    style={{ width: "100%", height: "260px" }}
                  ></iframe>
                  <small>
                    <a
                      href="https://www.meteoblue.com/en/weather/week/london_united-kingdom_2643743"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Full forecast at meteoblue.com
                    </a>
                  </small>
                </div>
              </div>
            </div>

           {/* Underground Service News */}
           <div className="col-md-6">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5>London Underground Service News</h5>
                </div>
                <div className="card-body">
                  {undergroundStatus.length > 0 ? (
                    <ul>
                      {undergroundStatus.map((line, index) => (
                        <li key={index}>
                          <strong>{line.name}:</strong> {line.lineStatuses[0].statusSeverityDescription}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Loading underground status...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p>&copy; 2024 GoldenCore. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AdminPage;
 