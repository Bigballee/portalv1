import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
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

  // Fetch reports on load
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:5001/reports");  // Adjust endpoint as needed
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
        const response = await axios.get("http://localhost:5001/users");  // Ensure this endpoint is correct
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
    const filtered = users.filter(user => 
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
        `http://localhost:5001/reports/${reportId}/respond`,  // Adjust endpoint as needed
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
        "http://localhost:5001/send-file",  // Ensure this endpoint is correct
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
            <img src="./Images/logo.png" 
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
          <h1 className="text-center">View Reports</h1>

          {/* Search Bar for Users */}
          <div className="mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search Users by Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            />
          </div>

          {/* Reports List */}
          <div className="mt-4">
            {loading ? <div>Loading reports...</div> : (
              <div>
                <h3>Submitted Reports</h3>
                <ul className="list-group">
                  {reports.map((report) => (
                    <li key={report.id} className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>{report.user}</strong> ({report.email}) - {report.report}
                          <span
                            className={`badge ms-2 ${report.status === "pending" ? "bg-warning" : "bg-success"}`}
                          >
                            {report.status}
                          </span>
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setSelectedReport(report)}
                          disabled={report.status === "resolved"}
                        >
                          {report.status === "resolved" ? "Responded" : "Respond"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Respond to Report Modal */}
          {selectedReport && (
            <div className="mt-5">
              <h4>Respond to Report</h4>
              <textarea
                className="form-control"
                rows="5"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Write your response here"
              ></textarea>
              <div className="form-group mt-3">
                <label>Attach File (Optional)</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <button
                className="btn btn-success mt-3"
                onClick={() => handleRespondToReport(selectedReport.id)}
                disabled={!responseMessage}
              >
                Submit Response
              </button>
            </div>
          )}

          {/* Send File to Specific User */}
          <div className="mt-5">
            <h4>Send File to Specific User</h4>
            <div className="form-group mt-3">
              <label>Select User</label>
              <select
                className="form-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Select User</option>
                {filteredUsers.map(user => (
                  <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
                ))}
              </select>
            </div>
            <div className="form-group mt-3">
              <label>Attach File</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFileToSend(e.target.files[0])}
              />
            </div>
            <button
              className="btn btn-success mt-3"
              onClick={handleSendFileToUser}
              disabled={!selectedUser || !fileToSend}
            >
              Send File
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
        </div>
      </div>

      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p>&copy; 2024 GoldenCore. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default ViewReportsPage;
