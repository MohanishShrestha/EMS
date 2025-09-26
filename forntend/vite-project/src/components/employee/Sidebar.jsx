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

const drawerWidth = 240;

const Sidebar = () => {
  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon color="primary" />,
      active: true,
    },
    { text: "Roster", icon: <GroupIcon /> },
    { text: "Attendance", icon: <EventNoteIcon /> },
    { text: "Payroll", icon: <AttachMoneyIcon /> },
  ];

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
        sx={{
          p: 2,
          textAlign: "center",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1, // space between icon and text
        }}
      >
        <PeopleIcon />
        EMS
      </Typography>

      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#34495e",
                },
              }}
              selected={item.active}
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

export default Sidebar;
