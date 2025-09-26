import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Box } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  AttachMoney as AttachMoneyIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = () => {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon color="primary" />, active: true },
    { text: 'Employees', icon: <PeopleIcon /> },
    { text: 'Attendance', icon: <EventNoteIcon /> },
    { text: 'Payroll', icon: <AttachMoneyIcon /> },
   
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#2c3e50',
          color: '#fff',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Typography variant="h6" sx={{ p: 2, textAlign: 'center', fontWeight: 'bold' }}>
        EMS Admin
      </Typography>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#34495e',
                },
              }}
              selected={item.active}
            >
              <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto', mb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton sx={{ color: '#fff', '&:hover': { backgroundColor: '#c0392b' } }}>
            <ListItemIcon sx={{ color: '#fff' }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;