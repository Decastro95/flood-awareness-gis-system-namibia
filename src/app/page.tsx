// src/app/page.tsx
"use client";

import React from "react";
import { Box, Grid, Paper, Typography, Button } from "@mui/material";
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

// Sample data
const precipData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Precipitation (mm)",
      data: [10, 30, 80, 150, 200, 120],
      backgroundColor: "#60a5fa",
    },
  ],
};

const waterData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Water Level (m)",
      data: [1.0, 1.8, 3.2, 4.5],
      borderColor: "#f87171",
      tension: 0.4,
    },
  ],
};

export default function Dashboard() {
  return (
    <Box
      sx={{
        backgroundColor: "#0f172a",
        color: "white",
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        fontWeight="bold"
      >
        Flood Awareness GIS System – Northern Namibia
      </Typography>

      <Grid container spacing={4}>
        {/* Risk Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, backgroundColor: "#1e293b", textAlign: "center" }}>
            <Typography variant="h6">Flood Risk Level</Typography>
            <Typography variant="h3" color="error">
              High
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, backgroundColor: "#1e293b", textAlign: "center" }}>
            <Typography variant="h6">Population Affected</Typography>
            <Typography variant="h3">12,345</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, backgroundColor: "#1e293b", textAlign: "center" }}>
            <Typography variant="h6">Probability Forecast</Typography>
            <Typography variant="h3">64%</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, backgroundColor: "#1e293b", textAlign: "center" }}>
            <Typography variant="h6">Active Alerts</Typography>
            <Typography variant="h3" color="warning.main">
              2
            </Typography>
          </Paper>
        </Grid>

        {/* Central Map */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: "600px", backgroundColor: "#1e293b" }}>
            <Typography variant="h6" gutterBottom>
              Northern Namibia Risk Map
            </Typography>
            <Box sx={{ height: "100%" }}>
              <LeafletMap />
            </Box>
          </Paper>
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{ p: 3, mb: 4, backgroundColor: "#1e293b", height: "300px" }}
          >
            <Typography variant="h6" gutterBottom>
              Globe View
            </Typography>
            <Box
              sx={{
                height: "100%",
                backgroundColor: "#334155",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>Globe Integration Coming Soon</Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, backgroundColor: "#dc2626" }}>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <WarningIcon /> Emergency Alerts
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Heavy rainfall expected in Oshana and Ohangwena regions.
            </Typography>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: "#1e293b" }}>
            <Typography variant="h6" gutterBottom>
              Precipitation Level
            </Typography>
            <Bar data={precipData} options={{ responsive: true }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: "#1e293b" }}>
            <Typography variant="h6" gutterBottom>
              Water Levels
            </Typography>
            <Line data={waterData} options={{ responsive: true }} />
          </Paper>
        </Grid>

        {/* Generate Report */}
        <Grid item xs={12} textAlign="center">
          <Button
            variant="contained"
            size="large"
            color="error"
            sx={{ px: 6, py: 2 }}
          >
            Generate Report
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
