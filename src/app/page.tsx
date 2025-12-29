// src/app/page.tsx
"use client";

import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import LeafletMap from "@/components/LeafletMap";

export default function Dashboard() {
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "#1e3a8a",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={2}>
        {/* Header */}
        <Grid item xs={12}>
          <Typography
            variant="h4"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            Flood Awareness GIS System{" "}
            <Typography variant="body1">Northern Namibia</Typography>
          </Typography>
        </Grid>

        {/* Risk Level & Population */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: "#3b82f6", color: "white" }}>
            <Typography variant="h6">Flood Risk Level</Typography>
            <Typography variant="h4">High</Typography>
            <LinearProgress
              variant="determinate"
              value={80}
              color="error"
              sx={{ mt: 1 }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: "#3b82f6", color: "white" }}>
            <Typography variant="h6">Population Affected</Typography>
            <Typography variant="h4">12,345</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: "#3b82f6", color: "white" }}>
            <Typography variant="h6">Probability Forecast</Typography>
            <Typography variant="h4">64.0%</Typography>
            <LinearProgress
              variant="determinate"
              value={64}
              color="warning"
              sx={{ mt: 1 }}
            />
          </Paper>
        </Grid>

        {/* Map */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: "600px" }}>
            <Typography variant="h6" gutterBottom>
              Flood Risk Map
            </Typography>
            <LeafletMap />
          </Paper>
        </Grid>

        {/* Emergency Alerts */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: "#ef4444", color: "white" }}>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <WarningIcon /> Emergency Alerts
            </Typography>
            <Typography>
              High flood risk in Oshana region. Evacuate low-lying areas
              immediately.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2, backgroundColor: "white", color: "#ef4444" }}
            >
              Generate Report
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
