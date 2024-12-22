import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import LoginPage from "./Components/LoginPage";
import AdminPage from "./Components/AdminPage";
import StaffPage from "./Components/StaffPage";
import CreateAccountPage from "./Components/CreateAccountPage"; 
import ForgotPasswordPage from "./Components/ForgotPasswordPage";
import ManageUsersPage from "./Pages/ManageUsersPage";
import ViewReports from "./Pages/ViewReports";
import Dbs from "./Pages/Dbs";
import Payslip from "./Pages/Payslip";
import Cvs from "./Pages/Cvs";
import Employment from "./Pages/Employment";
import Rota from "./Pages/Rota";
import ClientOrder from "./Pages/ClientOrder";
import Carer from "./Pages/Carer"
import Client from "./Pages/Client"

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/manage-users" element={<ManageUsersPage />} />
          <Route path="/view-reports" element={<ViewReports />} />
          <Route path="/carer" element={<Carer />} />
          <Route path="/client" element={<Client />} />
          <Route path="/dbs" element={<Dbs />} />
          <Route path="/payslip" element={<Payslip />} />
          <Route path="/cv" element={<Cvs />} />
          <Route path="/employment-contract" element={<Employment />} />
          <Route path="/rota" element={<Rota />} />
          <Route path="/client-ppe-order" element={<ClientOrder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
