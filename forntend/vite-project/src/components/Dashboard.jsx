import { Box, CssBaseline, Grid } from "@mui/material";
import DashboardWidgets from "./DashboardWidgets";
import Header from "./Header";
import Sidebar from "./Sidebar";
import TodayEvent from "./TodayEvents";

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
    <Box>
      <CssBaseline />

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f7f9" }}
      >
        {/* Dashboard Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <DashboardWidgets data={mockData} />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <TodayEvent event={mockData.todayEvent} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
