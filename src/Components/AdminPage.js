import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Styles/AdminPage.css"; // Custom CSS for styling

const AdminPage = () => {
  const [weather, setWeather] = useState(null); // State for weather data
  const [undergroundStatus, setUndergroundStatus] = useState([]); // State for underground service status
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  // Fetch weather data using RapidAPI
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get("https://open-weather13.p.rapidapi.com/city/london/EN", {
          headers: {
            "x-rapidapi-key": "d6db1c7f27msh6acfdb8bee47e81p1eda0ejsne9485f822d24",
            "x-rapidapi-host": "open-weather13.p.rapidapi.com",
          },
        });
        setWeather(response.data); // Set weather data
        setErrorMessage(""); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching weather data:", error.response?.data || error.message);
        setWeather(null); // Reset weather state on error
        setErrorMessage("Could not fetch weather data. Please try again later.");
      }
    };

    fetchWeather();
  }, []);

  // Fetch Underground service news
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
            <li className="nav-item">
              <Link to="/admin" className="nav-link text-white">
                <i className="bi bi-house-door"></i> Admin Page
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/manage-users" className="nav-link text-white">
                <i className="bi bi-person-lines-fill"></i> Manage Users
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/view-reports" className="nav-link text-white">
                <i className="bi bi-file-earmark-bar-graph"></i> View Reports
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dbs" className="nav-link text-white">
                <i className="bi bi-file-earmark-lock"></i> DBS
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/payslip" className="nav-link text-white">
                <i className="bi bi-cash"></i> Payslip
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/cv" className="nav-link text-white">
                <i className="bi bi-file-person"></i> CV
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/employment-contract" className="nav-link text-white">
                <i className="bi bi-file-earmark-text"></i> Employment Contract
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/rota" className="nav-link text-white">
                <i className="bi bi-calendar-check"></i> Rota
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/annual-leave" className="nav-link text-white">
                <i className="bi bi-calendar-heart"></i> Annual Leave
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/client-ppe-order" className="nav-link text-white">
                <i className="bi bi-box-seam"></i> Client PPE Order
              </Link>
            </li>
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
                  {weather ? (
                    <div>
                      <p>
                        <strong>Temperature:</strong> {weather.main.temp}°C
                      </p>
                      <p>
                        <strong>Condition:</strong> {weather.weather[0].description}
                      </p>
                      <p>
                        <strong>Humidity:</strong> {weather.main.humidity}%
                      </p>
                      <p>
                        <strong>Wind Speed:</strong> {weather.wind.speed} m/s
                      </p>
                    </div>
                  ) : (
                    <p>{errorMessage || "Loading weather data..."}</p>
                  )}
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
