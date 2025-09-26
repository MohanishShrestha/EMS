import React from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  ArrowUpward as ArrowUpwardIcon,
} from "@mui/icons-material";

const DashboardWidgets = ({
  data = {
    totalEmployees: 100,
    employeeIncrease: 10,
    workingToday: 60,
    totalWorkforce: 100,
  },
}) => {
  const { totalEmployees, employeeIncrease, workingToday, totalWorkforce } =
    data;

  const percentageWorking = ((workingToday / totalWorkforce) * 100).toFixed(0);

  return (
    <Grid container spacing={2}>
      {/* Total Employees */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            ml: 2,
            pt: 6, // padding-top
            pr: 30, // padding-right
            pb: 6, // padding-bottom
            pl: 9, // padding-left
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 24,
              right: 24,
              backgroundColor: "#3498db",
              borderRadius: "12px",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PeopleIcon sx={{ color: "white", fontSize: 60 }} />
          </Box>

          <Typography variant="h6" color="text.secondary">
            Total Employees
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: "#2c3e50", my: 1 }}
          >
            {totalEmployees}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#2ecc71", display: "flex", alignItems: "center" }}
          >
            <ArrowUpwardIcon sx={{ mr: 0.5, fontSize: 18 }} />
            {employeeIncrease}% increase from last month
          </Typography>
        </Paper>
      </Grid>

      {/* Working Today */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            pt: 6, // padding-top
            pr: 28, // padding-right
            pb: 6, // padding-bottom
            pl: 9, // padding-left
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              backgroundColor: "#2ecc71",
              borderRadius: "12px",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircleIcon sx={{ color: "white", fontSize: 60 }} />
          </Box>

          <Typography variant="h6" color="text.secondary">
            Working Today
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: "#2c3e50", my: 1 }}
          >
            {workingToday}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {percentageWorking}% of total workforce present today
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardWidgets;
