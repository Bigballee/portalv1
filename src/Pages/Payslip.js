import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios

const PayslipPage = () => {
  const [file, setFile] = useState(null); // State to hold the selected file
  const [uploadStatus, setUploadStatus] = useState(""); // State to show upload status message
  const [staffList, setStaffList] = useState([]); // State to hold list of staff
  const [selectedStaff, setSelectedStaff] = useState(""); // State to hold the selected staff
  const [uploadedFiles, setUploadedFiles] = useState([]); // State to hold the list of uploaded files

  // Fetch staff members to populate the dropdown
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("http://localhost:5001/staff"); // Fetch the staff list from backend
        setStaffList(response.data); // Assuming response is an array of staff members
      } catch (error) {
        console.error("Error fetching staff list:", error);
      }
    };

    fetchStaff();
  }, []);

  // Fetch uploaded payslips from the backend
  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get("http://localhost:5001/get-uploaded-payslips");
      setUploadedFiles(response.data); // Assuming response is an array of file objects
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
    }
  };

  // Fetch uploaded files when the component mounts
  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handle staff selection
  const handleStaffChange = (e) => {
    setSelectedStaff(e.target.value);
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
    formData.append("file", file);
    formData.append("staffId", selectedStaff); // Append selected staff ID

    try {
      setUploadStatus("Uploading...");

      // Send the file and the staff ID to the backend
      const response = await axios.post("http://localhost:5001/upload-payslip", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setUploadStatus("File uploaded successfully!");
        // Fetch updated list of uploaded files
        fetchUploadedFiles(); // Now defined properly
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
    window.open(fileUrl, "_blank");
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
