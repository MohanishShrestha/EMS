import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import RosterPage from "./components/RosterPage";
import AttendancePage from "./components/Attendance";
import Payroll from "./components/Payroll";
import Login from "./components/Login";
import EmployeePage from "./components/Employess";
import Header from "./components/Header";
import { Box } from "@mui/material";

function RequireAuth({ children, role }) {
  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.warn("Invalid user data in localStorage");
  }

  const location = useLocation();

  if (!token || (role && user?.role !== role)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AdminLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f7f9" }}
      >
        <Header />

        {/* Routed Pages */}
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<EmployeePage />} />
          <Route path="roster" element={<RosterPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Box>
    </Box>
  );
}

function Project() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/project/admin/*"
        element={
          <RequireAuth role="admin">
            <AdminLayout />
          </RequireAuth>
        }
      />

      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default Project;
