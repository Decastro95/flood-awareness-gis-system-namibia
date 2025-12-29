"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FloodSeasonIndicator from "@/components/FloodSeasonIndicator";
import EmergencyContacts from "@/components/EmergencyContacts";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/alerts")
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch alerts:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <Link
          href="/"
          style={{
            color: "#0f4c81",
            textDecoration: "none",
            fontSize: "0.9rem",
            marginBottom: "1rem",
            display: "inline-block"
          }}
        >
          ← Back to Home
        </Link>
        <h1 style={{ color: "#0f4c81", marginBottom: "0.5rem" }}>
          🚨 Flood Alerts & Rainfall Monitoring
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#666" }}>
          Early warning information for flood preparedness in Northern Namibia
        </p>
      </header>

      <FloodSeasonIndicator />

      <main style={{ margin: "2rem 0" }}>
        {loading ? (
          <p>Loading alerts...</p>
        ) : alerts.length === 0 ? (
          <div style={{
            padding: "2rem",
            background: "#f8f9fa",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <p>No active flood alerts at this time.</p>
            <p style={{ color: "#666", marginTop: "0.5rem" }}>
              The system continuously monitors weather conditions and will display alerts when necessary.
            </p>
          </div>
        ) : (
          alerts.map(alert => (
            <div
              key={alert.id}
              style={{
                background: "#ffffff",
                borderLeft: `6px solid ${
                  alert.alert_level === "High"
                    ? "#dc2626"
                    : alert.alert_level === "Moderate"
                    ? "#f59e0b"
                    : "#16a34a"
                }`,
                padding: "1.5rem",
                marginBottom: "1rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                borderRadius: "4px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, color: "#0f4c81" }}>
                  {alert.region} Region
                </h3>
                <span style={{
                  background: alert.alert_level === "High" ? "#fee2e2" : alert.alert_level === "Moderate" ? "#fef3c7" : "#d1fae5",
                  color: alert.alert_level === "High" ? "#dc2626" : alert.alert_level === "Moderate" ? "#f59e0b" : "#16a34a",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  fontWeight: "bold"
                }}>
                  {alert.alert_level} Risk
                </span>
              </div>

              {alert.priority === "High" && (
                <div style={{
                  background: "#7c2d12",
                  color: "white",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                  fontWeight: "bold"
                }}>
                  ⚠️ High Population Exposure Area
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <strong>Rainfall:</strong> {alert.rainfall_mm} mm
                </div>
                <div>
                  <strong>Reported:</strong> {new Date(alert.created_at).toLocaleString()}
                </div>
              </div>

              <p style={{ margin: 0, lineHeight: "1.5" }}>{alert.message}</p>
            </div>
          ))
        )}
      </main>

      <EmergencyContacts />

      <footer style={{
        marginTop: "3rem",
        padding: "1rem",
        borderTop: "1px solid #e5e7eb",
        textAlign: "center",
        color: "#666",
        fontSize: "0.9rem"
      }}>
        <p>
          <em>Alerts are updated regularly. For emergency situations, contact local authorities immediately.</em>
        </p>
      </footer>
    </div>
  );
}
