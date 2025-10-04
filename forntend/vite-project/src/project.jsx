import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import SidebarEmployee from "./components/employee/SidebarEmployee";
import HeaderEmployee from "./components/employee/HeaderEmployee";
import Dashboard from "./components/Dashboard";
import AttendancePage from "./components/Attendance";
import Payroll from "./components/Payroll";
import Login from "./components/Login";
import EmployeePage from "./components/Employess";
import Header from "./components/Header";
import { Box } from "@mui/material";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import EmployeeAttendancePage from "./components/employee/EmployeeAttendancePage";
import MyPayrollPage from "./components/employee/MyPayrollPage";
import RosterPage from "./components/employee/EmpyloyeeRoster";
import RosterPages from "./components/RosterPage";
import PageNotFound from "./components/PageNotFound";

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

function EmployeeLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <SidebarEmployee />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f7f9" }}
      >
        <HeaderEmployee />

        <Routes>
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="roster" element={<RosterPage />} />
          <Route path="attendance" element={<EmployeeAttendancePage />} />
          <Route path="payroll" element={<MyPayrollPage />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Box>
    </Box>
  );
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
          <Route path="roster" element={<RosterPages />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Box>
    </Box>
  );
}

function Project() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/project/admin/*"
        element={
          <RequireAuth role="admin">
            <AdminLayout />
          </RequireAuth>
        }
      />

      <Route
        path="/project/employee/*"
        element={
          <RequireAuth role="employee">
            <EmployeeLayout />
          </RequireAuth>
        }
      />

      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default Project;
