import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom"; // Import useLocation for active link styling
import axios from "axios"; // Import axios

const EmploymentContractPage = () => {
  const [contractList, setContractList] = useState([]); // State to hold the list of employment contracts
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [file, setFile] = useState(null); // State to hold the selected file for upload
  const [selectedUser, setSelectedUser] = useState(""); // State to hold the selected user
  const [users, setUsers] = useState([]); // State to hold the list of users
  const location = useLocation(); // Get current route

  // Fetch the list of users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/users"); // Fetch user list
      setUsers(response.data); // Assuming response is an array of users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch the list of employment contracts from the backend
  const fetchContracts = async () => {
    try {
      const response = await axios.get("http://localhost:5001/employment-contracts"); // Fetch employment contract list
      setContractList(response.data); // Assuming response is an array of contracts
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching employment contracts:", error);
      setLoading(false); // Stop loading in case of an error
    }
  };

  // Fetch contracts and users when the component mounts
  useEffect(() => {
    fetchContracts();
    fetchUsers();
  }, []);

  // Handle file change (for file upload)
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle user selection change
  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file || !selectedUser) {
      alert("Please select a user and a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("contract", file);
    formData.append("userId", selectedUser); // Add the selected user to the form data

    try {
      const response = await axios.post("http://localhost:5001/upload-employment-contract", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // On successful upload, fetch the list of contracts again
      setContractList([...contractList, response.data]); // Assuming response contains the new contract
    } catch (error) {
      console.error("Error uploading contract:", error);
    }
  };

  // Handle contract download
  const handleDownloadContract = (filePath) => {
    // Trigger file download
    window.location.href = `http://localhost:5001/download-employment-contract/${filePath}`;
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
          </ul>
        </div>

        {/* Main Content */}
        <div className="container mt-5 flex-grow-1">
          <h1 className="text-center">Employment Contracts</h1>
          <p className="text-center">Here is a list of all uploaded employment contracts.</p>

          {/* User Selection and File Upload Section */}
          <div className="mb-4">
            <label htmlFor="userSelect" className="form-label">Select User</label>
            <select
              id="userSelect"
              className="form-select"
              value={selectedUser}
              onChange={handleUserChange}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} {/* Assuming `user.name` exists */}
                </option>
              ))}
            </select>
            <label htmlFor="contractUpload" className="form-label">
              Upload Employment Contract
            </label>
            <input
              type="file"
              className="form-control"
              id="contractUpload"
              onChange={handleFileChange}
            />
            <button className="btn btn-primary mt-3" onClick={handleUpload}>
              Upload Contract
            </button>
          </div>

          {/* Employment Contracts Table */}
          <div className="d-flex justify-content-center mb-4">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Staff Name</th>
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
                    contractList.map((contract) => (
                      <tr key={contract.id}>
                        <td>{contract.staffName}</td>
                        <td>{contract.fileName}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleDownloadContract(contract.filePath)}
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

export default EmploymentContractPage;
