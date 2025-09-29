import React from "react";
import { Box, Grid, CssBaseline } from "@mui/material";

import DashboardWidgets from "./DashboardWidgets";
import TodayEventss from "./TodayEventss";
import Header from "./HeaderEmployee";
import Sidebar from "./SidebarEmployee";
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
    <Box>
      <CssBaseline />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 1.5, backgroundColor: "#f4f7f9" }}
      >
        <Grid container spacing={5} sx={{ mt: 5 }}>
          <Grid item xs={12} md={6} lg={4}>
            <DashboardWidgets data={mockData} />
          </Grid>
          
            <TodayEventss event={mockData.todayEvent} />
          
        </Grid>
        
      </Box>
    </Box>
  );
};

export default EmployeeDashboard;
