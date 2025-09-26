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
  Button,
  Chip,
  Grid,
  TextField
} from "@mui/material";
import {
  Login as CheckInIcon,
  Logout as CheckOutIcon,
  Search as SearchIcon
} from "@mui/icons-material";

const EmployeeAttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [searchDate, setSearchDate] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "Checked In":
        return "success";
      case "Checked Out":
        return "error";
      default:
        return "default";
    }
  };

  const handleCheckIn = () => {
    const newRecord = {
      id: attendanceRecords.length + 1,
      date: new Date().toLocaleDateString(),
      checkInTime: new Date().toLocaleTimeString(),
      checkOutTime: "N/A",
      status: "Checked In",
    };
    setAttendanceRecords([newRecord, ...attendanceRecords]);
    setIsCheckedIn(true);
  };

  const handleCheckOut = () => {
    const updatedRecords = attendanceRecords.map((record, index) => {
      if (index === 0) { // Update the latest record
        return {
          ...record,
          checkOutTime: new Date().toLocaleTimeString(),
          status: "Checked Out",
        };
      }
      return record;
    });
    setAttendanceRecords(updatedRecords);
    setIsCheckedIn(false);
  };

  const handleSearchChange = (event) => {
    setSearchDate(event.target.value);
  };

  const filteredRecords = attendanceRecords.filter((record) =>
    searchDate ? record.date === new Date(searchDate).toLocaleDateString() : true
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Attendance
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckInIcon />}
              onClick={handleCheckIn}
              disabled={isCheckedIn}
            >
              Check In
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<CheckOutIcon />}
              onClick={handleCheckOut}
              disabled={!isCheckedIn}
            >
              Check Out
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Attendance History
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          label="Search by Date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleSearchChange}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Check-In Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Check-Out Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.checkInTime}</TableCell>
                <TableCell>{record.checkOutTime}</TableCell>
                <TableCell>
                  <Chip
                    label={record.status}
                    color={getStatusColor(record.status)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EmployeeAttendancePage;
