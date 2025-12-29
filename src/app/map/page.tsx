import Link from "next/link";
import FloodMap from "@/components/EnhancedFloodMap";

export default function MapPage() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <Link href="/" className="nav-link" style={{ background: 'transparent', border: 'none', padding: '0.5rem 1rem' }}>
              ← Back to Home
            </Link>
            <h1>🗺️ Interactive Flood Risk Map</h1>
            <p className="header-subtitle">Advanced GIS mapping with real-time flood monitoring and safe zone identification</p>
          </div>

          <div className="nav-links">
            <Link href="/globe" className="nav-link">
              🌍 Globe View
            </Link>
            <Link href="/alerts" className="nav-link">
              🚨 Alerts
            </Link>
          </div>
        </div>
      </header>

      <main className="main-content">
        <FloodMap />
      </main>
    </div>
  );
}