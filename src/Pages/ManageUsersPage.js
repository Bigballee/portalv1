import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom"; // Import useLocation for active link styling
import axios from "axios";

const ManageUserPage = () => {
  const [staffList, setStaffList] = useState([]); // State for the list of staff
  const [pendingRegistrations, setPendingRegistrations] = useState([]); // State for pending user registrations
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const location = useLocation(); // Get current route

  // Fetch pending registrations from the backend
  useEffect(() => {
    const fetchPendingRegistrations = async () => {
      try {
        const response = await axios.get("http://localhost:5001/pending-registrations");
        setPendingRegistrations(Array.isArray(response.data) ? response.data : []); // Validate response data
      } catch (error) {
        console.error("Error fetching pending registrations:", error);
      }
    };
    fetchPendingRegistrations();
  }, []);

  // Fetch staff based on search query
  useEffect(() => {
    const fetchStaff = async () => {
      if (searchQuery.trim() === "") {
        setStaffList([]); // Reset staff list if search query is empty
        return;
      }

      try {
        const response = await axios.get("http://localhost:5001/staff", {
          params: { search: searchQuery },
        });
        setStaffList(response.data);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchStaff();
  }, [searchQuery]);

  // Approve a registration
  const handleApproveRegistration = async (id, role) => {
    try {
      await axios.post(`http://localhost:5001/approve-registration/${id}`);
      const approvedRegistration = pendingRegistrations.find(
        (registration) => registration.user_id === id
      );

      if (approvedRegistration) {
        setStaffList([...staffList, { ...approvedRegistration, role }]);
        setPendingRegistrations(
          pendingRegistrations.filter((registration) => registration.user_id !== id)
        );
      }
    } catch (error) {
      console.error("Error approving registration:", error);
    }
  };

  // Decline a registration
  const handleDeclineRegistration = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/decline-registration/${id}`);
      setPendingRegistrations(
        pendingRegistrations.filter((registration) => registration.user_id !== id)
      );
    } catch (error) {
      console.error("Error declining registration:", error);
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
          </ul>
        </div>

        {/* Main Content */}
        <div className="container mt-5 flex-grow-1">
          <h1 className="text-center">Manage Users</h1>
          <p className="text-center">View, approve, or decline pending registrations below.</p>

          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search for staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Pending Registrations */}
          <div className="mb-4">
            <h3>Pending Registrations</h3>
            {pendingRegistrations.length > 0 ? (
              <ul className="list-group">
                {pendingRegistrations.map((registration) => (
                  <li className="list-group-item d-flex justify-content-between align-items-center" key={registration.user_id}>
                    {registration.name}
                    <div>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleApproveRegistration(registration.user_id, registration.role)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeclineRegistration(registration.user_id)}
                      >
                        Decline
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No pending registrations.</p>
            )}
          </div>

          {/* Staff List */}
          <div>
            <h3>Staff List</h3>
            {staffList.length > 0 ? (
              <ul className="list-group">
                {staffList.map((staff) => (
                  <li className="list-group-item" key={staff.user_id}>
                    {staff.name} - {staff.role}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No staff found.</p>
            )}
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

export default ManageUserPage;
