import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import axios from "axios";
import { url } from "../../constant";

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

  const [shiftTime, setShiftTime] = useState("N/A");
  const [totalHours, setTotalHours] = useState("N/A");
  const [department, setDepartment] = useState("N/A");
  const [position, setPosition] = useState("N/A");

  // Get shift info from roster
  useEffect(() => {
    axios.get(`${url}/roster`).then((res) => {
      const shift = res.data.result?.[0];
      if (shift) {
        setShiftTime(`${shift.start_time} - ${shift.end_time}`);

        // Calculate total hours
        const [startHour, startMin, startPeriod] = shift.start_time
          .replace(":", " ")
          .split(" ");
        const [endHour, endMin, endPeriod] = shift.end_time
          .replace(":", " ")
          .split(" ");

        const start = new Date();
        const end = new Date();

        start.setHours(
          parseInt(startHour) +
            (startPeriod === "PM" && startHour !== "12" ? 12 : 0),
          parseInt(startMin)
        );
        end.setHours(
          parseInt(endHour) + (endPeriod === "PM" && endHour !== "12" ? 12 : 0),
          parseInt(endMin)
        );

        const diff = (end - start) / (1000 * 60 * 60);
        setTotalHours(`${diff.toFixed(1)} hrs`);
      }
    });
  }, []);

  // Get employee info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setDepartment(user.department || "N/A");
        setPosition(user.position || "N/A");
      } catch (err) {
        console.warn("Invalid user data in localStorage");
      }
    }
  }, []);

  return (
    <Grid container spacing={2}>
      {/* Shift time */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            ml: -1.5,
            pt: 3,
            pr: 34,
            pb: 6,
            pl: 6,
            
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
            }}
          >
            <CheckCircleIcon sx={{ color: "white", fontSize: 60 }} />
          </Box>
          <Typography variant="h6" color="text.secondary">
            Shift Time
          </Typography>
          <Typography
            
            sx={{ fontWeight: "bold", color: "#2c3e50", my: 1 }}
          >
            {shiftTime}
          </Typography>
        </Paper>
      </Grid>

      {/* Total Hours */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            ml: 2,
            pt: 3,
            pr: 45,
            pb: 6,
            pl: 6,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 24,
              right: 24,
              backgroundColor: "#2ecc71",
              borderRadius: "12px",
              p: 1.5,
            }}
          >
            <CheckCircleIcon sx={{ color: "white", fontSize: 60 }} />
          </Box>
          <Typography variant="h6" color="text.secondary">
            Total Hours
          </Typography>
          <Typography
            
            sx={{ fontWeight: "bold", color: "#2c3e50", my: 1 }}
          >
            {totalHours}
          </Typography>
        </Paper>
      </Grid>

      {/* Department */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            ml: -1.5,
            pt: 3,
            pr: 40.5,
            pb: 6,
            pl: 6,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 24,
              right: 24,
              backgroundColor: "#2ecc71",
              borderRadius: "12px",
              p: 1.5,
            }}
          >
            <CheckCircleIcon sx={{ color: "white", fontSize: 60 }} />
          </Box>
          <Typography variant="h6" color="text.secondary">
            Department
          </Typography>
          <Typography
            
            sx={{ fontWeight: "bold", color: "#2c3e50", my: 1 }}
          >
            {department}
          </Typography>
        </Paper>
      </Grid>

      {/* Position */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            ml: 2,
            pt: 3,
            pr: 40,
            pb: 6,
            pl: 6,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 24,
              right: 24,
              backgroundColor: "#2ecc71",
              borderRadius: "12px",
              p: 1.5,
            }}
          >
            <PeopleIcon sx={{ color: "white", fontSize: 60 }} />
          </Box>
          <Typography variant="h6" color="text.secondary">
            Position
          </Typography>
          <Typography
            
            sx={{ fontWeight: "bold", color: "#2c3e50", my: 1 }}
          >
            {position}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardWidgets;
