import React, { useEffect, useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import {
  CalendarMonth as CalendarMonthIcon,
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";
import { url } from "../../constant";

const TodayEvent = ({ event }) => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  // Fetch events from DB
  const fetchEvents = async () => {
    try {
      // NOTE: Assuming res.data.result is an array of event objects
      const res = await axios.get(`${url}/event`);
      console.log(res.data)
      setEvents(res.data.result || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setErrorOpen(true);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Snackbar handlers
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
    setErrorOpen(false);
  };

  return (
    <Paper
      sx={{
        pt: 4,
        pb: 4,
        pl: 6,
        pr: 6,
        mb: 3,
        // 🚀 FIX: Set the width to fill the available space
        width: "100%",
        // 💡 OPTIONAL: You can set a maximum width if you don't want it to span the full page
        // maxWidth: "800px",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          pb: 2,
          mb: 4,
        }}
      >
        <Typography variant="h6" sx={{ mr: 1 }}>
          Today's Event
        </Typography>
        <CalendarMonthIcon color="action" />
      </Box>

      {/* EVENTS LIST */}
      <Box sx={{ minHeight: "200px" }}>
        {events.length > 0 ? (
          events.map((event) => (
            <Grid
              container
              alignItems="center"
              key={event.id}
              justifyContent="flex-start"
              sx={{ mb: 3, width: "100%" }}
            >
              <Grid item>
                <Avatar sx={{ bgcolor: "#1976d2", width: 48, height: 48 }}>
                  <NotificationsIcon sx={{ fontSize: 24 }} />
                </Avatar>
              </Grid>

              <Grid
                item
                xs
                sx={{ pl: 2, display: "flex", flexDirection: "column" }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {event.event}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created:{" "}
                  {new Date(event.createdAt).toLocaleDateString("en-GB")}
                </Typography>
              </Grid>
            </Grid>
          ))
        ) : (
          <Typography>No events yet</Typography>
        )}
      </Box>

      {/* SNACKBARS */}
      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Operation successful!
        </Alert>
      </Snackbar>
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          An error occurred.
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default TodayEvent;
