import React, { useState, useContext } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Lock from "@mui/icons-material/Lock";
import Group from "@mui/icons-material/Group";
import Settings from "@mui/icons-material/Settings";
import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";
import { url } from "../constant";
import { GlobalVariableContext } from "../App";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const global = useContext(GlobalVariableContext);

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { username, password, role, email } = form;

    // Basic validation
    if (!username || !password || !role || !email) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${url}/employee/login`, {
        username,
        password,
        email,
        role,
      });

      const { token, data: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      global?.setToken?.(token);

      const redirectPath =
        location?.state?.from?.pathname ||
        (userData.role === "admin"
          ? "/project/admin/dashboard"
          : "/project/employee/dashboard");

      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
        {/* Header */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "32px 24px" }}>
          <TextField
            fullWidth
            required
            autoFocus
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
            required
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            required
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

          <FormControl fullWidth required margin="normal">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={form.role}
              label="Role"
              name="role"
              onChange={handleChange}
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

        {/* Footer */}
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
