"use client";

import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
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
    },
  ],
};

export default function Dashboard() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0f172a", color: "white", p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Flood Awareness GIS System – Northern Namibia
      </Typography>

      <Grid container spacing={3}>
        {/* Risk Cards */}
        {[
          ["Flood Risk Level", "High", "error.main"],
          ["Population Affected", "12,345"],
          ["Probability Forecast", "64%"],
          ["Active Alerts", "2", "warning.main"],
        ].map(([title, value, color], i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper sx={{ p: 3, bgcolor: "#1e293b", textAlign: "center" }}>
              <Typography variant="h6">{title}</Typography>
              <Typography variant="h3" color={color}>
                {value}
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* Map */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 600, bgcolor: "#1e293b" }}>
            <Typography variant="h6">Northern Namibia Risk Map</Typography>
            <LeafletMap />
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 3, height: 300, bgcolor: "#1e293b" }}>
            <Typography variant="h6">Globe View</Typography>
            <Box
              sx={{
                height: "100%",
                bgcolor: "#334155",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>Coming Soon</Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 2, bgcolor: "#dc2626" }}>
            <Typography sx={{ display: "flex", gap: 1 }}>
              <WarningIcon /> Emergency Alerts
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Heavy rain in Oshana – evacuate low areas.
            </Typography>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: "#1e293b" }}>
            <Typography variant="h6">Precipitation</Typography>
            <Bar data={precipData} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: "#1e293b" }}>
            <Typography variant="h6">Water Levels</Typography>
            <Line data={waterData} />
          </Paper>
        </Grid>

        {/* Report */}
        <Grid item xs={12} textAlign="center">
          <Button variant="contained" color="error" size="large">
            Generate Report
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
