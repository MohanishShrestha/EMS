import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  InputBase,
  IconButton,
  Avatar,
  Typography,
  Badge,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";

const Header = () => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.warn("Invalid user data in localStorage");
  }

  const displayName = user?.name || "Employee";
  const displayRole = user?.role || " ";

  // Generate initials from name (e.g., "Bipan User" → "BU")
  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ backgroundColor: "#fff" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "#3498db" }}>{initials}</Avatar>
          <Box sx={{ ml: 1 }}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {displayRole}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
