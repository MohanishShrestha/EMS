import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../constant";

import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlaylistAdd as RosterIcon,
  MonetizationOn as PayrollIcon,
  PersonAdd as AddIcon,
} from "@mui/icons-material";

const EmployeePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [openRosterForm, setOpenRosterForm] = useState(false);
  const [rosterForm, setRosterForm] = useState({
    employee_id: "",
    shift_date: "",
    start_time: "",
    end_time: "",
  });
  const [openAttendanceForm, setOpenAttendanceForm] = useState(false);
  const [attendanceForm, setAttendanceForm] = useState({
    employee_id: "",
    date: "",
    checkIn: "",
    checkOut: "",
  });

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [openPayrollForm, setOpenPayrollForm] = useState(false);
  const [payrollForm, setPayrollForm] = useState({
    employee_id: "",
    annual_salary: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const departments = [
    "Engineering",
    "Product",
    "Design",
    "Marketing",
    "HR",
    "Finance",
    "Operations",
    "Analytics",
    "IT",
  ];

  const positions = [
    "Software Engineer",
    "Product Manager  ",
    "UX Designer      ",
    "Market Specialist",
    "Data Analyst     ",
    "System Admin     ",
    "Financial Analyst",
    "Content Writer   ",
    "Operation Manager",
    "Human Resources  ",
  ];

  const [openAddForm, setOpenAddForm] = useState(false);
  const [employees, setEmployees] = useState([]);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
    password: "",
  });

  const employeesPerPage = 5;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`${url}/employee/${id}`);
      await fetchEmployees();
      setSelectedEmployee(null);
      setSuccessMessage("Employee deleted successfully!");
      setSuccessOpen(true);
    } catch (error) {
      console.error(
        "Error deleting employee:",
        error.response?.data || error.message
      );
    }
  };

  const handleAddEmployee = async () => {
    try {
      if (newEmployee.id) {
        await axios.patch(`${url}/employee/${newEmployee.id}`, {
          name: newEmployee.name,
          email: newEmployee.email,
          position: newEmployee.position,
          department: newEmployee.department,
          password: newEmployee.password,
        });
      } else {
        await axios.post(`${url}/employee`, {
          name: newEmployee.name,
          email: newEmployee.email,
          position: newEmployee.position,
          department: newEmployee.department,
          password: newEmployee.password,
        });
      }

      setOpenAddForm(false);
      setNewEmployee({
        name: "",
        email: "",
        position: "",
        department: "",
        password: "",
      });
      await fetchEmployees();
      setSelectedEmployee(null);
      setSuccessMessage("Employee added successfully!");
      setSuccessOpen(true);
    } catch (error) {
      console.error(
        "Error saving employee:",
        error.response?.data || error.message
      );
      setErrorMessage(
        error.response?.data?.message || "Failed to save employee"
      );
      setErrorOpen(true);
    }
  };

  const filteredEmployees = Array.isArray(employees)
    ? employees
        .filter((employee) => employee.role !== "admin")
        .filter((employee) =>
          Object.values(employee).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
    : [];

  const paginatedEmployees = filteredEmployees.slice(
    (page - 1) * employeesPerPage,
    page * employeesPerPage
  );

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${url}/employee`);
      console.log("Fetched employees:", response.data);
      setEmployees(response.data.result);
    } catch (error) {
      console.error(
        "Error fetching employees:",
        error.response?.data || error.message
      );
    }
  };

  const handleCreatePayroll = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${url}/payroll`,
        {
          employee_id: payrollForm.employee_id,
          annual_salary: payrollForm.annual_salary,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOpenPayrollForm(false);
      setPayrollForm({ employee_id: "", annual_salary: "" });
      setSuccessMessage("Payroll added successfully!");
      setSuccessOpen(true);
    } catch (error) {
      console.error(
        "Error creating payroll:",
        error.response?.data || error.message
      );
    }
  };

  const handleCreateRoster = async () => {
    try {
      await axios.post(`${url}/roster`, {
        employee_id: rosterForm.employee_id,
        shift_date: rosterForm.shift_date,
        start_time: rosterForm.start_time,
        end_time: rosterForm.end_time,
      });

      setOpenRosterForm(false);
      setRosterForm({
        employee_id: "",
        shift_date: "",
        start_time: "",
        end_time: "",
      });
      setSuccessMessage("Roster added successfully!");
      setSuccessOpen(true);
    } catch (error) {
      console.error(
        "Error creating roster:",
        error.response?.data || error.message
      );
    }
  };

  const handleCreateAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(attendanceForm.employee_id);
      await axios.post(
        `${url}/attendance`,
        {
          employee_id: attendanceForm.employee_id,
          date: attendanceForm.date,
          checkIn: attendanceForm.checkIn,
          checkOut: attendanceForm.checkOut,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOpenAttendanceForm(false);
      setAttendanceForm({
        employee_id: "",
        date: "",
        checkIn: "",
        checkOut: "",
      });
      setSuccessMessage("Attendance added successfully!");
      setSuccessOpen(true);
    } catch (error) {
      console.error(
        "Error creating attendance:",
        error.response?.data || error.message
      );
      setErrorMessage(
        error.response?.data?.message || "Failed to add attendance"
      );
      setErrorOpen(true);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      {selectedEmployee ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => setSelectedEmployee(null)}
            >
              Back to list
            </Button>
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => handleAddEmployee(selectedEmployee.id)}
                sx={{ mr: 2 }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(selectedEmployee.id)}
                sx={{ mr: 2 }}
              >
                Delete
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setRosterForm({ ...rosterForm, employee_id: employee.id });
                  setOpenRosterForm(true);
                }}
              >
                Add Roster
              </Button>

              <Button
                variant="contained"
                color="success"
                startIcon={<PayrollIcon />}
              >
                Add Payroll Info
              </Button>
            </Box>
          </Box>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              {selectedEmployee.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {selectedEmployee.position} - {selectedEmployee.department}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1">
                <strong>Email:</strong> {selectedEmployee.email}
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> {selectedEmployee.phone}
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> {selectedEmployee.address}
              </Typography>
            </Box>
          </Paper>
        </>
      ) : (
        // Table View
        <>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h4">Employees</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddForm(true)}
            >
              Add Employee
            </Button>
          </Box>

          <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end" }}>
            <TextField
              label="Search Employees"
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

          {paginatedEmployees.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No employees found.
            </Typography>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Position</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Department</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Email</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Actions</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedEmployees.map((employee) => (
                      <TableRow key={employee.id} hover>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell align="right">
                          {/* <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            sx={{ mr: 1 }}
                            onClick={() => {
                              setNewEmployee(employee);
                              setOpenAddForm(true);
                            }}
                          >
                            Edit
                          </Button> */}
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{ mr: 1 }}
                            // startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(employee.id)}
                          >
                            Delete
                          </Button>

                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => {
                              setRosterForm({
                                ...rosterForm,
                                employee_id: employee.id,
                              });
                              setOpenRosterForm(true);
                            }}
                          >
                            Add Roster
                          </Button>

                          <Button
                            variant="outlined"
                            size="small"
                            color="success"
                            sx={{ mr: 1 }}
                            onClick={() => {
                              setPayrollForm({
                                ...payrollForm,
                                employee_id: employee.id,
                              });
                              setOpenPayrollForm(true);
                            }}
                          >
                            Add Payroll
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => {
                              setAttendanceForm({
                                ...attendanceForm,
                                employee_id: employee.id,
                              });
                              setOpenAttendanceForm(true);
                            }}
                          >
                            Add Attendance
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={Math.ceil(filteredEmployees.length / employeesPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
          )}
        </>
      )}

      <Dialog
        open={openRosterForm}
        onClose={() => setOpenRosterForm(false)}
        fullWidth
      >
        <DialogTitle>Add Roster</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Employee</InputLabel>
            <Select
              value={rosterForm.employee_id}
              onChange={(e) =>
                setRosterForm({ ...rosterForm, employee_id: e.target.value })
              }
              label="Employee"
            >
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Shift Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={rosterForm.shift_date}
            onChange={(e) =>
              setRosterForm({ ...rosterForm, shift_date: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Start Time"
            placeholder="e.g. 09:00 AM"
            value={rosterForm.start_time}
            onChange={(e) =>
              setRosterForm({ ...rosterForm, start_time: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="End Time"
            placeholder="e.g. 05:00 PM"
            value={rosterForm.end_time}
            onChange={(e) =>
              setRosterForm({ ...rosterForm, end_time: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRosterForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateRoster}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPayrollForm}
        onClose={() => setOpenPayrollForm(false)}
        fullWidth
      >
        <DialogTitle>Add Payroll Info</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Annual Salary"
            type="number"
            value={payrollForm.annual_salary}
            onChange={(e) =>
              setPayrollForm({ ...payrollForm, annual_salary: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPayrollForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreatePayroll}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Add/Edit Modal */}
      <Dialog
        open={openAddForm}
        onClose={() => setOpenAddForm(false)}
        fullWidth
      >
        <DialogTitle>
          {newEmployee.id ? "Edit Employee" : "Add New Employee"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={newEmployee.name}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={newEmployee.email}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, email: e.target.value })
            }
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Department</InputLabel>
            <Select
              value={newEmployee.department}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, department: e.target.value })
              }
              label="Department"
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Position</InputLabel>
            <Select
              value={newEmployee.position}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, position: e.target.value })
              }
              label="Position"
            >
              {positions.map((pos) => (
                <MenuItem key={pos} value={pos}>
                  {pos}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={newEmployee.password}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, password: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddEmployee}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAttendanceForm}
        onClose={() => setOpenAttendanceForm(false)}
        fullWidth
      >
        <DialogTitle>Add Attendance</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Employee</InputLabel>
            <Select
              value={attendanceForm.employee_id}
              onChange={(e) =>
                setAttendanceForm({
                  ...attendanceForm,
                  employee_id: e.target.value,
                })
              }
              label="Employee"
            >
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={attendanceForm.date}
            onChange={(e) =>
              setAttendanceForm({ ...attendanceForm, date: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Check-In Time"
            placeholder="e.g. 09:00:00 AM"
            value={attendanceForm.checkIn}
            onChange={(e) =>
              setAttendanceForm({ ...attendanceForm, checkIn: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Check-Out Time"
            placeholder="e.g. 05:00:00 PM"
            value={attendanceForm.checkOut}
            onChange={(e) =>
              setAttendanceForm({ ...attendanceForm, checkOut: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAttendanceForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateAttendance}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          "& .MuiPaper-root": {
            minWidth: "420px", // wider alert
          },
        }}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          sx={{
            width: "100%",
            fontSize: "1.2rem",
            fontWeight: "bold",
            padding: "16px 24px",
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={errorOpen}
        autoHideDuration={4000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          "& .MuiPaper-root": {
            minWidth: "420px",
          },
        }}
      >
        <Alert
          onClose={() => setErrorOpen(false)}
          severity="error"
          sx={{
            width: "100%",
            fontSize: "1.2rem",
            fontWeight: "bold",
            padding: "16px 24px",
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeePage;
