import React from "react";
import { Box, Grid, CssBaseline } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardWidgets from "./DashboardWidgets";
import TodayEvent from "./TodayEvents";
import Employess from "./Employess";
import Attendance from "./Attendance";
import Payroll from "./Payroll";
import RosterPage from "./RosterPage";

const mockData = {
  totalEmployees: 142,
  employeeIncrease: 12,
  workingToday: 96,
  totalWorkforce: 142,
  todayEvent: {
    title: "Bipan's Birthday",
    description:
      "Join us in wishing Bipan a very happy birthday! Celebration at 3 PM in the common area.",
  },
};

const Dashboard = () => {
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
        {/* <Employess/> */}
        {/* <Attendance /> */}
        {/* <Payroll /> */}
        {/* <RosterPage /> */}
      </Box>
    </Box>
  );
};

export default Dashboard;
