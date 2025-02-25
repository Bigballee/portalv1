import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";

const ClientOrderPage = () => {
  const [orderList, setOrderList] = useState([]); // State to hold the list of client PPE orders
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [file, setFile] = useState(null); // State to hold the selected file for upload
  const [orderDetails, setOrderDetails] = useState({
    clientName: "",
    orderDate: "",
    orderQuantity: "",
  }); // State for order form input

  const location = useLocation(); // Get current route

  // Fetch the list of client PPE orders from the backend
  useEffect(() => {
    const fetchClientOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5001/client-ppe-orders"); // Endpoint to fetch client PPE orders
        setOrderList(response.data); // Assuming response is an array of orders
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching client PPE orders:", error);
        setLoading(false); // Stop loading in case of an error
      }
    };

    fetchClientOrders();
  }, []);

  // Handle file change (for file upload)
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle order form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle file upload for client PPE order
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("clientPPEOrder", file);

    try {
      const response = await axios.post("http://localhost:5001/upload-client-ppe-order", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // On successful upload, fetch the order list again
      setOrderList([...orderList, response.data]); // Assuming response contains the new order
    } catch (error) {
      console.error("Error uploading client PPE order file:", error);
    }
  };

  // Handle order form submission
  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/submit-client-ppe-order", orderDetails);
      // On successful form submission, add the new order to the list
      setOrderList([...orderList, response.data]);
      setOrderDetails({
        clientName: "",
        orderDate: "",
        orderQuantity: "",
      }); // Reset the form
    } catch (error) {
      console.error("Error submitting client PPE order:", error);
    }
  };

  // Function to check if a link is active
  const isActive = (path) => location.pathname === path ? "bg-success" : "";

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
                <i className="bi bi-box-seam"></i>PPE Order
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
          <h1 className="text-center">ClientPPE Orders</h1>
          <p className="text-center">Here is a list of all submitted client PPE orders.</p>

          {/* File Upload Section */}
          <div className="mb-4">
            <label htmlFor="orderUpload" className="form-label">
              Upload Client PPE Order File
            </label>
            <input
              type="file"
              className="form-control"
              id="orderUpload"
              onChange={handleFileChange}
            />
            <button className="btn btn-primary mt-3" onClick={handleUpload}>
              Upload Client PPE Order
            </button>
          </div>

          {/* Client PPE Orders List */}
          <div className="d-flex justify-content-center mb-4">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Order Date</th>
                    <th>Order Quantity</th>
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
                    orderList.map((order, index) => (
                      <tr key={index}>
                        <td>{order.clientName}</td>
                        <td>{order.orderDate}</td>
                        <td>{order.orderQuantity}</td>
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

export default ClientOrderPage;
