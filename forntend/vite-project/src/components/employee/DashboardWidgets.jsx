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
      {/* Shift time */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            ml: 2,
            pt: 3, // padding-top
            pr: 40, // padding-right
            pb: 3, // padding-bottom
            pl: 6, // padding-left
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
           <CheckCircleIcon sx={{ color: "white", fontSize: 60 }} />

          </Box>

          <Typography variant="h6" color="text.secondary">
            Shift Time
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#2c3e50", my: 1 }}
          >
            9:00 AM - 5:00 PM
          </Typography>
        </Paper>
      </Grid>

      {/* Department */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            ml: 2,
            pt: 3, // padding-top
            pr: 40, // padding-right
            pb: 3, // padding-bottom
            pl: 6, // padding-left
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
            Department
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#2c3e50", my: 1 }}
          >
            Marketing
          </Typography>
        </Paper>
      </Grid>

      {/* Position */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            ml: 2,
            pt: 3, // padding-top
            pr: 49.5, // padding-right
            pb: 3, // padding-bottom
            pl: 6, // padding-left
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
            <PeopleIcon sx={{ color: "white", fontSize: 60 }} />
          </Box>

          <Typography variant="h6" color="text.secondary">
            Position
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#2c3e50", my: 1 }}
          >
            Salesman
          </Typography>
        </Paper>
      </Grid>

      {/* Total Hours */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            ml: 2,
            pt: 3, // padding-top
            pr: 40.5, // padding-right
            pb: 3, // padding-bottom
            pl: 6, // padding-left
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
            Total Hours
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#2c3e50", my: 1 }}
          >
            8 hrs
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardWidgets;
