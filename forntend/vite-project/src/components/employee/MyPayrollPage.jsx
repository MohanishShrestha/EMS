import React, { useEffect, useState, useCallback, useRef } from "react";
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
import isBetween from "dayjs/plugin/isBetween";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { url } from "../../constant";

dayjs.extend(isBetween);

const MyPayrollPage = () => {
  const payslipRef = useRef(null);

  let employeeId = null;
  let token = null;
  let name = null
  try {
    const storeduser = localStorage.getItem("user");
    const user = storeduser ? JSON.parse(storeduser) : null;
    name = user?.name
    employeeId = user?._id || user?.id || null;
    token = localStorage.getItem("token");
  } catch (e) {
    console.error("Error reading user from localStorage:", e);
  }

  const [employeeDetails, setEmployeeDetails] = useState({
    name: "Loading...",
    position: "",
    annualSalary: 0,
  });
  const [annualSalary, setAnnualSalary] = useState(0);
  const [startDate, setStartDate] = useState(dayjs().subtract(15, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [totalHours, setTotalHours] = useState(0);

  const taxRate = 0.01;
  const standardWorkHoursPerYear = 2080; 

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
      const salary = Number(latestPayroll?.annual_salary) || 0;

      setEmployeeDetails({
        name: employeeResponse.data?.name || "N/A",
        position: employeeResponse.data?.position || "N/A",
        annualSalary: salary,
      });
      setAnnualSalary(salary);
    } catch (err) {
      console.error("Error fetching employee/payroll:", err);
      setEmployeeDetails({ name: "Error", position: "", annualSalary: 0 });
      setAnnualSalary(0);
    }
  }, [employeeId, token]);

  const fetchAttendanceAndCalculateHours = useCallback(async () => {
    if (!employeeId || !token || !startDate || !endDate) {
      setTotalHours(0);
      return;
    }

    try {
      const res = await axios.get(`${url}/attendance/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const attendanceRecords = Array.isArray(res.data?.records)
        ? res.data.records
        : res.data?.attendance || res.data?.data || [];

      const start = dayjs(startDate).startOf("day");
      const end = dayjs(endDate).endOf("day");

      const total = attendanceRecords.reduce((sum, record) => {
        if (!record.date || !record.checkIn || !record.checkOut) return sum;

        const recordDate = dayjs(record.date);
        if (!recordDate.isBetween(start, end, null, "[]")) return sum;

        let checkIn = dayjs(record.checkIn);
        let checkOut = dayjs(record.checkOut);

        if (!checkIn.isValid() || !checkOut.isValid()) {
          const [inH = 0, inM = 0] = (record.checkIn || "")
            .split(":")
            .map(Number);
          const [outH = 0, outM = 0] = (record.checkOut || "")
            .split(":")
            .map(Number);
          checkIn = dayjs(record.date)
            .hour(inH)
            .minute(inM || 0)
            .second(0);
          checkOut = dayjs(record.date)
            .hour(outH)
            .minute(outM || 0)
            .second(0);
        }

        const diffHours = checkOut.diff(checkIn, "hour", true);
        return diffHours > 0 ? sum + diffHours : sum;
      }, 0);

      setTotalHours(parseFloat(total.toFixed(2)));
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setTotalHours(0);
    }
  }, [employeeId, token, startDate, endDate]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  useEffect(() => {
    fetchAttendanceAndCalculateHours();
  }, [fetchAttendanceAndCalculateHours]);

  const hourlyRate = annualSalary
    ? parseFloat((annualSalary / standardWorkHoursPerYear).toFixed(2))
    : 0;
  const grossPay = parseFloat((totalHours * hourlyRate).toFixed(2));
  const tax = parseFloat((grossPay * taxRate).toFixed(2));
  const netPay = parseFloat((grossPay - tax).toFixed(2));


  const handleDownload = async () => {
    if (!payslipRef.current) return;

    try {
      const canvas = await html2canvas(payslipRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const pxPerMm = canvas.width / (pageWidth * (96 / 25.4));
      const imgProps = { width: canvas.width, height: canvas.height };
      const pdfWidth = pageWidth;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const fileName = `Payslip_${
        employeeDetails.name || "employee"
      }_${dayjs().format("YYYYMMDD")}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF. See console for details.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 4 }} ref={payslipRef}>
        <Typography variant="h4" gutterBottom>
          Payslip of {name}
        </Typography>

        <Box>
          <Paper sx={{ p: 4, mb: 4 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(v) => setStartDate(v || dayjs())}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(v) => setEndDate(v || dayjs())}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Typography variant="h6" sx={{ color: "primary.main", mt: 1 }}>
                  Total Hours Worked: {totalHours}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Annual Salary</Typography>
                <Typography variant="body1" color="text.secondary">
                  ${Number(annualSalary).toLocaleString()}
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
                    sx={{
                      fontWeight: "bold",
                      textAlign: "right",
                      bgcolor: "#f9f9f9",
                    }}
                  >
                    Gross Pay:
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#f9f9f9" }}>
                    ${grossPay}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={3}
                    sx={{ fontWeight: "bold", textAlign: "right" }}
                  >
                    Tax :
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "error.main" }}>
                    ${tax}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={3}
                    sx={{
                      fontWeight: "bold",
                      textAlign: "right",
                      bgcolor: "#e8f5e9",
                    }}
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
        </Box>

        {/* Download Button */}
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
