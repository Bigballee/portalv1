import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom"; // Import useLocation for active link styling
import axios from "axios"; // For making API requests

const ViewReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [file, setFile] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [fileToSend, setFileToSend] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // For user search
  const location = useLocation(); // Get current route

  // Function to check if a link is active
  const isActive = (path) => (location.pathname === path ? "bg-success" : "");

  // Fetch reports on load
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:5001/reports"); // Adjust endpoint as needed
        setReports(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Fetch users to send files to
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/users"); // Ensure this endpoint is correct
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered users with all users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on the search query
  useEffect(() => {
    const filtered = users.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]); // Re-run when search query or users list changes

  // Respond to the report
  const handleRespondToReport = async (reportId) => {
    const formData = new FormData();
    formData.append("message", responseMessage);
    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post(
        `http://localhost:5001/reports/${reportId}/respond`, // Adjust endpoint as needed
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId ? { ...report, status: "resolved" } : report
        )
      );
      setSelectedReport(null);
      setResponseMessage("");
      setFile(null);
    } catch (error) {
      console.error("Error responding to report:", error);
    }
  };

  // Send file to a selected user
  const handleSendFileToUser = async () => {
    const formData = new FormData();
    formData.append("file", fileToSend);
    formData.append("user_id", selectedUser);

    try {
      await axios.post(
        "http://localhost:5001/send-file", // Ensure this endpoint is correct
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setFileToSend(null);
      setSelectedUser("");
    } catch (error) {
      setErrorMessage("Failed to send file. Please try again.");
      console.error("Error sending file to user:", error);
    }
  };

  return (
    <div>
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
              <Link to="/admin" className={`nav-link text-white ${isActive("/admin")}`}>
                <i className="bi bi-house-door"></i> Admin Page
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/manage-users" className={`nav-link text-white ${isActive("/manage-users")}`}>
                <i className="bi bi-person-lines-fill"></i> Manage Carers
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/view-reports" className={`nav-link text-white ${isActive("/view-reports")}`}>
                <i className="bi bi-file-earmark-bar-graph"></i> View Reports
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dbs" className={`nav-link text-white ${isActive("/dbs")}`}>
                <i className="bi bi-file-earmark-lock"></i> DBS
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/payslip" className={`nav-link text-white ${isActive("/payslip")}`}>
                <i className="bi bi-cash"></i> Payslip
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/cv" className={`nav-link text-white ${isActive("/cv")}`}>
                <i className="bi bi-file-person"></i> CV
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/employment-contract" className={`nav-link text-white ${isActive("/employment-contract")}`}>
                <i className="bi bi-file-earmark-text"></i> Employment Contract
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/rota" className={`nav-link text-white ${isActive("/rota")}`}>
                <i className="bi bi-calendar-check"></i> Rota
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/client-ppe-order" className={`nav-link text-white ${isActive("/client-ppe-order")}`}>
                <i className="bi bi-box-seam"></i> PPE Order
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="container mt-5 flex-grow-1">
          <h1 className="text-center">View Reports</h1>

          {/* Rest of the main content */}
        </div>
      </div>

      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p>&copy; 2024 GoldenCore. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default ViewReportsPage;
