import React, { useEffect, useState, useCallback, useRef } from "react";
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
  TextField,
  MenuItem,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  FileDownload as FileDownloadIcon,
  CalculateOutlined as CalculateIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import axios from "axios";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { url } from "../constant";

const TotalTableCell = (props) => (
  <TableCell
    {...props}
    sx={{
      fontWeight: "bold",
      fontSize: "1rem",
      backgroundColor: props.net ? "#e8f5e9" : "#fff3e0",
      color: props.net ? "success.dark" : "text.primary",
      borderTop: "2px solid #ccc",
    }}
  />
);

const Payroll = () => {
  const payslipRef = useRef(null);

  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [annualSalary, setAnnualSalary] = useState(0);
  const [startDate, setStartDate] = useState(dayjs().subtract(7, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [totalHours, setTotalHours] = useState(0);

  const token = localStorage.getItem("token") || "";
  const taxRate = 0.01;

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await axios.get(`${url}/employee`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let list = [];
      if (Array.isArray(res.data)) list = res.data;
      else if (Array.isArray(res.data.result)) list = res.data.result;
      else if (Array.isArray(res.data.employees)) list = res.data.employees;
      else list = [];

      // Exclude admins
      const filtered = list.filter(
        (emp) => String(emp.role || "").toLowerCase() !== "admin"
      );

      setEmployees(filtered);

      // Do NOT auto-select any employee
      setSelectedEmployeeId("");
      setEmployeeName("");
    } catch (err) {
      console.error(
        "Error fetching employees:",
        err?.response?.data || err.message
      );
      setEmployees([]);
    }
  }, [token]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (!selectedEmployeeId) {
      setAnnualSalary(0);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${url}/payroll`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { employee_id: selectedEmployeeId },
        });

        let payrolls = [];
        if (Array.isArray(res.data)) payrolls = res.data;
        else if (Array.isArray(res.data.payrolls)) payrolls = res.data.payrolls;
        else if (Array.isArray(res.data.result)) payrolls = res.data.result;
        else payrolls = [];

        const match = payrolls.find(
          (p) =>
            String(p.employee_id?.id || p.employee_id || p.employee) ===
            String(selectedEmployeeId)
        );

        if (!cancelled) setAnnualSalary(Number(match?.annual_salary || 0));
      } catch (err) {
        console.error(
          "Error fetching payroll:",
          err?.response?.data || err.message
        );
        if (!cancelled) setAnnualSalary(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedEmployeeId, token]);

  useEffect(() => {
    if (!selectedEmployeeId || !startDate || !endDate) {
      setTotalHours(0);
      return;
    }

    axios
      .get(`${url}/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          employee: selectedEmployeeId,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      })
      .then((res) => {
        let all = [];
        if (Array.isArray(res.data)) all = res.data;
        else if (Array.isArray(res.data.result)) all = res.data.result;
        else if (Array.isArray(res.data.attendance)) all = res.data.attendance;
        else if (Array.isArray(res.data.data)) all = res.data.data;
        else all = [];

        const start = dayjs(startDate).startOf("day");
        const end = dayjs(endDate).endOf("day");

        const total = all
          .filter((record) => {
            if (!record) return false;
            const recEmpId =
              record.employee?._id || record.employee?.id || record.employee;
            if (String(recEmpId) !== String(selectedEmployeeId)) return false;

            if (!record.date) return false;
            const recordDate = dayjs(record.date);
            if (recordDate.isBefore(start) || recordDate.isAfter(end))
              return false;

            return true;
          })
          .reduce((sum, record) => {
            if (!record.checkIn || !record.checkOut) return sum;

            let checkIn = dayjs(record.checkIn);
            let checkOut = dayjs(record.checkOut);

            if (!checkIn.isValid() || !checkOut.isValid()) {
              const [inH = 0, inM = 0] = (record.checkIn || "")
                .split(":")
                .map(Number);
              const [outH = 0, outM = 0] = (record.checkOut || "")
                .split(":")
                .map(Number);
              checkIn = dayjs(record.date)
                .hour(inH)
                .minute(inM || 0)
                .second(0);
              checkOut = dayjs(record.date)
                .hour(outH)
                .minute(outM || 0)
                .second(0);
            }

            const diffHours = checkOut.diff(checkIn, "hour", true);
            return diffHours > 0 ? sum + diffHours : sum;
          }, 0);

        setTotalHours(parseFloat(total.toFixed(2)));
      })
      .catch((err) => {
        console.error(
          "Error fetching attendance:",
          err?.response?.data || err.message
        );
        setTotalHours(0);
      });
  }, [selectedEmployeeId, startDate, endDate, token]);

  const handleEmployeeChange = (event) => {
    const newId = event.target.value;
    setSelectedEmployeeId(String(newId));
    const emp = employees.find(
      (e) => String(e.id || e._id || e.employee_id) === String(newId)
    );
    setEmployeeName(emp?.name || "");
  };

  // payroll math
  const hourlyRate = annualSalary
    ? parseFloat((annualSalary / 2080).toFixed(2))
    : 0;
  const grossPay = parseFloat((totalHours * hourlyRate).toFixed(2));
  const tax = parseFloat((grossPay * taxRate).toFixed(2));
  const netPay = parseFloat((grossPay - tax).toFixed(2));

  // --- Download handlers  ---
  const handleDownloadSummary = () => {
    if (!employeeName) return;
    const payslipData = [
      {
        Employee: employeeName,
        "Annual Salary": annualSalary,
        "Hourly Rate": hourlyRate,
        "Total Hours": totalHours,
        "Gross Pay": grossPay,
        Tax: tax,
        "Net Pay": netPay,
        "Start Date": startDate.format("YYYY-MM-DD"),
        "End Date": endDate.format("YYYY-MM-DD"),
      },
    ];
    const ws = XLSX.utils.json_to_sheet(payslipData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payslip");
    XLSX.writeFile(
      wb,
      `${employeeName || "employee"}_Payslip_${startDate.format(
        "YYYYMMDD"
      )}_to_${endDate.format("YYYYMMDD")}.xlsx`
    );
  };

  const handleDownloadView = async () => {
    if (!payslipRef.current) return;
    try {
      const canvas = await html2canvas(payslipRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = { width: canvas.width, height: canvas.height };
      const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
      pdf.save(
        `${employeeName || "employee"}_Payslip_${startDate.format(
          "YYYYMMDD"
        )}_to_${endDate.format("YYYYMMDD")}.pdf`
      );
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF — check console.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Payroll
          </Typography>
        </Stack>

        <Paper
          sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 2 }}
          variant="outlined"
          ref={payslipRef}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 500,
              borderBottom: "1px solid #eee",
              pb: 1,
            }}
          >
            Employee Payslip
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Select Employee"
                value={selectedEmployeeId || ""}
                onChange={handleEmployeeChange}
                fullWidth
                variant="outlined"
                helperText={`Current Employee: ${
                  employeeName || "None Selected"
                }`}
              >
                {employees.map((e) => {
                  const id = e.id || e._id || e.employee_id || "";
                  const name =
                    e.name ||
                    e.fullName ||
                    `${e.firstName || ""} ${e.lastName || ""}`.trim();
                  return (
                    <MenuItem key={id} value={String(id)}>
                      {name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(v) => setStartDate(v || dayjs())}
                slotProps={{
                  textField: { fullWidth: true, variant: "outlined" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(v) => setEndDate(v || dayjs())}
                slotProps={{
                  textField: { fullWidth: true, variant: "outlined" },
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom>
            Summary Calculations
          </Typography>
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={6}>
              <List
                dense
                sx={{
                  border: "1px solid #eee",
                  borderRadius: 1,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <ListItem>
                  <ListItemText primary="Annual Salary: " />
                  <Typography variant="subtitle1" fontWeight={600}>
                    ${Number(annualSalary).toLocaleString() || 0}
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Hourly Rate: " />
                  <Typography variant="subtitle1">${hourlyRate}</Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Total Hours Worked: " />
                  <Typography
                    variant="subtitle1"
                    color="primary.main"
                    fontWeight={600}
                  >
                    {totalHours}
                  </Typography>
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <List
                dense
                sx={{
                  border: "1px solid #eee",
                  borderRadius: 1,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <ListItem>
                  <ListItemText primary="Gross Pay: " />
                  <Typography
                    variant="h6"
                    color="primary.dark"
                    fontWeight={700}
                  >
                    ${grossPay}
                  </Typography>
                </ListItem>

                <ListItem>
                  <ListItemText primary="Net Pay: " />
                  <Typography
                    variant="h6"
                    color="success.dark"
                    fontWeight={700}
                  >
                    ${netPay}
                  </Typography>
                </ListItem>
              </List>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
            Detailed Breakdown
          </Typography>
          <TableContainer
            component={Paper}
            elevation={1}
            sx={{ border: "1px solid #ddd" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "primary.light" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                    Description
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: "white" }}
                  >
                    Hours
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: "white" }}
                  >
                    Rate
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: "white" }}
                  >
                    Gross Amount
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: "white" }}
                  >
                    Tax
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{employeeName || "Regular Pay"}</TableCell>
                  <TableCell align="right">{totalHours}</TableCell>
                  <TableCell align="right">${hourlyRate}</TableCell>
                  <TableCell align="right">${grossPay}</TableCell>
                  <TableCell align="right">${tax}</TableCell>
                </TableRow>

                <TableRow>
                  <TotalTableCell colSpan={3}>
                    <Typography fontWeight={300}>TOTAL GROSS PAY</Typography>
                  </TotalTableCell>
                  <TotalTableCell align="right">${grossPay}</TotalTableCell>
                  <TotalTableCell align="right">${tax}</TotalTableCell>
                </TableRow>
                <TableRow>
                  <TotalTableCell colSpan={4} net>
                    <Typography fontWeight={300}>TOTAL NET PAY</Typography>
                  </TotalTableCell>
                  <TotalTableCell align="right" net>
                    <Typography variant="h6" fontWeight={300}>
                      ${netPay}
                    </Typography>
                  </TotalTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}
          >
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={handleDownloadSummary}
              disabled={!selectedEmployeeId}
            >
              Download Summary (Excel)
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={handleDownloadView}
              disabled={!selectedEmployeeId}
            >
              Download Payslip (PDF)
            </Button>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default Payroll;
