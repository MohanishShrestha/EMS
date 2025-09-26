import React, { useState } from "react";
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
  TextField,
  MenuItem,
} from "@mui/material";
import { AttachMoney as AttachMoneyIcon } from "@mui/icons-material";

// Mock employee data from a 'database'
const employeePayrollData = [
  {
    id: 1,
    name: "John Doe",
    position: "Software Engineer",
    annualSalary: 80000,
    hourlyRate: 38.46, // Based on a 40-hour work week
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "Product Manager",
    annualSalary: 95000,
    hourlyRate: 45.67,
  },
  {
    id: 3,
    name: "Michael Johnson",
    position: "UX Designer",
    annualSalary: 75000,
    hourlyRate: 36.05,
  },
];

const Payroll = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(
    employeePayrollData[0]
  );
  const payPeriodWeeks = 2; // Bi-weekly pay period

  // Calculations based on employee data
  const hours = 40 * payPeriodWeeks;
  const calculateRate = selectedEmployee.hourlyRate;
  const amount = (hours * calculateRate).toFixed(2);
  const taxRate = 0.01;
  const tax = (amount * taxRate).toFixed(2);
  const grossPay = parseFloat(amount);
  const netPay = (grossPay - tax).toFixed(2);

  const handleEmployeeChange = (event) => {
    const employee = employeePayrollData.find(
      (emp) => emp.name === event.target.value
    );
    setSelectedEmployee(employee);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Payroll
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Payslip
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            mb: 4,
          }}
        >
          <Typography>
            <strong>Organization:</strong> Global Solutions Inc.
          </Typography>
          <TextField
            select
            label="Payslip For"
            value={selectedEmployee.name}
            onChange={handleEmployeeChange}
            sx={{ minWidth: 200 }}
          >
            {employeePayrollData.map((emp) => (
              <MenuItem key={emp.id} value={emp.name}>
                {emp.name} ({emp.position})
              </MenuItem>
            ))}
          </TextField>
          <Typography>
            <strong>Annual Salary:</strong> ${selectedEmployee.annualSalary}
          </Typography>
          <Typography>
            <strong>Hourly Rate:</strong> ${calculateRate}
          </Typography>
          <Typography>
            <strong>Pay Period:</strong> Bi-weekly
          </Typography>
          <Typography>
            <strong>Gross Pay:</strong> ${grossPay.toFixed(2)}
          </Typography>
          <Typography>
            <strong>Net Pay:</strong> ${netPay}
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Hours</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Calculated Rate
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tax (1%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  {selectedEmployee.position} ({hours} hours/pay period)
                </TableCell>
                <TableCell>{hours}</TableCell>
                <TableCell>${calculateRate.toFixed(2)}</TableCell>
                <TableCell>${amount}</TableCell>
                <TableCell>${tax}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Payroll;
