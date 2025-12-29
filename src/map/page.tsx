import Link from "next/link";
import EnhancedFloodMap from "@/components/EnhancedFloodMap";
import FloodSeasonIndicator from "@/components/FloodSeasonIndicator";
import FloodRiskCard from "@/components/FloodRiskCard";
import EmergencyContacts from "@/components/EmergencyContacts";
import HistoricalSatelliteImages from "@/components/HistoricalSatelliteImages";

export default function MapPage() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <Link href="/" className="nav-link" style={{ background: 'transparent', border: 'none', padding: '0.5rem 1rem' }}>
              ← Back to Home
            </Link>
            <h1>🗺️ Flood Awareness GIS Dashboard</h1>
            <p className="header-subtitle">Northern Namibia Flood Risk Visualization & Emergency Response</p>
          </div>

          <div className="nav-links">
            <Link href="/alerts" className="nav-link">
              🚨 View Alerts
            </Link>
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="dashboard-container">
          <aside className="dashboard-sidebar">
            <FloodSeasonIndicator />
            <FloodRiskCard />
            <HistoricalSatelliteImages />
            <EmergencyContacts />
          </aside>

          <main className="dashboard-main">
            <EnhancedFloodMap />
          </main>
        </div>
      </div>
    </div>
  );
}
