import Link from "next/link";
import GlobeView from "@/components/GlobeView";

export default function GlobePage() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <Link href="/" className="nav-link" style={{ background: 'transparent', border: 'none', padding: '0.5rem 1rem' }}>
              ← Back to Home
            </Link>
            <h1>🌍 Global Flood Awareness Globe</h1>
            <p className="header-subtitle">Interactive 3D visualization of worldwide flood risk patterns</p>
          </div>

          <div className="nav-links">
            <Link href="/map" className="nav-link">
              🗺️ Dashboard
            </Link>
            <Link href="/alerts" className="nav-link">
              🚨 Alerts
            </Link>
          </div>
        </div>
      </header>

      <GlobeView />
    </div>
  );
}