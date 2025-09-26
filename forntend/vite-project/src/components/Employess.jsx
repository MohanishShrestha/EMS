import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Pagination,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const mockEmployees = [
  {
    id: 1,
    name: "John Doe",
    position: "Software Engineer",
    department: "Engineering",
    email: "john.doe@company.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "Product Manager",
    department: "Product",
    email: "jane.smith@company.com",
    phone: "555-987-6543",
    address: "456 Oak Ave, Anytown, USA",
  },
  {
    id: 3,
    name: "Michael Johnson",
    position: "UX Designer",
    department: "Design",
    email: "michael.j@company.com",
    phone: "555-555-1212",
    address: "789 Pine Ln, Anytown, USA",
  },
  {
    id: 4,
    name: "Emily Davis",
    position: "Data Analyst",
    department: "Analytics",
    email: "emily.d@company.com",
    phone: "555-888-9999",
    address: "101 Maple Rd, Anytown, USA",
  },
  {
    id: 5,
    name: "David Wilson",
    position: "Marketing Specialist",
    department: "Marketing",
    email: "david.w@company.com",
    phone: "555-222-3333",
    address: "202 Birch Dr, Anytown, USA",
  },
  {
    id: 6,
    name: "Sarah Brown",
    position: "Human Resources",
    department: "HR",
    email: "sarah.b@company.com",
    phone: "555-444-5555",
    address: "303 Cedar Pl, Anytown, USA",
  },
  {
    id: 7,
    name: "Chris Evans",
    position: "System Administrator",
    department: "IT",
    email: "chris.e@company.com",
    phone: "555-666-7777",
    address: "404 Elm St, Anytown, USA",
  },
  {
    id: 8,
    name: "Olivia White",
    position: "Financial Analyst",
    department: "Finance",
    email: "olivia.w@company.com",
    phone: "555-111-2222",
    address: "505 Poplar Ct, Anytown, USA",
  },
  {
    id: 9,
    name: "Daniel Lee",
    position: "Operations Manager",
    department: "Operations",
    email: "daniel.l@company.com",
    phone: "555-333-4444",
    address: "606 Spruce Ave, Anytown, USA",
  },
  {
    id: 10,
    name: "Sophia Martinez",
    position: "Content Writer",
    department: "Marketing",
    email: "sophia.m@company.com",
    phone: "555-777-8888",
    address: "707 Pinecone Rd, Anytown, USA",
  },
  {
    id: 11,
    name: "William Taylor",
    position: "Software Engineer",
    department: "Engineering",
    email: "william.t@company.com",
    phone: "555-999-0000",
    address: "808 Aspen Dr, Anytown, USA",
  },
  {
    id: 12,
    name: "Chloe Rodriguez",
    position: "Product Manager",
    department: "Product",
    email: "chloe.r@company.com",
    phone: "555-000-1111",
    address: "909 Willow Way, Anytown, USA",
  },
];

const EmployeePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const employeesPerPage = 8;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to the first page on search
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDelete = () => {
    // Placeholder for delete logic
    console.log("Delete button clicked for employee:", selectedEmployee.id);
  };

  const handleEdit = () => {
    // Placeholder for edit logic
    console.log("Edit button clicked for employee:", selectedEmployee.id);
  };

  const filteredEmployees = mockEmployees.filter((employee) =>
    Object.values(employee).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedEmployees = filteredEmployees.slice(
    (page - 1) * employeesPerPage,
    page * employeesPerPage
  );

  if (selectedEmployee) {
    console.log(selectedEmployee);
    return (
      <Box sx={{ p: 4 }}>
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
              onClick={handleEdit}
              sx={{ mr: 2 }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{ mr: 2 }}
            >
              Delete
            </Button>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{ mr: 2 }}
            >
              Add Roster
            </Button>

            <Button
              variant="contained"
              color="success"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Add Payroll info
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
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Directory
      </Typography>
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
      <Grid container spacing={3}>
        {paginatedEmployees.map((employee) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={employee.id}
            onClick={() => setSelectedEmployee(employee)}
            sx={{ cursor: "pointer" }}
          >
            <Paper sx={{ p: 4, height: "100%" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {employee.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {employee.position}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {employee.department}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {employee.email}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={Math.ceil(filteredEmployees.length / employeesPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default EmployeePage;
