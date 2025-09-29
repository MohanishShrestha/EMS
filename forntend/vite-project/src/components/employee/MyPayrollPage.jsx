import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import dayjs from "dayjs";
import axios from "axios";
import { url } from "../../constant";

const MyPayrollPage = () => {
  // Get User ID and Token from localStorage
  let employeeId = null;
  let token = null;

  try {
    const storeduser = localStorage.getItem("user");
    const user = storeduser ? JSON.parse(storeduser) : null;
    employeeId = user?._id || user?.id || null;
    token = localStorage.getItem("token");
  } catch (e) {
    console.error("Error parsing user from localStorage:", e);
  }

  // State for Employee and Payroll Data
  const [employeeDetails, setEmployeeDetails] = useState({
    name: "Loading...",
    position: "",
    annualSalary: 0,
  });
  const [annualSalary, setAnnualSalary] = useState(0);

  // State for Date Range and Calculated Data
  const [startDate, setStartDate] = useState(dayjs().subtract(15, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [totalHours, setTotalHours] = useState(0);

  const taxRate = 0.01;
  const standardWorkHoursPerYear = 2080; // 40 hours/week * 52 weeks

  // --- Data Fetching Logic ---

  // 1. Fetch Employee Details and Annual Salary
  const fetchEmployeeData = useCallback(async () => {
    if (!employeeId || !token) return;

    try {
      const employeeResponse = await axios.get(
        `${url}/employee/${employeeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const payrollResponse = await axios.get(`${url}/payroll/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const payrollsArray = payrollResponse.data?.payrolls || [];
      const latestPayroll =
        payrollsArray.length > 0 ? payrollsArray[0] : payrollResponse.data;

      const salary = latestPayroll?.annual_salary || 0;

      setEmployeeDetails({
        name: employeeResponse.data?.name || "N/A",
        position: employeeResponse.data?.position || "N/A",
        annualSalary: salary,
      });
      setAnnualSalary(salary);
    } catch (error) {
      console.error("Error fetching employee/payroll data:", error);
      setEmployeeDetails({ name: "Error", position: "", annualSalary: 0 });
      setAnnualSalary(0);
    }
  }, [employeeId, token]);

  
  // 2. Fetch Attendance and Calculate Total Hours
const fetchAttendanceAndCalculateHours = useCallback(async () => {
  if (!employeeId || !startDate || !endDate || !token) {
    setTotalHours(0);
    return;
  }

  try {
    const response = await axios.get(`${url}/attendance/${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const attendanceRecords = Array.isArray(response.data?.records)
      ? response.data.records
      : response.data?.attendance || response.data?.data || [];

    const total = attendanceRecords.reduce((sum, record) => {
      if (!record.checkIn || !record.checkOut || !record.date) return sum;

      // Convert to dayjs
      const recordDate = dayjs(record.date);
      if (!recordDate.isBetween(startDate, endDate, "day", "[]")) {
        return sum; // skip if outside range
      }

      let checkIn = dayjs(record.checkIn);
      let checkOut = dayjs(record.checkOut);

      // fallback if stored as "HH:mm"
      if (!checkIn.isValid() || !checkOut.isValid()) {
        const [inH, inM] = record.checkIn.split(":").map(Number);
        const [outH, outM] = record.checkOut.split(":").map(Number);
        checkIn = dayjs(record.date).hour(inH).minute(inM || 0).second(0);
        checkOut = dayjs(record.date).hour(outH).minute(outM || 0).second(0);
      }

      const diffInHours = checkOut.diff(checkIn, "hour", true);
      return diffInHours > 0 ? sum + diffInHours : sum;
    }, 0);

    setTotalHours(parseFloat(total.toFixed(2)));
  } catch (error) {
    console.error("Error fetching attendance:", error);
    setTotalHours(0);
  }
}, [employeeId, startDate, endDate, token]);

// Re-run whenever startDate or endDate changes
useEffect(() => {
  fetchAttendanceAndCalculateHours();
}, [fetchAttendanceAndCalculateHours, startDate, endDate]);


  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  useEffect(() => {
    fetchAttendanceAndCalculateHours();
  }, [fetchAttendanceAndCalculateHours]);

  // --- Payroll Calculations ---
  const hourlyRate = annualSalary
    ? parseFloat((annualSalary / standardWorkHoursPerYear).toFixed(2))
    : 0;

  const grossPay = parseFloat((totalHours * hourlyRate).toFixed(2));
  const tax = parseFloat((grossPay * taxRate).toFixed(2));
  const netPay = parseFloat((grossPay - tax).toFixed(2));

  // --- Handlers ---
  const handleDownload = () => {
    alert(
      `Payslip for ${employeeDetails.name} (${startDate.format(
        "MMM D, YYYY"
      )} - ${endDate.format("MMM D, YYYY")}) download initiated!`
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Payslip
        </Typography>

        <Paper sx={{ p: 4, mb: 4 }}>
          {/* Date Filter */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="h6" sx={{ color: "primary.main", mt: 1 }}>
                Total Hours Worked: {totalHours}
              </Typography>
            </Grid>
          </Grid>

          {/* Payslip Header Info */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Annual Salary</Typography>
              <Typography variant="body1" color="text.secondary">
                ${annualSalary.toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Hourly Rate</Typography>
              <Typography variant="body1" color="text.secondary">
                ${hourlyRate}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h5" gutterBottom>
          Earnings & Deductions
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Hours</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Rate</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Full - Time</TableCell>
                <TableCell>{totalHours}</TableCell>
                <TableCell>${hourlyRate.toFixed(2)}</TableCell>
                <TableCell>${grossPay}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={3}
                  sx={{ fontWeight: "bold", textAlign: "right", bgcolor: "#f9f9f9" }}
                >
                  Gross Pay:
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f9f9f9" }}>
                  ${grossPay}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} sx={{ fontWeight: "bold", textAlign: "right" }}>
                  Tax :
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "error.main" }}>
                  -${tax}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={3}
                  sx={{ fontWeight: "bold", textAlign: "right", bgcolor: "#e8f5e9" }}
                >
                  Net Pay:
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#e8f5e9" }}>
                  ${netPay}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={handleDownload}
            disabled={totalHours === 0}
          >
            Download Payslip
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default MyPayrollPage;
