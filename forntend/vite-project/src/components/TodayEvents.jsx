import React from 'react';
import { Paper, Box, Typography, CardContent, Avatar, Grid } from '@mui/material';
import { CalendarMonth as CalendarMonthIcon, Cake as CakeIcon } from '@mui/icons-material';

const TodayEvent = ({ event }) => {
  return (
    <Paper sx={{ 
        pt: 4, 
        pb: 4, 
        pl: 6, 
        ml: -3,
        mb: 3,
        pr:48,
      }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', borderBottom: '1px solid #eee', pb: 2, mb: 4 }}>
        <Typography variant="h6" sx={{ mr: 1 }}>Today's Event</Typography>
        <CalendarMonthIcon color="action" />
      </Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar sx={{ bgcolor: '#f39c12', width: 56, height: 56 }}>
            <CakeIcon sx={{ fontSize: 32 }} />
          </Avatar>
        </Grid>
        <Grid item xs>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{event.title}</Typography>
          <Typography variant="body2" color="text.secondary">{event.description}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TodayEvent;