import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios

const AnnualLeavePage = () => {
  const [leaveList, setLeaveList] = useState([]); // State to hold the list of annual leave entries
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [file, setFile] = useState(null); // State to hold the selected file for upload
  const [leaveDetails, setLeaveDetails] = useState({ employeeName: "", leaveDate: "", leaveDuration: "" }); // State for leave form input

  // Fetch the list of annual leave entries from the backend
  useEffect(() => {
    const fetchLeaveRecords = async () => {
      try {
        const response = await axios.get("http://localhost:5001/annual-leave"); // Endpoint to fetch leave records
        setLeaveList(response.data); // Assuming response is an array of leave records
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching annual leave records:", error);
        setLoading(false); // Stop loading in case of an error
      }
    };

    fetchLeaveRecords();
  }, []);

  // Handle file change (for file upload)
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle leave form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle file upload for annual leave information
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("annualLeave", file);

    try {
      const response = await axios.post("http://localhost:5001/upload-annual-leave", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // On successful upload, fetch the leave list again
      setLeaveList([...leaveList, response.data]); // Assuming response contains the new leave record
    } catch (error) {
      console.error("Error uploading annual leave file:", error);
    }
  };

  // Handle leave record form submission
  const handleLeaveSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/submit-annual-leave", leaveDetails);
      // On successful form submission, add the new leave record to the list
      setLeaveList([...leaveList, response.data]);
      setLeaveDetails({ employeeName: "", leaveDate: "", leaveDuration: "" }); // Reset the form
    } catch (error) {
      console.error("Error submitting annual leave:", error);
    }
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
              style={{ width: "150px", height: "auto" }} // Adjust the width as needed
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
          <h1 className="text-center">Annual Leave</h1>
          <p className="text-center">Here is a list of all submitted annual leave requests.</p>

          {/* File Upload Section */}
          <div className="mb-4">
            <label htmlFor="leaveUpload" className="form-label">
              Upload Annual Leave File
            </label>
            <input
              type="file"
              className="form-control"
              id="leaveUpload"
              onChange={handleFileChange}
            />
            <button className="btn btn-primary mt-3" onClick={handleUpload}>
              Upload Annual Leave
            </button>
          </div>

          {/* Annual Leave List */}
          <div className="d-flex justify-content-center mb-4">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Leave Date</th>
                    <th>Leave Duration (Days)</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    leaveList.map((leave, index) => (
                      <tr key={index}>
                        <td>{leave.employeeName}</td>
                        <td>{leave.leaveDate}</td>
                        <td>{leave.leaveDuration}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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

export default AnnualLeavePage;
