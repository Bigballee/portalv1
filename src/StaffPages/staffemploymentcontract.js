import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom"; // Import useLocation for active link styling
import axios from "axios"; // Import axios

const StaffEmploymentContractPage = () => {
  const [contractList, setContractList] = useState([]); // State to hold the employment contract files for the staff
  const [loading, setLoading] = useState(true); // State for loading indicator
  const location = useLocation(); // Get current route
  const fullName = localStorage.getItem("fullName"); // Assuming the full name is saved in localStorage

  // Fetch the employment contract files for the logged-in staff user
  useEffect(() => {
    const fetchStaffContractFiles = async () => {
      try {
        const response = await axios.get("http://localhost:5001/staff-employment-contract", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include authorization token if needed
          },
        }); // Fetch employment contract files for the logged-in staff
        setContractList(response.data); // Assuming response is an array of contract files
        setLoading(false); // Stop loading after data is fetched
      } catch (error) {
        console.error("Error fetching staff employment contract files:", error);
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchStaffContractFiles();
  }, []);

  // Handle contract file download
  const handleDownloadContract = (fileName) => {
    if (!fullName) {
      console.error("Full name not found!");
      return;
    }
    const formattedName = fullName.replace(" ", "_"); // Replace space with underscore
    const filePath = `goldencare-doc/employments-contracts/${formattedName}/${fileName}`;
    // Trigger file download by opening the file in a new tab
    window.open(`http://localhost:5001/download-contract/${filePath}`, '_blank');
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
          <h4>Carers Dashboard</h4>
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link to="/staff" className={`nav-link text-white ${isActive("/staff-dashboard")}`}>
                <i className="bi bi-house-door"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/staff-view-reports" className={`nav-link text-white ${isActive("/staff-view-reports")}`}>
                <i className="bi bi-file-earmark-bar-graph"></i> View Reports
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/staff-dbs" className={`nav-link text-white ${isActive("/staff-dbs")}`}>
                <i className="bi bi-file-earmark-lock"></i> DBS
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/staff-view-payslip" className={`nav-link text-white ${isActive("/staff-view-payslip")}`}>
                <i className="bi bi-file-earmark-lock"></i> View Payslip
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/staff-employment-contract" className={`nav-link text-white ${isActive("/staff-employment-contract")}`}>
                <i className="bi bi-file-earmark-text"></i> Employment Contract
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/staff-rota" className={`nav-link text-white ${isActive("/staff-rota")}`}>
                <i className="bi bi-calendar-check"></i> View Rota
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="container mt-5 flex-grow-1">
          <h1 className="text-center">My Employment Contract</h1>
          <p className="text-center">Here is your employment contract.</p>

          {/* Employment Contract Files Table */}
          <div className="d-flex justify-content-center mb-4">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Contract Name</th>
                    <th>Contract File</th>
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
                    contractList.length > 0 ? (
                      contractList.map((contract) => (
                        <tr key={contract.fileName}>
                          <td>{contract.fileName}</td>
                          <td>{contract.fileName}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleDownloadContract(contract.fileName)}
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No contracts found.
                        </td>
                      </tr>
                    )
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

export default StaffEmploymentContractPage;
