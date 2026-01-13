import {
  Delete as DeleteIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  InputAdornment,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { url } from "../constant";

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
  const [loading, setLoading] = useState(false);

  const attendanceRef = useRef(null);

  const handlePageChange = (event, value) => setPage(value);

  const formatDate = (dateStr) =>
    dateStr ? dayjs(dateStr).format("YYYY/MM/DD") : "-";

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

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [attendanceRes, employeeRes] = await Promise.all([
          axios.get(`${url}/attendance`),
          axios.get(`${url}/employee`),
        ]);

        const attendanceRaw = attendanceRes.data.result || [];
        const employeeList = employeeRes.data.result || [];

        const mergedAttendance = attendanceRaw.map((record) => {
          const employeeId = record.user || record.employee;
          const employee = employeeList.find((emp) => emp.id === employeeId);
          return {
            ...record,
            employeeName: employee?.name || "Unknown",
            status: record.checkIn ? "Present" : record.status || "Absent",
          };
        });

        const sorted = mergedAttendance.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setAttendanceRecords(sorted);
        setEmployees(employeeList);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRecords = selectedEmployeeForAttendance
    ? attendanceRecords.filter(
        (record) => record.employeeName === selectedEmployeeForAttendance
      )
    : attendanceRecords.filter((record) => {
        const term = searchTerm.toLowerCase();
        return (
          record.employeeName?.toLowerCase().includes(term) ||
          record.date?.toString().toLowerCase().includes(term) ||
          record.status?.toLowerCase().includes(term)
        );
      });

  const displayedRecords = filteredRecords.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );

  const handleDownloadExcel = () => {
    if (!filteredRecords.length) return;

    const data = filteredRecords.map((rec) => ({
      Date: formatDate(rec.date),
      Employee: rec.employeeName,
      "Check-In": rec.checkIn,
      "Check-Out": rec.checkOut,
      Status: rec.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `Attendance_${dayjs().format("YYYYMMDD")}.xlsx`);
  };

  const handleDownloadPDF = async () => {
    if (!attendanceRef.current) return;

    try {
      const canvas = await html2canvas(attendanceRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
      pdf.save(`Attendance_${dayjs().format("YYYYMMDD")}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await axios.delete(`${url}/attendance/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendanceRecords((prev) => prev.filter((rec) => rec.id !== id));
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
      alert("Failed to delete record.");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Attendance
      </Typography>

      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          label="Search Employee Attendance"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />

        {/* --- Download Buttons --- */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={handleDownloadExcel}>
            Download Excel
          </Button>
          <Button variant="outlined" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} ref={attendanceRef}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Check-In</TableCell>
              <TableCell>Check-Out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{formatDate(record.date)}</TableCell>
                <TableCell>{record.employeeName}</TableCell>
                <TableCell>{record.checkIn}</TableCell>
                <TableCell>{record.checkOut}</TableCell>
                <TableCell>
                  <Chip
                    label={record.status}
                    color={getStatusColor(record.status)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    color="error"
                    size="small"
                    onClick={() => handleDelete(record.id)}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
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
    </Box>
  );
};

export default AttendancePage;
