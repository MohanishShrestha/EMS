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
import { Login as CheckInIcon, Logout as CheckOutIcon } from "@mui/icons-material";
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

      const sorted = res.data.records?.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ) || [];
      console.log("sorted: ",sorted)

      setAttendanceRecords(sorted);
      setIsCheckedIn(sorted[0]?.status === "Present");
    } catch (error) {
      console.error("Failed to fetch attendance:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    try {
      const res = await axios.post(`${url}/attendance/checkin`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(res)
      const newRecord = res.data.record || res.data.result;
      if (newRecord) {
        setAttendanceRecords([newRecord, ...attendanceRecords]);
        setIsCheckedIn(true);
      }
    } catch (error) {
      console.error("Check-in failed:", error.response?.data || error.message);
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await axios.post(`${url}/attendance/checkout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedRecord = res.data.record || res.data.result;
      if (updatedRecord) {
        const updatedRecords = attendanceRecords.map((record) =>
          record.id === updatedRecord.id ? updatedRecord : record
        );
        setAttendanceRecords(updatedRecords);
        setIsCheckedIn(false);
      }
    } catch (error) {
      console.error("Check-out failed:", error.response?.data || error.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearchDate(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const filteredRecords = attendanceRecords.filter((record) =>
    searchDate
      ? dayjs(record.date).format("YYYY-MM-DD") === searchDate
      : true
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
            >
              Check Out
            </Button>
          </Grid>
        </Grid>
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
              const formattedCheckIn = record.checkIn
                ? dayjs(record.checkIn).format("HH:mm")
                : "-";
              const formattedCheckOut = record.checkOut
                ? dayjs(record.checkOut).format("HH:mm")
                : "-";
              const status = record.status || (record.checkIn ? "Present" : "Absent");

              return (
                <TableRow key={record.id}>
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
