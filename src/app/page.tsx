// src/app/page.tsx
"use client";

import React from "react";
import { Box, Container, Typography, Button, Paper, Grid } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import PublicIcon from "@mui/icons-material/Public";
import WarningIcon from "@mui/icons-material/Warning";
import LeafletMap from "@/components/LeafletMap";

export default function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          py: 12,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Flood Awareness GIS System
          </Typography>
          <Typography variant="h6" gutterBottom>
            Interactive flood risk mapping and public awareness platform for
            Northern Namibia
          </Typography>

          <Box
            sx={{
              mt: 6,
              display: "flex",
              gap: 3,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<MapIcon />}
              sx={{
                backgroundColor: "white",
                color: "#1976d2",
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              View Interactive Map
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PublicIcon />}
              sx={{
                borderColor: "white",
                color: "white",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Globe View
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<WarningIcon />}
              color="error"
            >
              Emergency Alerts
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          gutterBottom
          fontWeight="bold"
        >
          Advanced Flood Risk Management
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 8, maxWidth: "800px", mx: "auto" }}
        >
          Leveraging cutting-edge GIS technology and real-time data to protect
          communities in Northern Namibia from flood disasters.
        </Typography>

        {/* Map Section */}
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4, mb: 8 }}>
          <Typography variant="h5" gutterBottom>
            Interactive Flood Risk Map
          </Typography>
          <Box
            sx={{
              height: "600px",
              width: "100%",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <LeafletMap />
          </Box>
        </Paper>

        {/* Feature Icons */}
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} sm={4} textAlign="center">
            <Box sx={{ fontSize: 80 }}>🗺️</Box>
            <Typography variant="h6" gutterBottom>
              Real-Time Mapping
            </Typography>
            <Typography color="text.secondary">
              Live flood zones and safe areas
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} textAlign="center">
            <Box sx={{ fontSize: 80 }}>🌍</Box>
            <Typography variant="h6" gutterBottom>
              Global Context
            </Typography>
            <Typography color="text.secondary">
              Satellite and 3D views
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} textAlign="center">
            <Box sx={{ fontSize: 80 }}>🚨</Box>
            <Typography variant="h6" gutterBottom>
              Early Warnings
            </Typography>
            <Typography color="text.secondary">SMS and app alerts</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
