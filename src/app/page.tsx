// src/app/page.tsx
"use client";

import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import PublicIcon from "@mui/icons-material/Public";
import WarningIcon from "@mui/icons-material/Warning";

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
              sx={{
                backgroundColor: "white",
                color: "#1976d2",
                "&:hover": { backgroundColor: "#f0f0f0" },
                minWidth: 200,
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
                minWidth: 200,
              }}
            >
              Globe View
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<WarningIcon />}
              color="error"
              sx={{ minWidth: 200 }}
            >
              Emergency Alerts
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Bottom Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
          Advanced Flood Risk Management
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 8, maxWidth: "800px", mx: "auto" }}
        >
          Leveraging cutting-edge GIS technology and real-time data to protect
          communities in Northern Namibia from flood disasters.
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
          <Box>
            <Typography sx={{ fontSize: 80 }}>🗺️</Typography>
            <Typography variant="h6" gutterBottom>
              Real-Time Mapping
            </Typography>
            <Typography color="text.secondary">
              Live flood zones and safe areas
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 80 }}>🌍</Typography>
            <Typography variant="h6" gutterBottom>
              Global Context
            </Typography>
            <Typography color="text.secondary">
              Satellite and 3D views
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 80 }}>🚨</Typography>
            <Typography variant="h6" gutterBottom>
              Early Warnings
            </Typography>
            <Typography color="text.secondary">SMS and app alerts</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
