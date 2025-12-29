// src/app/page.tsx
"use client";

import React from "react";
import { Box, Grid, Paper, Typography, Card, Button } from "@mui/material";
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

const precipData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Precipitation (mm)",
      data: [10, 20, 50, 150, 200, 180, 100, 50, 30, 20, 15, 10],
      backgroundColor: "#42a5f5",
    },
  ],
};

const waterData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Water Level (m)",
      data: [1.5, 2.0, 3.5, 4.2],
      borderColor: "#ef4444",
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
        p: 2,
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

      <Grid container spacing={3}>
        {/* Risk Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, backgroundColor: "#1e293b" }}>
            <Typography variant="h6">Flood Risk Level</Typography>
            <Typography variant="h3" color="error">
              High
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, backgroundColor: "#1e293b" }}>
            <Typography variant="h6">Population Affected</Typography>
            <Typography variant="h3">12,345</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, backgroundColor: "#1e293b" }}>
            <Typography variant="h6">Probability Forecast</Typography>
            <Typography variant="h3">64%</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, backgroundColor: "#1e293b" }}>
            <Typography variant="h6">Active Alerts</Typography>
            <Typography variant="h3" color="warning">
              2
            </Typography>
          </Paper>
        </Grid>

        {/* Central Map */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: "600px", backgroundColor: "#1e293b" }}>
            <Typography variant="h6" gutterBottom>
              Northern Namibia Risk Map
            </Typography>
            <LeafletMap />
          </Paper>
        </Grid>

        {/* Globe & Alerts */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{ p: 2, height: "300px", mb: 3, backgroundColor: "#1e293b" }}
          >
            <Typography variant="h6" gutterBottom>
              Globe View
            </Typography>
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
              <Typography>Globe Integration (react-globe.gl coming)</Typography>
            </Box>
          </Paper>
          <Paper sx={{ p: 2, backgroundColor: "#dc2626" }}>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <WarningIcon /> Emergency Alerts
            </Typography>
            <Typography>
              Heavy rainfall expected in Oshana – stay safe!
            </Typography>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, backgroundColor: "#1e293b" }}>
            <Typography variant="h6">Precipitation Level</Typography>
            <Bar
              data={precipData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, backgroundColor: "#1e293b" }}>
            <Typography variant="h6">Water Levels</Typography>
            <Line data={waterData} options={{ responsive: true }} />
          </Card>
        </Grid>

        {/* Generate Report */}
        <Grid item xs={12} textAlign="center">
          <Button
            variant="contained"
            size="large"
            color="error"
            sx={{ px: 8, py: 2, fontSize: "1.2rem" }}
          >
            Generate Report
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
