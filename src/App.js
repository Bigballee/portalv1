import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import { Provider } from "react-redux"; // Import Provider
import store from "../src/Pages/foldercomp/store"; // Import your store

// Import components
import LoginPage from "./Components/LoginPage";
import AdminPage from "./Components/AdminPage";
import StaffPage from "./Components/StaffPage";
import CreateAccountPage from "./Components/CreateAccountPage"; 
import ForgotPasswordPage from "./Components/ForgotPasswordPage";

// Admin Pages
import ManageUsersPage from "./Pages/ManageUsersPage";
import ViewReports from "./Pages/ViewReports";
import Dbs from "./Pages/Dbs";
import Payslip from "./Pages/Payslip";
import Cvs from "./Pages/Cvs";
import Employment from "./Pages/Employment";
import Rota from "./Pages/Rota";
import ClientOrder from "./Pages/ClientOrder";
import Filemanager from "./Pages/Filemanager";

// Staff Pages
import StaffRotaPage from "./StaffPages/staffrota";
import StaffPayslipPage from "./StaffPages/staffpayslip";
import StaffEmploymentContractPage from "./StaffPages/staffemploymentcontract";
import StaffDbsPage from "./StaffPages/staffdbs";
import StaffViewReportPage from "./StaffPages/staffviewreports";

function App() {
  const isAuthenticated = true; // Replace with authentication logic
  const userRole = "admin"; // Replace with role-based logic

  const ProtectedRoute = ({ element, allowedRoles }) => {
    if (!isAuthenticated) return <Navigate to="/" />;
    if (!allowedRoles.includes(userRole)) return <Navigate to="/" />;
    return element;
  };

  return (
    <Provider store={store}> {/* Wrap everything in Provider */}
      <Router>
        <div>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={<ProtectedRoute element={<AdminPage />} allowedRoles={['admin']} />} 
            />
            <Route 
              path="/manage-users" 
              element={<ProtectedRoute element={<ManageUsersPage />} allowedRoles={['admin']} />} 
            />
            <Route 
              path="/view-reports" 
              element={<ProtectedRoute element={<ViewReports />} allowedRoles={['admin']} />} 
            />
            <Route 
              path="/dbs" 
              element={<ProtectedRoute element={<Dbs />} allowedRoles={['admin']} />} 
            />
            <Route 
              path="/payslip" 
              element={<ProtectedRoute element={<Payslip />} allowedRoles={['admin']} />} 
            />
            <Route 
              path="/cv" 
              element={<ProtectedRoute element={<Cvs />} allowedRoles={['admin']} />} 
            />
            <Route 
              path="/employment-contract" 
              element={<ProtectedRoute element={<Employment />} allowedRoles={['admin']} />} 
            />
            <Route 
              path="/rota" 
              element={<ProtectedRoute element={<Rota />} allowedRoles={['admin']} />} 
            />
            <Route 
              path="/client-ppe-order" 
              element={<ProtectedRoute element={<ClientOrder />} allowedRoles={['admin']} />} 
            />

            <Route 
              path="/file-management"
              element={<ProtectedRoute element={<Filemanager />} allowedRoles={['admin']} />}
            />

            {/* Staff Routes */}
            <Route 
              path="/staff" 
              element={<ProtectedRoute element={<StaffPage />} allowedRoles={['staff']} />} 
            />
            <Route 
              path="/staff-rota" 
              element={<ProtectedRoute element={<StaffRotaPage />} allowedRoles={['staff']} />} 
            />
            <Route 
              path="/staff-view-payslip" 
              element={<ProtectedRoute element={<StaffPayslipPage />} allowedRoles={['staff']} />} 
            />
            <Route 
              path="/staff-employment-contract" 
              element={<ProtectedRoute element={<StaffEmploymentContractPage />} allowedRoles={['staff']} />} 
            />
            <Route 
              path="/staff-dbs" 
              element={<ProtectedRoute element={<StaffDbsPage />} allowedRoles={['staff']} />} 
            />
            <Route 
              path="/staff-view-reports" 
              element={<ProtectedRoute element={<StaffViewReportPage />} allowedRoles={['staff']} />} 
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
