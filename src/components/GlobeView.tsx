"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function GlobeView() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const animationRef = useRef<number | null>(null);

  const [isSpinning, setIsSpinning] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [0, 0],
      zoom: 1,
      projection: 'globe',
      pitch: 0,
      bearing: 0,
      antialias: true,
    });

    mapRef.current = map;

    map.on("load", () => {
      // Add atmosphere and fog for globe effect
      map.setFog({
        color: 'rgb(186, 210, 235)', // Lower atmosphere
        'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
        'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
        'space-color': 'rgb(11, 11, 25)', // Background color
        'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
      });

      // Add flood heatmap for global context
      map.addSource("globalFloodRisk", {
        type: "geojson",
        data: "/data/flood_zones.geojson",
      });

      map.addLayer({
        id: "global-flood-heatmap",
        type: "heatmap",
        source: "globalFloodRisk",
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "severity"],
            0, 0,
            5, 1
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0, 0.5,
            9, 2
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(33,102,172,0)",
            0.2, "rgb(103,169,207)",
            0.4, "rgb(209,229,240)",
            0.6, "rgb(253,219,199)",
            0.8, "rgb(239,138,98)",
            1, "rgb(178,24,43)"
          ],
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0, 1,
            9, 15
          ],
          "heatmap-opacity": showHeatmap ? 0.6 : 0,
        },
      });

      // Start spinning animation
      startSpinning();
    });

    return () => {
      stopSpinning();
      map.remove();
    };
  }, []);

  const startSpinning = () => {
    if (!mapRef.current || isSpinning) return;

    setIsSpinning(true);
    const spin = () => {
      if (!mapRef.current) return;

      const bearing = mapRef.current.getBearing() + 0.3;
      mapRef.current.setBearing(bearing);

      if (isSpinning) {
        animationRef.current = requestAnimationFrame(spin);
      }
    };
    spin();
  };

  const stopSpinning = () => {
    setIsSpinning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const flyToNamibia = () => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: [17.5, -18.0],
      zoom: 4,
      duration: 3000,
      essential: true
    });
  };

  const toggleHeatmap = () => {
    setShowHeatmap(!showHeatmap);
    if (mapRef.current) {
      mapRef.current.setPaintProperty(
        "global-flood-heatmap",
        "heatmap-opacity",
        showHeatmap ? 0 : 0.6
      );
    }
  };

  return (
    <div className="globe-container">
      {/* Globe Controls */}
      <div className="globe-controls">
        <div className="globe-controls-grid">
          <button
            onClick={isSpinning ? stopSpinning : startSpinning}
            className={`globe-btn ${isSpinning ? 'active' : ''}`}
          >
            {isSpinning ? '⏸️ Stop Rotation' : '🔄 Start Rotation'}
          </button>

          <button onClick={flyToNamibia} className="globe-btn">
            🇳🇦 Fly to Namibia
          </button>

          <button
            onClick={toggleHeatmap}
            className={`globe-btn ${showHeatmap ? 'active' : ''}`}
          >
            🔥 Global Flood Risk
          </button>
        </div>
      </div>

      {/* Globe Viewport */}
      <div
        ref={mapContainer}
        className="globe-viewport"
        style={{
          height: "100vh",
          width: "100%",
          background: "#000011"
        }}
      />

      {/* Info Overlay */}
      <div className="globe-info">
        <h2>🌍 Global Flood Awareness</h2>
        <p>Interactive 3D globe showing worldwide flood risk patterns</p>
        <div className="globe-stats">
          <div className="stat">
            <span className="stat-number">2011</span>
            <span className="stat-label">Major Namibia Floods</span>
          </div>
          <div className="stat">
            <span className="stat-number">6</span>
            <span className="stat-label">Satellite Images</span>
          </div>
          <div className="stat">
            <span className="stat-number">50k</span>
            <span className="stat-label">Map Loads/Month</span>
          </div>
        </div>
      </div>
    </div>
  );
}