import { useEffect, useState } from "react";
import axios from "axios";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Select,
  MenuItem
} from "@mui/material";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ1dHR1dGhlZ3JlYXQxMjM0QGdtYWlsLmNvbSIsImV4cCI6MTc3ODc2MjcwNywiaWF0IjoxNzc4NzYxODA3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZmE3YWQ2YzItMWI0ZS00MjdjLTkzOTUtNTcyYzkxYTcxMzcwIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidXRrYXJzaCByYWkiLCJzdWIiOiI5YTUyOGQ4Ny1jZGY5LTQ1MWMtODVkYi03ZjUzZGRiM2Q3NjQifSwiZW1haWwiOiJ1dHR1dGhlZ3JlYXQxMjM0QGdtYWlsLmNvbSIsIm5hbWUiOiJ1dGthcnNoIHJhaSIsInJvbGxObyI6IjEyMzEzODY5IiwiYWNjZXNzQ29kZSI6IlRSdlpXcSIsImNsaWVudElEIjoiOWE1MjhkODctY2RmOS00NTFjLTg1ZGItN2Y1M2RkYjNkNzY0IiwiY2xpZW50U2VjcmV0IjoiaEVjeEt4S0p6cVpReXBKYyJ9.t-LMKELDQ8R7oQKJSxdYEGyDZ356sMyS2pJh1rOHiqs";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://4.224.186.213/evaluation-service/notifications",
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        }
      );

      setNotifications(response.data.notifications);
    } catch (error) {
      console.log(error.message);
    }
  };

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter(
          (notification) => notification.Type === filter
        );

  return (
    <Container style={{ marginTop: "30px" }}>
      <Typography variant="h4" gutterBottom>
        Campus Notification Platform
      </Typography>

      <Select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: "20px", minWidth: "200px" }}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Placement">Placement</MenuItem>
        <MenuItem value="Result">Result</MenuItem>
        <MenuItem value="Event">Event</MenuItem>
      </Select>

      <Grid container spacing={2}>
        {filteredNotifications.map((notification, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {notification.Type}
                </Typography>

                <Typography>
                  {notification.Message}
                </Typography>

                <Typography variant="body2">
                  {notification.Timestamp}
                </Typography>

                <Button
                  variant="contained"
                  style={{ marginTop: "10px" }}
                >
                  Mark as Viewed
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;