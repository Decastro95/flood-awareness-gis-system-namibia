"use client";

import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import WarningIcon from "@mui/icons-material/Warning";
import LeafletMap from "@/components/LeafletMap";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  return (
    <Box
      sx={{
        backgroundColor: "#0f172a",
        color: "white",
        minHeight: "100vh",
        p: 4,
      }}
    >
      <Typography variant="h4" gutterBottom textAlign="center">
        Flood Awareness GIS System – Northern Namibia
      </Typography>

      {/* Grid v2: NO container / NO item */}
      <Grid spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, backgroundColor: "#1e293b", textAlign: "center" }}>
            <Typography variant="h6">Flood Risk Level</Typography>
            <Typography variant="h3" color="error.main">
              High
            </Typography>
          </Paper>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, backgroundColor: "#1e293b", textAlign: "center" }}>
            <Typography variant="h6">Population Affected</Typography>
            <Typography variant="h3">12,345</Typography>
          </Paper>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, backgroundColor: "#1e293b", textAlign: "center" }}>
            <Typography variant="h6">Probability Forecast</Typography>
            <Typography variant="h3">64%</Typography>
          </Paper>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, backgroundColor: "#1e293b", textAlign: "center" }}>
            <Typography variant="h6">Active Alerts</Typography>
            <Typography variant="h3" color="warning.main">
              2
            </Typography>
          </Paper>
        </Grid>

        <Grid xs={12} md={8}>
          <Paper sx={{ p: 2, height: 600, backgroundColor: "#1e293b" }}>
            <Typography variant="h6" gutterBottom>
              Northern Namibia Risk Map
            </Typography>
            <LeafletMap />
          </Paper>
        </Grid>

        <Grid xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 3, height: 300, backgroundColor: "#1e293b" }}>
            <Typography variant="h6">Globe View</Typography>
            <Box
              sx={{
                height: "100%",
                background: "#334155",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>Globe Coming Soon</Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 2, backgroundColor: "#dc2626" }}>
            <Typography variant="h6" sx={{ display: "flex", gap: 1 }}>
              <WarningIcon /> Emergency Alerts
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Heavy rain in Oshana – evacuate low areas.
            </Typography>
          </Paper>
        </Grid>

        <Grid xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: "#1e293b" }}>
            <Typography variant="h6">Precipitation Level</Typography>
            <Bar data={{ labels: [], datasets: [] }} />
          </Paper>
        </Grid>

        <Grid xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: "#1e293b" }}>
            <Typography variant="h6">Water Levels</Typography>
            <Line data={{ labels: [], datasets: [] }} />
          </Paper>
        </Grid>

        <Grid xs={12} textAlign="center">
          <Button variant="contained" color="error" size="large">
            Generate Report
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
