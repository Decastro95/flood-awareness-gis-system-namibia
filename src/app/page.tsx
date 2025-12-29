// src/app/page.tsx
"use client";

import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
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
          py: { xs: 8, md: 12 },
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
          <Typography variant="h6" gutterBottom sx={{ mb: 6 }}>
            Interactive flood risk mapping and public awareness platform for
            Northern Namibia
          </Typography>

          <Box
            sx={{
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
              sx={{ minWidth: 220, backgroundColor: "white", color: "#1976d2" }}
            >
              View Interactive Map
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PublicIcon />}
              sx={{ minWidth: 220, borderColor: "white", color: "white" }}
            >
              Globe View
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<WarningIcon />}
              color="error"
              sx={{ minWidth: 220 }}
            >
              Emergency Alerts
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Map Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Interactive Flood Risk Map
        </Typography>
        <Box
          sx={{
            height: "600px",
            width: "100%",
            mt: 4,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 3,
          }}
        >
          <LeafletMap />
        </Box>
      </Container>

      {/* Features */}
      <Box sx={{ backgroundColor: "#f5f5f5", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom textAlign="center">
            Key Features
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              flexWrap: "wrap",
              mt: 6,
            }}
          >
            <Box sx={{ textAlign: "center", maxWidth: 300 }}>
              <Typography sx={{ fontSize: 80 }}>🗺️</Typography>
              <Typography variant="h6">Real-Time Mapping</Typography>
              <Typography color="text.secondary">
                Live flood zones, safe areas, trig points
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", maxWidth: 300 }}>
              <Typography sx={{ fontSize: 80 }}>🌧️</Typography>
              <Typography variant="h6">Rainfall Data</Typography>
              <Typography color="text.secondary">
                Current precipitation overlay
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", maxWidth: 300 }}>
              <Typography sx={{ fontSize: 80 }}>🚨</Typography>
              <Typography variant="h6">Early Warnings</Typography>
              <Typography color="text.secondary">
                SMS alerts and emergency notifications
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
