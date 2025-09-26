import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Lock from "@mui/icons-material/Lock";
import Group from "@mui/icons-material/Group";
import Settings from "@mui/icons-material/Settings";

// A mock API call function to simulate a network request.
// const mockLoginApi = (username, password, role) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (
//         username === "admin" &&
//         password === "password123" &&
//         role === "admin"
//       ) {
//         resolve({
//           token: "mock-admin-token",
//           user: { role: "admin", name: "Admin User", username: "admin" },
//         });
//       } else if (
//         username === "user" &&
//         password === "password123" &&
//         role === "employee"
//       ) {
//         resolve({
//           token: "mock-user-token",
//           user: { role: "employee", name: "Regular User", username: "user" },
//         });
//       } else {
//         reject(new Error("Invalid credentials or role selected."));
//       }
//     }, 1500);
//   });
// };

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      // Assuming your roles are 'admin' and 'employee' based on the image's "Role" dropdown
      navigate(storedUser.role === "admin" ? "/admin" : "/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await mockLoginApi(
        form.username,
        form.password,
        form.role
      );

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);

      navigate(response.user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundImage:
          "linear-gradient(to bottom, #3A709E, #2E628D, #255577, #1C445F, #102C45)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 450,
          background: "#fff",
          borderRadius: 2,
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: "rgba(16, 46, 71, 1)",
            color: "#fff",
            padding: "24px",
            textAlign: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Group sx={{ fontSize: 60, mb: 1 }} />
          <Settings
            sx={{
              fontSize: 24,
              position: "relative",
              top: "-15px",
              left: "-5px",
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            Employee Management System
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Sign in to access your account
          </Typography>
        </Box>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "32px 24px",
          }}
        >
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={form.role}
              label="Role"
              name="role"
              onChange={handleChange}
              startAdornment={
                <InputAdornment position="start">
                  <Group />
                </InputAdornment>
              }
            >
              <MenuItem value="">
                <em>Select your role</em>
              </MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
            </Select>
          </FormControl>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3, py: 1.5, fontSize: "1rem", borderRadius: 1 }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Footer Section */}
        <Box
          sx={{
            padding: "16px 24px",
            textAlign: "center",
            fontSize: "0.8rem",
            color: "#666",
            borderTop: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            &copy; 2025 Employee Management System
          </Typography>
          <Button
            variant="text"
            size="small"
            sx={{ textTransform: "none", fontSize: "0.8rem" }}
          >
            Forgot Password?
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
