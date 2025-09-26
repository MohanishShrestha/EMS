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
  Pagination,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Toolbar,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircleOutline as CheckInIcon,
  ExitToApp as ExitToAppIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const mockAttendance = [
  {
    id: 1,
    employeeName: "John Doe",
    checkIn: "08:00 AM",
    checkOut: "05:00 PM",
    date: "2023-10-27",
    status: "Present",
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    checkIn: "08:30 AM",
    checkOut: "05:30 PM",
    date: "2023-10-27",
    status: "Present",
  },
  {
    id: 3,
    employeeName: "Michael Johnson",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    date: "2023-10-27",
    status: "Present",
  },
  {
    id: 4,
    employeeName: "Emily Davis",
    checkIn: "08:15 AM",
    checkOut: "05:15 PM",
    date: "2023-10-27",
    status: "Present",
  },
  {
    id: 5,
    employeeName: "David Wilson",
    checkIn: "08:45 AM",
    checkOut: "05:45 PM",
    date: "2023-10-27",
    status: "Present",
  },
  {
    id: 6,
    employeeName: "Sarah Brown",
    checkIn: "09:15 AM",
    checkOut: "06:15 PM",
    date: "2023-10-27",
    status: "Present",
  },
  {
    id: 7,
    employeeName: "Chris Evans",
    checkIn: "08:50 AM",
    checkOut: "05:50 PM",
    date: "2023-10-27",
    status: "Present",
  },
  {
    id: 8,
    employeeName: "Olivia White",
    checkIn: "09:30 AM",
    checkOut: "06:30 PM",
    date: "2023-10-27",
    status: "Present",
  },
  {
    id: 9,
    employeeName: "Daniel Lee",
    checkIn: "08:25 AM",
    checkOut: "05:25 PM",
    date: "2023-10-27",
    status: "Present",
  },
  {
    id: 10,
    employeeName: "Sophia Martinez",
    checkIn: "09:10 AM",
    checkOut: "06:10 PM",
    date: "2023-10-27",
    status: "Present",
  },
  {
    id: 11,
    employeeName: "William Taylor",
    checkIn: "08:20 AM",
    checkOut: "05:20 PM",
    date: "2023-10-27",
    status: "Present",
  },
  {
    id: 12,
    employeeName: "Chloe Rodriguez",
    checkIn: "08:40 AM",
    checkOut: "05:40 PM",
    date: "2023-10-27",
    status: "Absent",
  },
  {
    id: 13,
    employeeName: "Chloe Rodriguez",
    checkIn: "08:40 AM",
    checkOut: "05:40 PM",
    date: "2023-10-26",
    status: "Present",
  },
  {
    id: 14,
    employeeName: "Chloe Rodriguez",
    checkIn: "09:00 AM",
    checkOut: null,
    date: "2023-10-25",
    status: "Present",
  },
];

const AttendancePage = () => {
  const [page, setPage] = useState(1);
  const [attendanceRecords, setAttendanceRecords] = useState(mockAttendance);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeForAttendance, setSelectedEmployeeForAttendance] =
    useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const recordsPerPage = 10;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDelete = (id) => {
    setAttendanceRecords(
      attendanceRecords.filter((record) => record.id !== id)
    );
  };

  const handleEdit = (id) => {
    console.log("Edit button clicked for record:", id);
  };

  const handleViewAttendance = (employeeName) => {
    setSelectedEmployeeForAttendance(employeeName);
    setPage(1); // Reset page for the new view
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to the first page on search
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

  if (selectedEmployeeForAttendance) {
    let employeeRecords = mockAttendance.filter(
      (record) => record.employeeName === selectedEmployeeForAttendance
    );

    // Apply date range filter if both dates are selected
    if (startDate && endDate) {
      employeeRecords = employeeRecords.filter((record) => {
        const recordDate = new Date(record.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return recordDate >= start && recordDate <= end;
      });
    }

    const paginatedRecords = employeeRecords.slice(
      (page - 1) * recordsPerPage,
      page * recordsPerPage
    );

    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Attendance for {selectedEmployeeForAttendance}
        </Typography>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setSelectedEmployeeForAttendance(null)}
          >
            Back to All Records
          </Button>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Start Date"
              variant="outlined"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ width: "200px" }}
            />
            <TextField
              label="End Date"
              variant="outlined"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ width: "200px" }}
            />
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Check-In</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Check-Out</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
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
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(employeeRecords.length / recordsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
    );
  }

  // Filter records based on search term
  const filteredRecords = attendanceRecords.filter(
    (record) =>
      (record.employeeName &&
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.date &&
        record.date.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.status &&
        record.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort attendance records by check-in time in descending order
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const timeA = new Date(`2000/01/01 ${a.checkIn}`);
    const timeB = new Date(`2000/01/01 ${b.checkIn}`);
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return timeB - timeA;
  });

  const latestCheckIn = sortedRecords[0];
  const latestCheckOut = [...attendanceRecords].sort((a, b) => {
    const timeA = new Date(`2000/01/01 ${a.checkOut}`);
    const timeB = new Date(`2000/01/01 ${b.checkOut}`);
    return timeB - timeA;
  })[0];

  const paginatedRecords = sortedRecords.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Attendance
      </Typography>

      {/* <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ color: '#2ecc71', mr: 2 }}>
              <CheckInIcon sx={{ fontSize: 40 }} />
            </Box>
            <Box>
              <Typography variant="h6">Latest Check-In</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {latestCheckIn.employeeName} at {latestCheckIn.checkIn}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ color: '#e74c3c', mr: 2 }}>
              <ExitToAppIcon sx={{ fontSize: 40 }} />
            </Box>
            <Box>
              <Typography variant="h6">Latest Check-Out</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {latestCheckOut.employeeName} at {latestCheckOut.checkOut}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid> */}

      <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end" }}>
        <TextField
          label="Search Attendance"
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
          sx={{ width: "400px" }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Employee Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Check-In</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Check-Out</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.employeeName}</TableCell>
                <TableCell>{record.checkIn}</TableCell>
                <TableCell>{record.checkOut}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>
                  <Chip
                    label={record.status}
                    color={getStatusColor(record.status)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(record.id)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(record.id)}
                    sx={{ mr: 1 }}
                  >
                    Delete
                  </Button>
                  <Button
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

export default AttendancePage;
