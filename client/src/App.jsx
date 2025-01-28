import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Employee from './pages/Employees';
import Holidays from './pages/Holidays';
import Payroll from './pages/Payroll';
import EmployeeDashBoard from "./pages/EmployeeDashBoard";
import { jwtDecode } from "jwt-decode";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Home route (Only accessible by Admin or Manager) */}
        <Route 
          path="/home" 
          element={
            <PrivateRoute roles={['Admin', 'Manager']}>
              <Home />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} /> {/* Default route for Home */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employee" element={<Employee />} />
          <Route path="holidays" element={<Holidays />} />
          <Route path="payroll" element={<Payroll />} />
        </Route>

        {/* Employee dashboard route (Accessible by everyone else) */}
        <Route 
          path="/employee-dashboard" 
          element={
            <PrivateRoute roles={['Admin', 'Manager', 'Technician', 'Receptionist']}>
              <EmployeeDashBoard />
            </PrivateRoute>
          } 
        />

        {/* Redirect to login if no valid route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

const PrivateRoute = ({ roles, children }) => {
  const token = localStorage.getItem("token");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Decode the token to get the role
  let role;
  try {
    const decodedToken = jwtDecode(token);
    role = decodedToken.role; // Extract role from the token
  } catch (e) {
    return <Navigate to="/login" />;
  }

  // If user role is not in the allowed roles, redirect to Employee Dashboard
  if (!roles.includes(role)) {
    return <Navigate to="/employee-dashboard" />;
  }

  return children;
};

export default App;
