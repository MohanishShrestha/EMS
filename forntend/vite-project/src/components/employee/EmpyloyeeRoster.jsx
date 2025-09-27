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
    employeeName: "John Doe",
    shiftTime: "08:00 AM - 04:00 PM",
    department: "Engineering",
    position: "Software Engineer",
    totalHours: 8,
    date: "2023-10-28",
  },
  {
    id: 3,
    employeeName: "John Doe",
    shiftTime: "08:00 AM - 04:00 PM",
    department: "Engineering",
    position: "Software Engineer",
    totalHours: 8,
    date: "2023-10-29",
  },
  {
    id: 4,
    employeeName: "John Doe",
    shiftTime: "08:00 AM - 04:00 PM",
    department: "Engineering",
    position: "Software Engineer",
    totalHours: 8,
    date: "2023-10-30",
  },
  {
    id: 5,
    employeeName: "John Doe",
    shiftTime: "08:00 AM - 04:00 PM",
    department: "Engineering",
    position: "Software Engineer",
    totalHours: 8,
    date: "2023-11-1",
  },
  {
    id: 6,
    employeeName: "John Doe",
    shiftTime: "08:00 AM - 04:00 PM",
    department: "Engineering",
    position: "Software Engineer",
    totalHours: 8,
    date: "2023-11-2",
  },
  {
    id: 7,
    employeeName: "John Doe",
    shiftTime: "08:00 AM - 04:00 PM",
    department: "Engineering",
    position: "Software Engineer",
    totalHours: 8,
    date: "2023-11-3",
  },
  {
    id: 8,
    employeeName: "John Doe",
    shiftTime: "08:00 AM - 04:00 PM",
    department: "Engineering",
    position: "Software Engineer",
    totalHours: 8,
    date: "2023-11-4",
  },
  {
    id: 9,
    employeeName: "John Doe",
    shiftTime: "08:00 AM - 04:00 PM",
    department: "Engineering",
    position: "Software Engineer",
    totalHours: 8,
    date: "2023-11-5",
  },
  {
    id: 10,
    employeeName: "John Doe",
    shiftTime: "08:00 AM - 04:00 PM",
    department: "Engineering",
    position: "Software Engineer",
    totalHours: 8,
    date: "2023-11-6",
  },
];

const RosterPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const recordsPerPage = 10;
  const [employees, setEmployees] = useState([]);
  const [rosterData, setRosterData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const [employeeRes, rosterRes] = await Promise.all([
            axios.get(`${url}/employee`),
            axios.get(`${url}/roster`),
          ]);
  
          setEmployees(employeeRes.data.result);
          console.log(employeeRes.data.result);
          console.log(rosterRes.data.result);
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
    setPage(1); // Reset to the first page on search
  };

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
        Roster
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
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Shift Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.date}</TableCell>
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
