import React from 'react';
import { AppBar, Toolbar, Box, InputBase, IconButton, Avatar, Typography, Badge } from '@mui/material';
import { Search as SearchIcon, Notifications as NotificationsIcon } from '@mui/icons-material';

const Header = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ backgroundColor: '#fff' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '20px', padding: '5px 15px', width: '400px' }}>
          <InputBase placeholder="Search employees, reports..." sx={{ flexGrow: 1 }} />
          <IconButton sx={{ color: '#888' }}>
            <SearchIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge badgeContent={3} color="error" sx={{ mr: 2 }}>
            <NotificationsIcon sx={{ color: '#888' }} />
          </Badge>
          <Avatar sx={{ bgcolor: '#3498db' }}>AD</Avatar>
          <Box sx={{ ml: 1 }}>
            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
              Admin User
            </Typography>
            <Typography variant="body2" color="text.secondary">
              System Administrator
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;