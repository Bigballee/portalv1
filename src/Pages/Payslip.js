import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom"; // Import useLocation for active link styling
import axios from "axios";

const PayslipPage = () => {
  const [file, setFile] = useState(null); // Selected file for upload
  const [uploadStatus, setUploadStatus] = useState(""); // Status of the file upload
  const [staffList, setStaffList] = useState([]); // List of staff members
  const [selectedStaff, setSelectedStaff] = useState(""); // Selected staff member for file upload
  const [uploadedFiles, setUploadedFiles] = useState([]); // List of uploaded files for the selected staff

  const location = useLocation(); // Get current route

  // Fetch list of staff members when component mounts
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("http://localhost:5001/staff");
        setStaffList(response.data); // Set staff list from API response
      } catch (error) {
        console.error("Error fetching staff list:", error);
      }
    };
    fetchStaff();
  }, []);

  // Fetch uploaded files when a staff member is selected
  const fetchUploadedFiles = async () => {
    try {
      if (selectedStaff) {
        const response = await axios.get(`http://localhost:5001/get-uploaded-payslips/${selectedStaff}`);
        setUploadedFiles(response.data); // Set uploaded files for the selected staff
      }
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
    }
  };

  useEffect(() => {
    fetchUploadedFiles(); // Fetch uploaded files when staff member is selected
  }, [selectedStaff]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Set selected file to state
    }
  };

  // Handle staff selection from dropdown
  const handleStaffChange = (e) => {
    setSelectedStaff(e.target.value); // Set selected staff member
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    if (!selectedStaff) {
      setUploadStatus("Please select a staff member to upload the file to.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Append file to form data
    formData.append("staffId", selectedStaff); // Append selected staff ID

    try {
      setUploadStatus("Uploading...");

      // Send the file to the backend
      const response = await axios.post("http://localhost:5001/upload-payslip", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setUploadStatus("File uploaded successfully!");
        fetchUploadedFiles(); // Refresh uploaded files list
      } else {
        setUploadStatus("Error uploading file. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file. Please try again.");
    }
  };

  // Handle file download
  const handleFileDownload = (fileUrl) => {
    window.open(fileUrl, "_blank"); // Open file in new tab
  };

  // Function to check if a link is active
  const isActive = (path) => (location.pathname === path ? "bg-success text-white" : "text-white");

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
              <Link to="/admin" className={`nav-link ${isActive("/admin")}`}>
                <i className="bi bi-house-door"></i> Admin Page
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/manage-users"
                className={`nav-link ${isActive("/manage-users")}`}
              >
                <i className="bi bi-person-lines-fill"></i> Manage Carers
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/view-reports"
                className={`nav-link ${isActive("/view-reports")}`}
              >
                <i className="bi bi-file-earmark-bar-graph"></i> View Reports
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dbs" className={`nav-link ${isActive("/dbs")}`}>
                <i className="bi bi-file-earmark-lock"></i> DBS
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/payslip" className={`nav-link ${isActive("/payslip")}`}>
                <i className="bi bi-cash"></i> Payslip
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/cv" className={`nav-link ${isActive("/cv")}`}>
                <i className="bi bi-file-person"></i> CV
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/employment-contract"
                className={`nav-link ${isActive("/employment-contract")}`}
              >
                <i className="bi bi-file-earmark-text"></i> Employment Contract
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/rota" className={`nav-link ${isActive("/rota")}`}>
                <i className="bi bi-calendar-check"></i> Rota
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/client-ppe-order"
                className={`nav-link ${isActive("/client-ppe-order")}`}
              >
                <i className="bi bi-box-seam"></i> Client PPE Order
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="container mt-5 flex-grow-1">
          <h1 className="text-center">Payslip File Upload</h1>
          <p className="text-center">Upload the payslip files here.</p>

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

          {/* Upload Button */}
          <div className="text-center mb-3">
            <button
              className="btn btn-primary"
              onClick={handleFileUpload}
            >
              Upload Payslip
            </button>
          </div>

          {/* Upload Status */}
          {uploadStatus && (
            <div className="alert alert-info text-center">
              {uploadStatus}
            </div>
          )}

          {/* List of Uploaded Files */}
          <div className="mt-5">
            <h3 className="text-center">Uploaded Payslips</h3>
            <ul className="list-group">
              {uploadedFiles.length > 0 ? (
                uploadedFiles.map((file) => (
                  <li key={file.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{file.name}</span>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleFileDownload(file.url)}
                    >
                      Download
                    </button>
                  </li>
                ))
              ) : (
                <li className="list-group-item">No payslips uploaded yet.</li>
              )}
            </ul>
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

export default PayslipPage;
