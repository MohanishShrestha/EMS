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
  TextField,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import axios from "axios";
import { url } from "../constant";

const Payroll = () => {
  // State for all employees and the currently selected data
  const [employees, setEmployees] = useState([]); // Stores {id, name} of all employees
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [annualSalary, setAnnualSalary] = useState(0);

  // State for date range and calculations
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day')); // Default to last 7 days
  const [endDate, setEndDate] = useState(dayjs());
  const [totalHours, setTotalHours] = useState(0);

  const token = localStorage.getItem("token");
  const taxRate = 0.01;

  // 1. Fetch ALL Employees (for the dropdown list)
  const fetchEmployees = useCallback(async () => {
    try {
      // Assuming you have an endpoint to get a list of all employees
      const response = await axios.get(`${url}/employee`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assuming response.data is an array of employee objects {id, name, ...}
      setEmployees(response.data.result);
     
      
      // OPTIONAL: Auto-select the first employee if the list isn't empty
      if (response.data.length > 0) {
        setSelectedEmployeeId(response.data[0].id);
        setEmployeeName(response.data[0].name);
      }
    } catch (error) {
      console.error(
        "Error fetching employees:",
        error.response?.data || error.message
      );
    }
  }, [token]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // 2. Fetch Payroll Data (Annual Salary) when Employee is selected
  useEffect(() => {
    if (!selectedEmployeeId) {
      setAnnualSalary(0);
      return;
    }

    const fetchPayroll = async () => {
      try {
        // Search payroll by employee ID
        const response = await axios.get(`${url}/payroll`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { employee_id: selectedEmployeeId },
        });

        
        
        // Assuming the API returns a payroll object or an array where [0] is the correct one
        // const payrollData = response.data.payrolls[0]; 
        const matchingPayroll = response.data.payrolls.find(p => {
             // Handle case where employee_id is an object or a string
             const id = p.employee_id?.id || p.employee_id;
             return id === selectedEmployeeId;
        });
        
        if (matchingPayroll) {
          // The crucial change: Extract annual_salary
          setAnnualSalary(matchingPayroll.annual_salary || 0);
        } else {
          setAnnualSalary(0);
        }
      } catch (error) {
        console.error("Error fetching payroll:", error);
        setAnnualSalary(0);
      }
    };
    fetchPayroll();
  }, [selectedEmployeeId, token]);

  // 3. Fetch Attendance and Calculate Hours
  useEffect(() => {
    if (!selectedEmployeeId || !startDate || !endDate) {
        setTotalHours(0);
        return;
    }

    axios
        .get(`${url}/attendance`, {
            headers: { Authorization: `Bearer ${token}` },
            // Keep params, but assume backend might ignore them
            params: {
                employee: selectedEmployeeId,
                start: startDate.toISOString(),
                end: endDate.toISOString(),
            },
        })
        .then((res) => {
            // Assume the attendance data is an array directly on res.data, 
            // OR nested under a key like 'attendance'. We'll check for both.
            const allAttendanceRecords = Array.isArray(res.data.result) 
                ? res.data 
                : res.data.attendance || [];

                // console.log("ww",allAttendanceRecords)
                const all = allAttendanceRecords.result
            // --- MANUAL CLIENT-SIDE FILTERING & CALCULATION ---
            const total = all
                .filter(record => {
                    // 1. Filter by Employee ID: Ensure the record belongs to the selected employee.
                    // This is the core fix for the lack of API filtering.
                    const recordEmployeeId = record.employee;
                    if (recordEmployeeId !== selectedEmployeeId) {
                        return false;
                    }

                    // 2. Filter by Date Range: Ensure the record falls within the selected range.
                    // This is necessary if the API also ignores the 'start' and 'end' params.
                    const recordDate = dayjs(record.date);
                    return recordDate.isAfter(startDate.startOf('day')) && 
                           recordDate.isBefore(endDate.endOf('day'));

                })
                .reduce((sum, record) => {
                    // Removed: console.log("time:",res) - This was inefficiently logging the entire response 
                    // 14 times inside the reducer loop.

                    if (!record.checkIn || !record.checkOut) return sum;
                 

                    // Convert string times to numbers
                    const [inH, inM] = record.checkIn.split(":").map(Number);
                    const [outH, outM] = record.checkOut.split(":").map(Number);

                    // Use the date of the record to create full timestamps
                    const checkIn = dayjs(record.date).hour(inH).minute(inM || 0).second(0);
                    const checkOut = dayjs(record.date).hour(outH).minute(outM || 0).second(0);

                    // Calculate difference in hours
                    const diffInHours = checkOut.diff(checkIn, 'hour', true);

                    // Skip records where checkout is before checkin (e.g., overnight shifts can complicate simple diff)
                    if (diffInHours < 0) return sum; 
                    
                    return sum + diffInHours;
                }, 0);

            setTotalHours(parseFloat(total.toFixed(2)));
        })
        .catch(error => {
            console.error("Error fetching attendance:", error);
            setTotalHours(0);
        });
}, [selectedEmployeeId, startDate, endDate, token]);

  // Handler for employee selection change
  const handleEmployeeChange = (event) => {
    const newId = event.target.value;
    const employee = employees.find((e) => e.id === newId);
    
    setSelectedEmployeeId(newId);
    setEmployeeName(employee ? employee.name : '');
  };

  // Payroll calculations
  const hourlyRate = annualSalary
    ? parseFloat((annualSalary / 2080).toFixed(2))
    : 0;
  const grossPay = parseFloat((totalHours * hourlyRate).toFixed(2));
  const tax = parseFloat((grossPay * taxRate).toFixed(2));
  const netPay = parseFloat((grossPay - tax).toFixed(2));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            {/* Employee Name Selection */}
            <TextField
              select
              label="Select Employee"
              value={selectedEmployeeId || ""}
              onChange={handleEmployeeChange}
              sx={{ minWidth: 200 }}
            >
              {employees.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.name} {/* Display employee name */}
                </MenuItem>
              ))}
            </TextField>
            
            <Typography>
              <strong>Employee Name:</strong> {employeeName}
            </Typography>

            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              slotProps={{ textField: { fullWidth: true } }}
            />

            <Typography>
              <strong>Annual Salary:</strong> ${annualSalary.toLocaleString()}
            </Typography>
            <Typography>
              <strong>Hourly Rate:</strong> ${hourlyRate}
            </Typography>
            <Typography>
              <strong>Total Hours:</strong> {totalHours}
            </Typography>
            <Typography>
              <strong>Gross Pay:</strong> ${grossPay}
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
                  <TableCell sx={{ fontWeight: "bold" }}>Rate</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tax </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{employeeName}</TableCell>
                  <TableCell>{totalHours}</TableCell>
                  <TableCell>${hourlyRate}</TableCell>
                  <TableCell>${grossPay}</TableCell>
                  <TableCell>${tax}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default Payroll;