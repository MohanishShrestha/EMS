import React from "react";
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
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";

const employeeMockData = {
  name: "John Doe",
  position: "Software Engineer",
  department: "Engineering",
  annualSalary: 80000,
  hourlyRate: 38.46, // Approx 80000 / 2080 hours
  payPeriod: "October 16, 2023 - October 30, 2023",
  paySlipDetails: [
    { description: "Full-Time Hours", hours: 80, rate: 38.46 },
    { description: "Overtime Hours", hours: 5, rate: 57.69 },
  ],
};

const MyPayrollPage = () => {
  const calculateGrossPay = () => {
    let totalAmount = 0;
    employeeMockData.paySlipDetails.forEach((detail) => {
      totalAmount += detail.hours * detail.rate;
    });
    return totalAmount.toFixed(2);
  };

  const calculateTax = (grossPay) => {
    return (grossPay * 0.01).toFixed(2); // 1% tax
  };

  const calculateNetPay = (grossPay, tax) => {
    return (grossPay - tax).toFixed(2);
  };

  const grossPay = calculateGrossPay();
  const tax = calculateTax(grossPay);
  const netPay = calculateNetPay(grossPay, tax);

  const handleDownload = () => {
    // Placeholder function for download logic
    alert("Payslip download initiated!");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Payslip
      </Typography>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Organization Name</Typography>
            <Typography variant="body1" color="text.secondary">
              Global Solutions Inc.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Pay Slip for</Typography>
            <Typography variant="body1" color="text.secondary">
              {employeeMockData.name} ({employeeMockData.position})
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Annual Salary</Typography>
            <Typography variant="body1" color="text.secondary">
              ${employeeMockData.annualSalary}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Hourly Rate</Typography>
            <Typography variant="body1" color="text.secondary">
              ${employeeMockData.hourlyRate}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Pay Period</Typography>
            <Typography variant="body1" color="text.secondary">
              {employeeMockData.payPeriod}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Earnings
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
            {employeeMockData.paySlipDetails.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.hours}</TableCell>
                <TableCell>${item.rate.toFixed(2)}</TableCell>
                <TableCell>${(item.hours * item.rate).toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell
                colSpan={3}
                sx={{ fontWeight: "bold", textAlign: "right" }}
              >
                Gross Pay:
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>${grossPay}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={3}
                sx={{ fontWeight: "bold", textAlign: "right" }}
              >
                Tax (1%):
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>-${tax}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={3}
                sx={{ fontWeight: "bold", textAlign: "right" }}
              >
                Net Pay:
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>${netPay}</TableCell>
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
        >
          Download Payslip
        </Button>
      </Box>
    </Box>
  );
};

export default MyPayrollPage;
