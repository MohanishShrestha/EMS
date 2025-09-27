import React, { useEffect, useState } from "react";
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
import { ClassSharp, Search as SearchIcon } from "@mui/icons-material";
import axios from "axios";
import { url } from "../constant";

const RosterPage = () => {
  const [employees, setEmployees] = useState([]);
  const [rosterData, setRosterData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const recordsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeRes, rosterRes] = await Promise.all([
          axios.get(`${url}/employee`),
          axios.get(`${url}/roster`),
        ]);

        setEmployees(employeeRes.data.result);
        setRosterData(rosterRes.data.result);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleRowClick = (employeeName) => {
    setSelectedEmployee(employeeName);
    setPage(1);
  };

  const convertTo24Hour = (time12h) => {
  if (!time12h || typeof time12h !== "string") return "00:00";

  const parts = time12h.trim().split(" ");
  if (parts.length !== 2) return "00:00"; // fallback if AM/PM is missing

  const [time, rawModifier] = parts;
  const modifier = rawModifier.toUpperCase();

  let [hours, minutes] = time.split(":");
  if (!hours || !minutes) return "00:00";

  hours = parseInt(hours, 10);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
};


  // ✅ Merge employee and roster data
  const mergedRoster = rosterData
    .map((roster) => {
      const employee = employees.find(
        (emp) => emp.id === roster.employee_id && emp.role !== "admin"
      );

      if (!employee) return null; // Skip if no matching employee or is admin

      const shiftStartStr = convertTo24Hour(roster.start_time);
      const shiftEndStr = convertTo24Hour(roster.end_time);

      const shiftStart = new Date(`1970-01-01T${shiftStartStr}:00`);
      const shiftEnd = new Date(`1970-01-01T${shiftEndStr}:00`);

      const totalHours = (shiftEnd - shiftStart) / (1000 * 60 * 60);

      return {
        id: roster.id,
        name: employee.name,
        department: employee.department || "N/A",
        position: employee.position || "N/A",
        shiftTime: `${roster.start_time} - ${roster.end_time}`,
        totalHours: totalHours.toFixed(2),
        date: roster.shift_date,
      };
    })
    .filter(Boolean); // ✅ Remove nulls

  const filteredRecords = mergedRoster.filter((record) =>
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

  const employeeRosters = mergedRoster
    .filter((record) => record.name === selectedEmployee)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const paginatedEmployeeRosters = employeeRosters.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );

  return (
    <Box sx={{ p: 4 }}>
      {selectedEmployee ? (
        <>
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Shift Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Total Hours</strong>
                  </TableCell>
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
        </>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Employee Roster
          </Typography>
          <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end" }}>
            <TextField
              label="Search Employee Roster"
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Department</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Position</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Shift Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Total Hours</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRecords.map((record) => (
                  <TableRow
                    key={record.id}
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(record.name)}
                  >
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.position}</TableCell>
                    <TableCell>{record.shiftTime}</TableCell>
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
        </>
      )}
    </Box>
  );
};

export default RosterPage;
