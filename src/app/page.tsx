// src/app/page.tsx
'use client';

import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import LeafletMap from '@/components/LeafletMap'; // Your map component
import { Bar, Line } from 'react-chartjs-2';
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
} from 'chart.js';

// Register Chart.js components
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

// Fake data for charts (replace with real from Supabase/API)
const precipitationData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    { label: 'Precipitation (mm)', data: [50, 60, 120, 200, 180, 90], backgroundColor: '#0284c7' },
  ],
};

const waterLevelsData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  datasets: [
    {
      label: 'Water Level (m)',
      data: [1.2, 1.5, 2.3, 3.1, 2.8, 2.0],
      borderColor: '#ef4444',
      fill: false,
    },
  ],
};

export default function Dashboard() {
  return (
    <Box sx={{ p: 2, backgroundColor: '#1e3a8a', color: 'white', minHeight: '100vh' }}>
      <Grid container spacing={2}>
        {/* Header */}
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Flood Awareness GIS System <Typography variant="body1">Northern Namibia</Typography>
          </Typography>
        </Grid>

        {/* Risk Level & Population */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: '#3b82f6', color: 'white' }}>
            <Typography variant="h6">Flood Risk Level</Typography>
            <Typography variant="h4">High</Typography>
            <LinearProgress variant="determinate" value={80} color="error" sx={{ mt: 1 }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: '#3b82f6', color: 'white' }}>
            <Typography variant="h6">Population Affected</Typography>
            <Typography variant="h4">12,345</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: '#3b82f6', color: 'white' }}>
            <Typography variant="h6">Probability Forecast</Typography>
            <Typography variant="h4">64.0%</Typography>
            <LinearProgress variant="determinate" value={64} color="warning" sx={{ mt: 1 }} />
          </Paper>
        </Grid>

        {/* Map & Globe */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6">Flood Risk Map</Typography>
            <LeafletMap /> {/* Your interactive map */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6">Globe View</Typography>
            {/* Add globe component here, e.g., from react-globe.gl */}
            <div style={{ height: '100%', background: '#0f172a', borderRadius: '8px' }}>
              Globe Placeholder (Use react-globe.gl)
            </div>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Precipitation Level</Typography>
            <Bar data={precipitationData} options={{ responsive: true }} />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Water Levels</Typography>
            <Line data={waterLevelsData} options={{ responsive: true }} />
          </Card>
        </Grid>

        {/* Alerts & Report */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: '#ef4444', color: 'white' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon /> Emergency Alerts
            </Typography>
            <Typography>High flood risk in Oshana region. Evacuate low areas.</Typography>
            <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
              Generate Report
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
