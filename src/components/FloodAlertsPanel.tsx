// src/components/FloodAlertsPanel.tsx
"use client";

import { useState, useEffect } from "react";
import { Alert, AlertTitle } from "@mui/material";
import { Box, Typography } from "@mui/material";

type AlertItem = {
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  date: string;
};

export default function FloodAlertsPanel() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      const newAlerts: AlertItem[] = [];

      try {
        // 1. GDACS RSS Feed (Global Disaster Alert and Coordination System)
        const proxyUrl = "https://api.allorigins.win/get?url=";
        const gdacsUrl = encodeURIComponent("https://gdacs.org/xml/gdacs.rss");
        const rssResponse = await fetch(proxyUrl + gdacsUrl);
        const rssData = await rssResponse.json();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rssData.contents, "text/xml");
        const items = xmlDoc.querySelectorAll("item");

        items.forEach((item) => {
          const title = item.querySelector("title")?.textContent || "";
          const description =
            item.querySelector("description")?.textContent || "";
          const pubDate = item.querySelector("pubDate")?.textContent || "";

          // Filter for Namibia or flood-related events
          if (
            title.toLowerCase().includes("namibia") ||
            description.toLowerCase().includes("namibia") ||
            title.toLowerCase().includes("flood")
          ) {
            let severity: "low" | "medium" | "high" = "low";
            if (title.includes("Red") || description.includes("Red"))
              severity = "high";
            else if (title.includes("Orange") || description.includes("Orange"))
              severity = "medium";

            newAlerts.push({
              title,
              description,
              severity,
              date: new Date(pubDate).toLocaleString(),
            });
          }
        });
      } catch (err) {
        console.error("GDACS fetch error:", err);
      }

      try {
        // 2. Open-Meteo Flood API (river discharge for Cuvelai Basin near Oshakati)
        const floodResponse = await fetch(
          "https://flood-api.open-meteo.com/v1/flood?latitude=-17.78&longitude=15.7&daily=river_discharge"
        );
        const floodData = await floodResponse.json();

        const dischargeValues = floodData.daily?.river_discharge || [];
        const maxDischarge = Math.max(
          ...dischargeValues.filter((v: number) => v !== null)
        );

        if (maxDischarge > 300) {
          // Arbitrary threshold – adjust based on local data
          newAlerts.unshift({
            title: "High River Discharge Warning",
            description: `Cuvelai Basin river discharge forecast to reach ${maxDischarge.toFixed(0)} m³/s in coming days – high flood risk.`,
            severity: maxDischarge > 500 ? "high" : "medium",
            date: new Date().toLocaleDateString(),
          });
        }
      } catch (err) {
        console.error("Open-Meteo flood API error:", err);
      }

      // Fallback if no alerts
      if (newAlerts.length === 0) {
        newAlerts.push({
          title: "No Active Alerts",
          description: "No current flood warnings for Northern Namibia.",
          severity: "low",
          date: new Date().toLocaleDateString(),
        });
      }

      setAlerts(newAlerts);
      setLoading(false);
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10 * 60 * 1000); // Refresh every 10 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading real-time alerts...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxHeight: "500px", overflowY: "auto", p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Real-Time Flood Alerts
      </Typography>

      {alerts.map((alert, index) => (
        <Alert
          key={index}
          severity={
            alert.severity === "high"
              ? "error"
              : alert.severity === "medium"
                ? "warning"
                : "info"
          }
          sx={{ mb: 2 }}
        >
          <AlertTitle>{alert.title}</AlertTitle>
          <Typography variant="body2">{alert.description}</Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {alert.date}
          </Typography>
        </Alert>
      ))}
    </Box>
  );
}
