import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";




const EmploymentContractPage = () => {
  const [contractList, setContractList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const location = useLocation();

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/staff");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchContracts = async () => {
    try {
      const response = await axios.get("http://localhost:5001/employment-contracts");
      setContractList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employment contracts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
    fetchUsers();
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUserChange = (e) => setSelectedUser(e.target.value);

  const handleUpload = async () => {
    if (!file || !selectedUser) {
      alert("Please select a user and a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("contract", file);
    formData.append("user_id", selectedUser);

    try {
      const response = await axios.post("http://localhost:5001/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setContractList([...contractList, response.data]);
      alert("File uploaded successfully.");
    } catch (error) {
      console.error("Error uploading contract:", error);
      alert("Failed to upload the file. Please try again.");
    }
  };

  const handleDownloadContract = async (fileName, userId) => {
    try {
      const response = await axios.get(`http://localhost:5001/get-file`, {
        params: { file_name: fileName, user_id: userId },
      });

      const downloadUrl = response.data.file_url;
      window.location.href = downloadUrl;
    } catch (error) {
      console.error("Error downloading contract:", error);
      alert("Failed to download the file. Please try again.");
    }
  };

  const isActive = (path) => (location.pathname === path ? "bg-success" : "");

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
        <div className="sidebar bg-dark text-white p-4" style={{ width: "250px" }}>
          <h4>Admin Dashboard</h4>
          <ul className="nav flex-column">
          <li className="nav-item">
              <Link
                to="/manage-users"
                className={`nav-link text-white ${isActive("/manage-users")}`}
              >
                <i className="bi bi-person-lines-fill"></i> Manage Carers
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/view-reports"
                className={`nav-link text-white ${isActive("/view-reports")}`}
              >
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
              <Link
                to="/employment-contract"
                className={`nav-link text-white ${isActive("/employment-contract")}`}
              >
                <i className="bi bi-file-earmark-text"></i> Employment Contract
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/rota" className={`nav-link text-white ${isActive("/rota")}`}>
                <i className="bi bi-calendar-check"></i> Rota
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/client-ppe-order"
                className={`nav-link text-white ${isActive("/client-ppe-order")}`}
              >
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

        <div className="container mt-5 flex-grow-1">
          <h1 className="text-center">Employment Contracts</h1>
          <p className="text-center">Here is a list of all uploaded employment contracts.</p>

          <div className="mb-4">
            <label htmlFor="userSelect" className="form-label">Select User</label>
            <select id="userSelect" className="form-select" value={selectedUser} onChange={handleUserChange}>
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <label htmlFor="contractUpload" className="form-label">Upload Employment Contract</label>
            <input type="file" className="form-control" id="contractUpload" onChange={handleFileChange} />
            <button className="btn btn-primary mt-3" onClick={handleUpload}>Upload Contract</button>
          </div>

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
                      <td colSpan="3" className="text-center">Loading...</td>
                    </tr>
                  ) : (
                    contractList.map((contract) => (
                      <tr key={contract.id}>
                        <td>{contract.staffName}</td>
                        <td>{contract.fileName}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleDownloadContract(contract.fileName, contract.userId)}
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
    </div>
  );
};

export default EmploymentContractPage;
