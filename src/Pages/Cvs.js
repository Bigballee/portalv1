import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom"; // Import useLocation for active link styling
import axios from "axios"; // Import axios

const CvPage = () => {
  const [cvList, setCvList] = useState([]); // State to hold the list of CVs
  const [loading, setLoading] = useState(true); // State for loading indicator
  const location = useLocation(); // Get current route

  // Fetch the list of CVs from the backend
  useEffect(() => {
    const fetchCvs = async () => {
      try {
        const response = await axios.get("https://mygolden.co.uk/staff"); // Fetch CV list from backend
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
    window.location.href = `https://mygolden.co.uk/download-cv/${cvPath}`;
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
