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
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const mockRoster = [
  {
    id: 1,
    employeeName: "John Doe",
    shiftTime: "08:00 AM - 04:00 PM",
    department: "Engineering",
    position: "Software Engineer",
    totalHours: 8,
    date: "2023-10-27",
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    shiftTime: "09:00 AM - 05:00 PM",
    department: "Product",
    position: "Product Manager",
    totalHours: 8,
    date: "2023-10-27",
  },
  {
    id: 3,
    employeeName: "Michael Johnson",
    shiftTime: "09:00 AM - 05:00 PM",
    department: "Design",
    position: "UX Designer",
    totalHours: 8,
    date: "2023-10-27",
  },
  {
    id: 4,
    employeeName: "Emily Davis",
    shiftTime: "08:30 AM - 04:30 PM",
    department: "Analytics",
    position: "Data Analyst",
    totalHours: 8,
    date: "2023-10-27",
  },
  {
    id: 5,
    employeeName: "David Wilson",
    shiftTime: "10:00 AM - 06:00 PM",
    department: "Marketing",
    position: "Marketing Specialist",
    totalHours: 8,
    date: "2023-10-27",
  },
  {
    id: 6,
    employeeName: "Sarah Brown",
    shiftTime: "09:00 AM - 05:00 PM",
    department: "HR",
    position: "Human Resources",
    totalHours: 8,
    date: "2023-10-27",
  },
  {
    id: 7,
    employeeName: "Chris Evans",
    shiftTime: "07:00 AM - 03:00 PM",
    department: "IT",
    position: "System Administrator",
    totalHours: 8,
    date: "2023-10-27",
  },
  {
    id: 8,
    employeeName: "Olivia White",
    shiftTime: "09:00 AM - 05:00 PM",
    department: "Finance",
    position: "Financial Analyst",
    totalHours: 8,
    date: "2023-10-27",
  },
  {
    id: 9,
    employeeName: "Daniel Lee",
    shiftTime: "08:00 AM - 04:00 PM",
    department: "Operations",
    position: "Operations Manager",
    totalHours: 8,
    date: "2023-10-27",
  },
  {
    id: 10,
    employeeName: "Sophia Martinez",
    shiftTime: "11:00 AM - 07:00 PM",
    department: "Marketing",
    position: "Content Writer",
    totalHours: 8,
    date: "2023-10-27",
  },
  {
    id: 11,
    employeeName: "William Taylor",
    shiftTime: "08:00 AM - 04:00 PM",
    department: "Engineering",
    position: "Software Engineer",
    totalHours: 8,
    date: "2023-10-27",
  },
  // Past records for specific employee
  {
    id: 12,
    employeeName: "John Doe",
    shiftTime: "08:00 AM - 04:00 PM",
    department: "Engineering",
    position: "Software Engineer",
    totalHours: 8,
    date: "2023-10-26",
  },
  {
    id: 13,
    employeeName: "John Doe",
    shiftTime: "08:00 AM - 04:00 PM",
    department: "Engineering",
    position: "Software Engineer",
    totalHours: 8,
    date: "2023-10-25",
  },
];

const RosterPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const recordsPerPage = 10;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to the first page on search
  };

  const handleRowClick = (employeeName) => {
    setSelectedEmployee(employeeName);
  };

  if (selectedEmployee) {
    const employeeRosters = mockRoster
      .filter((record) => record.employeeName === selectedEmployee)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const paginatedEmployeeRosters = employeeRosters.slice(
      (page - 1) * recordsPerPage,
      page * recordsPerPage
    );

    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Roster for {selectedEmployee}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setSelectedEmployee(null)}
          sx={{ mb: 4 }}
        >
          Back to Full Roster
        </Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Shift Time</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Total Hours</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEmployeeRosters.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.shiftTime}</TableCell>
                  <TableCell>{record.totalHours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(employeeRosters.length / recordsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
    );
  }

  const filteredRecords = mockRoster.filter((record) =>
    Object.values(record).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedRecords = filteredRecords.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Roster
      </Typography>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end" }}>
        <TextField
          label="Search Roster"
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
              <TableCell sx={{ fontWeight: "bold" }}>Shift Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRecords.map((record) => (
              <TableRow
                key={record.id}
                sx={{ cursor: "pointer" }}
                onClick={() => handleRowClick(record.employeeName)}
              >
                <TableCell>{record.employeeName}</TableCell>
                <TableCell>{record.shiftTime}</TableCell>
                <TableCell>{record.department}</TableCell>
                <TableCell>{record.position}</TableCell>
                <TableCell>{record.totalHours}</TableCell>
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

export default RosterPage;
