import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios

const ManageUserPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch staff and pending registrations from the backend
  useEffect(() => {
    // Fetch all pending registrations
    axios
      .get("http://localhost:5001/pending-registrations") // Replace with your pending registrations endpoint
      .then((response) => {
        // Ensure the response data is an array before setting it
        if (Array.isArray(response.data)) {
          setPendingRegistrations(response.data);
        } else {
          console.error("Expected an array, but got:", response.data);
          setPendingRegistrations([]); // Fallback to an empty array in case of invalid data
        }
      })
      .catch((error) => {
        console.error("Error fetching pending registrations:", error);
        setPendingRegistrations([]); // Fallback to an empty array in case of error
      });
  }, []);

  useEffect(() => {
    // Fetch staff based on searchQuery (debounced)
    const fetchStaff = async () => {
      try {
        const response = await axios.get("http://localhost:5001/staff", {
          params: { search: searchQuery }, // Send the search query as a parameter
        });
        setStaffList(response.data);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    if (searchQuery === "") {
      setStaffList([]); // If search query is empty, reset the staff list
    } else {
      fetchStaff();
    }
  }, [searchQuery]); // Re-fetch staff data whenever searchQuery changes

  // Approve Registration Functionality
  const handleApproveRegistration = (id, role) => {
    const approvedRegistration = pendingRegistrations.find(
      (registration) => registration.user_id === id
    );

    if (approvedRegistration) {
      // Approve registration by sending it to the backend
      axios
        .post("http://localhost:5001/approve-registration/" + id)
        .then(() => {
          // Move the approved user to the staff list
          setStaffList([...staffList, { ...approvedRegistration, role }]);
          setPendingRegistrations(
            pendingRegistrations.filter((registration) => registration.user_id !== id)
          );
        })
        .catch((error) => {
          console.error("Error approving registration:", error);
        });
    }
  };

  // Decline Registration Functionality
  const handleDeclineRegistration = (id) => {
    axios
      .delete(`http://localhost:5001/decline-registration/${id}`)
      .then(() => {
        // Remove the declined registration from the state
        setPendingRegistrations(
          pendingRegistrations.filter((registration) => registration.user_id !== id)
        );
      })
      .catch((error) => {
        console.error("Error declining registration:", error);
      });
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
          <h1 className="text-center">User Page</h1>
          <p className="text-center">Select an option from the sidebar to get started.</p>
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
