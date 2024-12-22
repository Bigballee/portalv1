import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios

const CvPage = () => {
  const [cvList, setCvList] = useState([]); // State to hold the list of CVs
  const [loading, setLoading] = useState(true); // State for loading indicator

  // Fetch the list of CVs from the backend
  useEffect(() => {
    const fetchCvs = async () => {
      try {
        const response = await axios.get("http://localhost:5001/cvs"); // Fetch CV list from backend
        setCvList(response.data); // Assuming response is an array of CVs
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching CVs:", error);
        setLoading(false); // Stop loading in case of an error
      }
    };

    fetchCvs();
  }, []);

  // Handle CV download
  const handleDownloadCv = (cvPath) => {
    // Trigger file download
    window.location.href = `http://localhost:5001/download-cv/${cvPath}`;
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
          <h1 className="text-center">Uploaded CVs</h1>
          <p className="text-center">Here is a list of all uploaded CVs.</p>

          {/* CV List Table */}
          <div className="d-flex justify-content-center mb-4">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Staff Name</th>
                    <th>CV File</th>
                    <th>Actions</th>
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
                    cvList.map((cv) => (
                      <tr key={cv.id}>
                        <td>{cv.staffName}</td>
                        <td>{cv.fileName}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleDownloadCv(cv.filePath)}
                          >
                            Download
                          </button>
                        </td>
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

export default CvPage;
