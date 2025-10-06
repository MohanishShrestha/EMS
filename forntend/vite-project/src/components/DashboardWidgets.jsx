import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  ArrowUpward as ArrowUpwardIcon,
} from "@mui/icons-material";
import axios from "axios";
import { url } from "../constant";

const DashboardWidgets = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [workingToday, setWorkingToday] = useState(0);
  const employeeIncrease = 10;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch employee list
        const employeeRes = await axios.get(`${url}/employee`);
        const employees = employeeRes.data.result || [];

        // Filter out admins
        const nonAdminEmployees = employees.filter(
          (emp) => emp.role !== "admin"
        );
        setTotalEmployees(nonAdminEmployees.length);

        // Get non-admin employee IDs
        const nonAdminIds = nonAdminEmployees.map((emp) => emp.id);

        // Fetch attendance records
        const attendanceRes = await axios.get(`${url}/attendance`);
        const attendanceRecords = attendanceRes.data.result || [];

        // Get today's date in Nepal local format (YYYY-MM-DD)
        const today = new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Kathmandu",
        });

        // Count non-admins who checked in today and are marked Present
        const workingTodayCount = attendanceRecords.filter((record) => {
          const recordDate = new Date(record.date).toLocaleDateString("en-CA", {
            timeZone: "Asia/Kathmandu",
          });
          return (
            recordDate === today &&
            record.status === "Present" &&
            nonAdminIds.includes(record.employee)
          );
        }).length;

        setWorkingToday(workingTodayCount);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const totalWorkforce = totalEmployees;
  const percentageWorking = totalWorkforce
    ? ((workingToday / totalWorkforce) * 100).toFixed(0)
    : 0;

  return (
    <Grid container spacing={2}>
      {/* Total Employees */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            ml: -3,
            pt: 6,
            pr: 40,
            pb: 8.5,
            pl: 9,
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
            {/* <ArrowUpwardIcon sx={{ mr: 0.5, fontSize: 18 }} />
            {employeeIncrease}% increase from last month */}
          </Typography>
        </Paper>
      </Grid>

      {/* Working Today */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            pt: 6,
            pr: 39,
            pb: 6,
            pl: 9,
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
