import React, { useState, useEffect } from "react";
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
  TextField,
  Pagination,
} from "@mui/material";
import {
  Login as CheckInIcon,
  Logout as CheckOutIcon,
} from "@mui/icons-material";
import axios from "axios";
import dayjs from "dayjs";
import { url } from "../../constant";

const EmployeeAttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [page, setPage] = useState(1);
  const recordsPerPage = 10;

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const employeeId = user?.id;

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "success";
      case "Absent":
        return "error";
      default:
        return "default";
    }
  };

  const fetchAttendance = async () => {
    if (!employeeId || !token) return;

    try {
      const res = await axios.get(`${url}/attendance/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sorted =
        res.data.records?.sort((a, b) => new Date(b.date) - new Date(a.date)) ||
        [];
      console.log("sorted: ", sorted);

      setAttendanceRecords(sorted);
      // Check the most recent record to determine current status
      const mostRecentRecord = sorted[0];
      const isCurrentlyCheckedIn =
        mostRecentRecord &&
        mostRecentRecord.status === "Present" &&
        !mostRecentRecord.checkOut;
      setIsCheckedIn(isCurrentlyCheckedIn);
    } catch (error) {
      console.error(
        "Failed to fetch attendance:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // --- MODIFIED HANDLER: Added alert for success/failure ---
  const handleCheckIn = async () => {
    if (isCheckedIn) {
      alert("You are already checked in!");
      return;
    }
    try {
      const res = await axios.post(
        `${url}/attendance/checkin`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newRecord = res.data.record || res.data.result;
      if (newRecord) {
        setAttendanceRecords([newRecord, ...attendanceRecords]);
        setIsCheckedIn(true);

        alert(`Check-in successful!!!`);
      }
    } catch (error) {
      console.error("Check-in failed:", error.response?.data || error.message);
      // FAILURE ALERT
      alert(
        `Check-in failed: ${error.response?.data?.message || "Server Error"}`
      );
    }
  };

  // --- MODIFIED HANDLER: Added alert for success/failure ---
  const handleCheckOut = async () => {
    if (!isCheckedIn) {
      alert("You need to check in before checking out!");
      return;
    }
    try {
      const res = await axios.post(
        `${url}/attendance/checkout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedRecord = res.data.record || res.data.result;
      if (updatedRecord) {
        const updatedRecords = attendanceRecords.map((record) =>
          // The API should return the ID of the record that was updated. Assuming it's `id`.
          record._id === updatedRecord._id || record.id === updatedRecord.id
            ? updatedRecord
            : record
        );
        setAttendanceRecords(updatedRecords);
        setIsCheckedIn(false);
        // SUCCESS ALERT
        alert(`Check-out successful!!!`);
      }
    } catch (error) {
      console.error("Check-out failed:", error.response?.data || error.message);
      // FAILURE ALERT
      alert(
        `Check-out failed: ${error.response?.data?.message || "Server Error"}`
      );
    }
  };
  // ----------------------------------------------------------------------------------

  const handleSearchChange = (event) => {
    setSearchDate(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const filteredRecords = attendanceRecords.filter((record) =>
    searchDate ? dayjs(record.date).format("YYYY-MM-DD") === searchDate : true
  );

  const paginatedRecords = filteredRecords.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
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
        <Typography
          variant="body1"
          align="center"
          sx={{
            mt: 2,
            color: isCheckedIn ? "success.main" : "error.main",
            fontWeight: "bold",
          }}
        >
          Current Status: {isCheckedIn ? "Checked In" : "Checked Out"}
        </Typography>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Attendance History
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          label="Search by Date"
          type="date"
          InputLabelProps={{ shrink: true }}
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
            {paginatedRecords.map((record) => {
              const formattedDate = dayjs(record.date).format("DD/MM/YYYY");
              // Check if checkIn/checkOut are full timestamps or just time strings
              const formattedCheckIn = record.checkIn
                ? dayjs(record.checkIn).format(
                    record.checkIn.includes(":") ? "HH:mm:ss" : "HH:mm:ss"
                  )
                : "-";
              const formattedCheckOut = record.checkOut
                ? dayjs(record.checkOut).format(
                    record.checkOut.includes(":") ? "HH:mm:ss" : "HH:mm:ss"
                  )
                : "-";
              const status =
                record.status ||
                (record.checkIn && !record.checkOut
                  ? "Present"
                  : record.checkOut
                  ? "Complete"
                  : "Absent");

              return (
                <TableRow key={record.id || record._id}>
                  <TableCell>{formattedDate}</TableCell>
                  <TableCell>{record.checkIn}</TableCell>
                  <TableCell>{record.checkOut}</TableCell>
                  <TableCell>
                    <Chip label={status} color={getStatusColor(status)} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={Math.ceil(filteredRecords.length / recordsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default EmployeeAttendancePage;
