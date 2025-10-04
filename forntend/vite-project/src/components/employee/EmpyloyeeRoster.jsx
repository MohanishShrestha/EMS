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
} from "@mui/material";
import axios from "axios";
import { url } from "../../constant";
import dayjs from "dayjs";

const RosterPage = () => {
  const [page, setPage] = useState(1);
  const [searchDate, setSearchDate] = useState("");
  const recordsPerPage = 10;
  const [rosterData, setRosterData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        const employeeId = user.id;

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

  const handleDateChange = (event) => {
    setSearchDate(event.target.value);
    setPage(1);
  };

  // Filter by selected date
  const filteredRecords = rosterData.filter((record) =>
    searchDate
      ? dayjs(record.shift_date).format("YYYY-MM-DD") === searchDate
      : true
  );

  const paginatedRecords = filteredRecords.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );

  const formatDate = (dateStr) => dayjs(dateStr).format("YYYY-MM-DD");

  const calculateHours = (start, end, dateStr) => {
    const formattedDate = dayjs(dateStr).format("YYYY-MM-DD");

    // Parse start time
    let startDateTime = dayjs(`${formattedDate} ${start}`, [
      "YYYY-MM-DD HH:mm",
      "YYYY-MM-DD hh:mm A",
    ]);
    // Parse end time
    let endDateTime = dayjs(`${formattedDate} ${end}`, [
      "YYYY-MM-DD HH:mm",
      "YYYY-MM-DD hh:mm A",
    ]);

    if (!startDateTime.isValid() || !endDateTime.isValid()) return "0 hrs";

    // Overnight shift
    if (endDateTime.isBefore(startDateTime)) {
      endDateTime = endDateTime.add(1, "day");
    }

    const diff = endDateTime.diff(startDateTime, "minute") / 60;
    return `${diff.toFixed(1)} hrs`;
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Roster
      </Typography>

      {/* Date Search */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end" }}>
        <TextField
          label="Search by Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={searchDate}
          onChange={handleDateChange}
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
