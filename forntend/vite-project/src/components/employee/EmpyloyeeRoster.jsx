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
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import axios from "axios";
import { url } from "../../constant";
import dayjs from "dayjs";

const RosterPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const recordsPerPage = 10;
  const [rosterData, setRosterData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 👇 parse user object from localStorage
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          console.warn("No user found in localStorage");
          return;
        }

        const user = JSON.parse(storedUser); // { id, name, email, ... }
        const employeeId = user.id;

        // Fetch roster from API
        const res = await axios.get(`${url}/roster`);
        
        // Filter only this employee’s roster
        const filtered = res.data.result.filter(
          (record) => record.employee_id === employeeId
        );

        // Sort by latest date first
        const sorted = [...filtered].sort(
          (a, b) => new Date(b.shift_date) - new Date(a.shift_date)
        );

        setRosterData(sorted);
      } catch (error) {
        console.error(
          "Error fetching roster:",
          error.response?.data || error.message
        );
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  // Search filter
  const filteredRecords = rosterData.filter((record) =>
    [record.shift_date, record.start_time, record.end_time]
      .some((value) =>
        value?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Pagination
  const paginatedRecords = filteredRecords.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );

  // Format date
  const formatDate = (dateStr) => dayjs(dateStr).format("YYYY-MM-DD");


  // Calculate hours
  const calculateHours = (start, end, dateStr) => {
    const formattedDate = dayjs(dateStr).format("YYYY-MM-DD");

    let startDateTime = dayjs(`${formattedDate} ${start}`, "YYYY-MM-DD HH:mm");
    let endDateTime = dayjs(`${formattedDate} ${end}`, "YYYY-MM-DD HH:mm");

    if (!startDateTime.isValid() || !endDateTime.isValid()) {
      startDateTime = dayjs(`${formattedDate} ${start}`, "YYYY-MM-DD hh:mm A");
      endDateTime = dayjs(`${formattedDate} ${end}`, "YYYY-MM-DD hh:mm A");
    }

    if (endDateTime.isBefore(startDateTime)) {
      endDateTime = endDateTime.add(1, "day");
    }

    const diff = endDateTime.diff(startDateTime, "minute") / 60;
    return isNaN(diff) ? "-" : `${diff.toFixed(1)} hrs`;
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Roster
      </Typography>

      {/* Search Box */}
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

      {/* Table */}
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
            {paginatedRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              paginatedRecords.map((record) => (
                <TableRow key={record._id || record.id}>
                  <TableCell>{formatDate(record.shift_date)}</TableCell>
                  <TableCell>{`${record.start_time} - ${record.end_time}`}</TableCell>
                  <TableCell>
                    {calculateHours(
                      record.start_time,
                      record.end_time,
                      record.shift_date
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
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
