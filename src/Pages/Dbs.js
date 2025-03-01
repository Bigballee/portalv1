import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom"; // Import useLocation for active link styling
import axios from "axios";

const DbsPage = () => {
  const [staffList, setStaffList] = useState([]); // State for the list of staff
  const [file, setFile] = useState(null); // State for the selected file
  const [uploadStatus, setUploadStatus] = useState(""); // State for upload status
  const [selectedStaff, setSelectedStaff] = useState(""); // State for selected staff
  const location = useLocation(); // Get current route

  // Fetch staff members to populate the dropdown
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("https://mygolden.co.uk/staff");
        setStaffList(response.data); // Assuming response contains staff data
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchStaff();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle staff selection
  const handleStaffChange = (e) => {
    setSelectedStaff(e.target.value);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file || !selectedStaff) {
      setUploadStatus("Please select both a staff member and a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("staffId", selectedStaff);

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post("https://mygolden.co.uk/upload-dbs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        setUploadStatus("File uploaded successfully!");
      } else {
        setUploadStatus("Error uploading file.");
      }
    } catch (error) {
      setUploadStatus("Error uploading file.");
    }
  };

  // Function to check if a link is active
  const isActive = (path) => (location.pathname === path ? "bg-success" : "");

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
                <i className="bi bi-box-seam"></i> Client PPE Order
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/file-management"
                className={`nav-link ${isActive("/file-management")}`}
              >
                <i className="bi bi-folder"></i> File Management
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="container mt-5 flex-grow-1">
          <h1 className="text-center">DBS File Upload</h1>
          <p className="text-center">Upload the DBS check files here.</p>

          {/* Staff Selection */}
          <div className="d-flex justify-content-center mb-4">
            <div className="form-group">
              <label htmlFor="staffSelect">Select Staff Member:</label>
              <select
                id="staffSelect"
                className="form-control"
                value={selectedStaff}
                onChange={handleStaffChange}
              >
                <option value="">-- Select Staff --</option>
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File Upload Form */}
          <div className="d-flex justify-content-center mb-4">
            <div className="form-group">
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="text-center mb-3">
            <button
              className="btn btn-primary"
              onClick={handleFileUpload}
            >
              Upload File
            </button>
          </div>

          {/* Upload Status */}
          {uploadStatus && (
            <div className="alert alert-info text-center">
              {uploadStatus}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p>&copy; 2024 GoldenCore. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default DbsPage;
