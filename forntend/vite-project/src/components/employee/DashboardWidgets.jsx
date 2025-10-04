import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import axios from "axios";
import { url } from "../../constant";
import dayjs from "dayjs";

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

  const [shiftTime, setShiftTime] = useState("No shift today");
  const [totalHours, setTotalHours] = useState("0 hrs");
  const [department, setDepartment] = useState("N/A");
  const [position, setPosition] = useState("N/A");

  useEffect(() => {
    const fetchShift = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        const employeeId = user.id;

        const res = await axios.get(`${url}/roster`);
        const today = dayjs().format("YYYY-MM-DD");

        const todayShift = res.data.result.find(
          (shift) =>
            shift.employee_id === employeeId &&
            dayjs(shift.shift_date).format("YYYY-MM-DD") === today
        );

        if (todayShift) {
          setShiftTime(`${todayShift.start_time} - ${todayShift.end_time}`);

          // Calculate total hours
          const startTime = dayjs(
            `${today} ${todayShift.start_time}`,
            "YYYY-MM-DD HH:mm"
          );
          let endTime = dayjs(
            `${today} ${todayShift.end_time}`,
            "YYYY-MM-DD HH:mm"
          );

          if (endTime.isBefore(startTime)) {
            endTime = endTime.add(1, "day");
          }

          const diffHours = endTime.diff(startTime, "minute") / 60;
          setTotalHours(`${diffHours.toFixed(1)} hrs`);
        }
      } catch (error) {
        console.error("Error fetching shift:", error);
      }
    };

    fetchShift();
  }, []);

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
  {/* <Grid item xs={12} md={6}>
    <Paper
      sx={{
        minHeight: { xs: 180, sm: 200, md: 200 }, 
        ml: 2,
        pt: 3,
        pr: 34,
        pb: 6,
        pl: 6,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
        <CheckCircleIcon sx={{ color: "white", fontSize: { xs: 50, md: 60 } }} />
      </Box>
      <Typography variant="h6" color="text.secondary">
        Shift Time
      </Typography>
      <Typography
        sx={{
          fontWeight: "bold",
          color: "#2c3e50",
          my: 1,
          textAlign: "center",
        }}
      >
        {shiftTime}
      </Typography>
    </Paper>
  </Grid> */}

<Grid item xs={12} md={6}>
    <Paper
      sx={{
        minHeight: { xs: 180, sm: 200, md: 200 },
        ml: 2,
        pt: 3,
        pr: 34,
        pb: 6,
        pl: 6,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
        <CheckCircleIcon sx={{ color: "white", fontSize: { xs: 50, md: 60 } }} />
      </Box>
      <Typography variant="h6" color="text.secondary">
        Shift Time
      </Typography>
      <Typography
        sx={{
          fontWeight: "bold",
          color: "#2c3e50",
          my: 1,
          textAlign: "center",
        }}
      >
        {shiftTime}
      </Typography>
    </Paper>
  </Grid>

  {/* Total Hours */}
  <Grid item xs={12} md={6}>
    <Paper
      sx={{
        minHeight: { xs: 180, sm: 200, md: 200 },
        ml: 2,
        pt: 3,
        pr: 45,
        pb: 6,
        pl: 6,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
        <CheckCircleIcon sx={{ color: "white", fontSize: { xs: 50, md: 60 } }} />
      </Box>
      <Typography variant="h6" color="text.secondary">
        Total Hours
      </Typography>
      <Typography
        sx={{
          fontWeight: "bold",
          color: "#2c3e50",
          my: 1,
          textAlign: "center",
        }}
      >
        {totalHours}
      </Typography>
    </Paper>
  </Grid>

  {/* Department */}
  <Grid item xs={12} md={6}>
    <Paper
      sx={{
        minHeight: { xs: 180, sm: 200, md: 200 },
        ml: 2,
        pt: 3,
        pr: 40.5,
        pb: 6,
        pl: 6,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
        <CheckCircleIcon sx={{ color: "white", fontSize: { xs: 50, md: 60 } }} />
      </Box>
      <Typography variant="h6" color="text.secondary">
        Department
      </Typography>
      <Typography
        sx={{
          fontWeight: "bold",
          color: "#2c3e50",
          my: 1,
          textAlign: "center",
        }}
      >
        {department}
      </Typography>
    </Paper>
  </Grid>

<Grid item xs={12} md={6}>
    <Paper
      sx={{
        minHeight: { xs: 180, sm: 200, md: 200 },
        ml: 2,
        pt: 3,
        pr: 40,
        pb: 6,
        pl: 6,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
        <CheckCircleIcon sx={{ color: "white", fontSize: { xs: 50, md: 60 } }} />
      </Box>
      <Typography variant="h6" color="text.secondary">
        Position
      </Typography>
      <Typography
        sx={{
          fontWeight: "bold",
          color: "#2c3e50",
          my: 1,
          textAlign: "center",
        }}
      >
        {position}
      </Typography>
    </Paper>
  </Grid>

  
</Grid>

  );
};

export default DashboardWidgets;
