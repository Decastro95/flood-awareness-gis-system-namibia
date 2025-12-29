// src/components/FloodAlertsPanel.tsx
"use client";

import { useState } from "react";
import { Alert, AlertTitle } from "@mui/material";
import { Box, Typography } from "@mui/material";

export default function FloodAlertsPanel() {
  const [alerts] = useState([
    {
      title: "No Active Alerts",
      description: "All clear in Northern Namibia.",
      severity: "info",
    },
  ]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Emergency Alerts
      </Typography>
      {alerts.map((alert, i) => (
        <Alert
          key={i}
          severity={alert.severity as "error" | "warning" | "info" | "success"}
        >
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.description}
        </Alert>
      ))}
    </Box>
  );
}
