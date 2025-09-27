import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../constant";
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
  Pagination,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const AttendancePage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeForAttendance, setSelectedEmployeeForAttendance] =
    useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const recordsPerPage = 10;

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [editingRecord, setEditingRecord] = useState(null);
  const [editFormData, setEditFormData] = useState({
    checkIn: "",
    checkOut: "",
    date: "",
    status: "",
  });

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDeleteAttendance = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this attendance record?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${url}/attendance/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedRecords = attendanceRecords.filter(
        (record) => record.id !== id
      );
      setAttendanceRecords(updatedRecords);
      setSelectedEmployeeForAttendance(null);
      setSuccessOpen(true);
    } catch (error) {
      console.error(
        "Error deleting attendance record:",
        error.response?.data || error.message
      );
      setErrorOpen(true);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setEditFormData({
      checkIn: record.checkIn || "",
      checkOut: record.checkOut || "",
      date: record.date?.split("T")[0] || "",
      status: record.status || "",
    });
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${url}/attendance/${editingRecord.id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedRecords = attendanceRecords.map((record) =>
        record.id === editingRecord.id ? { ...record, ...editFormData } : record
      );
      setAttendanceRecords(updatedRecords);
      setEditingRecord(null);
      setSuccessOpen(true);
    } catch (error) {
      console.error(
        "Error updating attendance:",
        error.response?.data || error.message
      );
      setErrorOpen(true);
    }
  };

  const handleViewAttendance = (employeeName) => {
    setSelectedEmployeeForAttendance(employeeName);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "success";
      case "Absent":
        return "error";
      case "On Leave":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-GB"); // dd/mm/yyyy
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [attendanceRes, employeeRes] = await Promise.all([
          axios.get(`${url}/attendance`),
          axios.get(`${url}/employee`),
        ]);

        const attendanceRaw = attendanceRes.data.result;
        const employeeList = employeeRes.data.result;

        const mergedAttendance = attendanceRaw.map((record) => {
          const employeeId = record.user || record.employee;
          const employee = employeeList.find((emp) => emp.id === employeeId);

          return {
            ...record,
            employeeName: employee?.name || "Unknown",
            status: record.checkIn ? "Present" : record.status || "Absent",
          };
        });

        setAttendanceRecords(mergedAttendance);
        setEmployees(employeeList);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
        setErrorOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Employee specific records (moved outside for global access)
  const employeeRecords = selectedEmployeeForAttendance
    ? attendanceRecords.filter(
        (record) => record.employeeName === selectedEmployeeForAttendance
      )
    : [];

  if (selectedEmployeeForAttendance) {
    let filtered = [...employeeRecords];
    if (startDate && endDate) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date);
        return (
          recordDate >= new Date(startDate) && recordDate <= new Date(endDate)
        );
      });
    }

    const paginated = filtered.slice(
      (page - 1) * recordsPerPage,
      page * recordsPerPage
    );

    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Attendance for {selectedEmployeeForAttendance}
        </Typography>
        <Box sx={{ mb: 4, display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            variant="outlined"
            onClick={() => setSelectedEmployeeForAttendance(null)}
          >
            Back to All Records
          </Button>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Check-In</TableCell>
                <TableCell>Check-Out</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDate(record.date)}</TableCell>
                  <TableCell>{record.checkIn}</TableCell>
                  <TableCell>{record.checkOut}</TableCell>
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

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(filtered.length / recordsPerPage)}
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      </Box>
    );
  }

  // Search filter
  const filteredRecords = attendanceRecords.filter((record) => {
    const term = searchTerm.toLowerCase();
    return (
      record.employeeName?.toLowerCase().includes(term) ||
      record.date?.toString().toLowerCase().includes(term) ||
      record.status?.toLowerCase().includes(term)
    );
  });

  // Pagination
  const paginatedRecords = filteredRecords.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Attendance
      </Typography>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <TextField
          label="Search Employee Attendance"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 400 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Check-In</TableCell>
              <TableCell>Check-Out</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.employeeName}</TableCell>
                <TableCell>{record.checkIn}</TableCell>
                <TableCell>{record.checkOut}</TableCell>
                <TableCell>{formatDate(record.date)}</TableCell>
                <TableCell>
                  <Chip
                    label={record.status}
                    color={getStatusColor(record.status)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(record)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteAttendance(record.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewAttendance(record.employeeName)}
                  >
                    Attendance
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={Math.ceil(filteredRecords.length / recordsPerPage)}
          page={page}
          onChange={handlePageChange}
        />
      </Box>

      {/* Edit Dialog */}
      <Dialog open={!!editingRecord} onClose={() => setEditingRecord(null)}>
        <DialogTitle>Edit Attendance</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Check-In"
            value={editFormData.checkIn}
            onChange={(e) =>
              setEditFormData({ ...editFormData, checkIn: e.target.value })
            }
          />
          <TextField
            label="Check-Out"
            value={editFormData.checkOut}
            onChange={(e) =>
              setEditFormData({ ...editFormData, checkOut: e.target.value })
            }
          />
          <TextField
            label="Date"
            type="date"
            value={editFormData.date}
            onChange={(e) =>
              setEditFormData({ ...editFormData, date: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Status"
            value={editFormData.status}
            onChange={(e) =>
              setEditFormData({ ...editFormData, status: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingRecord(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars */}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Action completed successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={errorOpen}
        autoHideDuration={3000}
        onClose={() => setErrorOpen(false)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          Something went wrong!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AttendancePage;
