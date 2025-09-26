import React from "react";
import { Box, Grid, CssBaseline } from "@mui/material";

import DashboardWidgets from "./DashboardWidgets";
import TodayEvent from "./TodayEvents";
import Header from "./Header";
import Sidebar from "./Sidebar";
import RosterPage from "../RosterPage";
import EmployeeRosterPage from "./EmpyloyeeRoster";
import EmployeeAttendancePage from "./EmployeeAttendancePage";
import MyPayrollPage from "./MyPayrollPage";

const mockData = {
  totalEmployees: 142,
  employeeIncrease: 12,
  workingToday: 96,
  totalWorkforce: 142,
  todayEvent: {
    title: "Bipan's Birthday",
    description: "Today at 3 PM in the common area.",
  },
};

const EmployeeDashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 1.5, backgroundColor: "#f4f7f9" }}
      >
        <Header />
        <Grid container spacing={5} sx={{ mt: 5 }}>
          <Grid item xs={12} md={6} lg={4}>
            <DashboardWidgets data={mockData} />
          </Grid>
          <Grid item xs={12} md={4} lg={8}>
            <TodayEvent event={mockData.todayEvent} />
          </Grid>
        </Grid>
        {/* <EmployeeRosterPage /> */}
        {/* <EmployeeAttendancePage /> */}
        {/* <MyPayrollPage /> */}
      </Box>
    </Box>
  );
};

export default EmployeeDashboard;
