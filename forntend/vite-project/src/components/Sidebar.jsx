import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  AttachMoney as AttachMoneyIcon,
  Logout as LogoutIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/project/admin/dashboard",
    },
    {
      text: "Employees",
      icon: <PeopleIcon />,
      path: "/project/admin/employees",
    },
    {
      text: "Roster",
      icon: <GroupIcon />,
      path: "/project/admin/roster", 
    },
    {
      text: "Attendance",
      icon: <EventNoteIcon />,
      path: "/project/admin/attendance",
    },
    {
      text: "Payroll",
      icon: <AttachMoneyIcon />,
      path: "/project/admin/payroll",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#2c3e50",
          color: "#fff",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Typography
        variant="h6"
        sx={{ p: 2, textAlign: "center", fontWeight: "bold" }}
      >
        EMS Admin
      </Typography>
      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#34495e",
                },
              }}
              style={({ isActive }) =>
                isActive
                  ? {
                      backgroundColor: "#1abc9c",
                      fontWeight: "bold",
                    }
                  : undefined
              }
            >
              <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: "auto", mb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              color: "#fff",
              "&:hover": { backgroundColor: "#c0392b" },
            }}
            onClick={handleLogout}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
