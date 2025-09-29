import {
  AttachMoney as AttachMoneyIcon,
  Dashboard as DashboardIcon,
  EventNote as EventNoteIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const SidebarEmployee = () => {
  const navigate = useNavigate();

 const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/project/employee/dashboard" },
  { text: "Roster", icon: <GroupIcon />, path: "/project/employee/roster" },
  { text: "Attendance", icon: <EventNoteIcon />, path: "/project/employee/attendance" },
  { text: "Payroll", icon: <AttachMoneyIcon />, path: "/project/employee/payroll" },
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
      {/* Sidebar Header */}
      <Typography
        variant="h6"
        sx={{
          p: 2,
          textAlign: "center",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <PeopleIcon />
        EMS
      </Typography>

      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />

      {/* Menu Items */}
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
                "&.active": {
                  backgroundColor: "#1abc9c",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <Box sx={{ mt: "auto", mb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{ color: "#fff", "&:hover": { backgroundColor: "#c0392b" } }}
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

export default SidebarEmployee;
