import { Box, CssBaseline, Grid } from "@mui/material";

import DashboardWidgets from "./DashboardWidgets";
import TodayEventss from "./TodayEventss";

// ... mockData remains the same

const EmployeeDashboard = () => {
  return (
    <Box>
      <CssBaseline />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 1.5, backgroundColor: "#f4f7f9" }}
      >
        <Grid container spacing={3} sx={{ mt: 2 }}> 
            <DashboardWidgets />
             <TodayEventss />
          
          
        </Grid>
      </Box>
    </Box>
  );
};

export default EmployeeDashboard;