"use client";

import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import MapStyleSelector from "./MapStyleSelector";

export default function FloodMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const animationRef = useRef<number | null>(null);

  const [showRivers, setShowRivers] = useState(true);
  const [showHighGround, setShowHighGround] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [safeZones, setSafeZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMapStyle, setCurrentMapStyle] = useState("mapbox://styles/mapbox/satellite-streets-v12");
  const [isSpinning, setIsSpinning] = useState(false);
  const [isGlobeView, setIsGlobeView] = useState(false);

  // Fetch safe zones data
  useEffect(() => {
    fetch("/api/safe-zones")
      .then(res => res.json())
      .then(data => {
        setSafeZones(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch safe zones:", error);
        setLoading(false);
      });
  }, []);

  const handleStyleChange = (newStyle: string) => {
    setCurrentMapStyle(newStyle);
    if (mapRef.current) {
      mapRef.current.setStyle(newStyle);
    }
  };

  // Globe spinning animation
  const startSpinning = () => {
    if (!mapRef.current || isSpinning) return;

    setIsSpinning(true);
    const spin = () => {
      if (!mapRef.current) return;

      const bearing = mapRef.current.getBearing() + 0.5;
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

  // Fly to specific locations
  const flyToLocation = (lng: number, lat: number, zoom: number = 10) => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: zoom,
      duration: 2000,
      essential: true
    });
  };

  // Toggle globe/flat view
  const toggleGlobeView = () => {
    if (!mapRef.current) return;

    const newProjection = isGlobeView ? 'mercator' : 'globe';
    mapRef.current.setProjection(newProjection);
    setIsGlobeView(!isGlobeView);

    if (!isGlobeView) {
      // Switch to globe view
      mapRef.current.setZoom(1);
      mapRef.current.setCenter([0, 0]);
    } else {
      // Switch back to flat view
      mapRef.current.setZoom(5);
      mapRef.current.setCenter([17.5, -18.0]);
    }
  };

  // Animate route (example: flood monitoring path)
  const animateRoute = () => {
    if (!mapRef.current) return;

    const route = [
      { lng: 14.5, lat: -17.5 }, // Rundu
      { lng: 16.5, lat: -17.8 }, // Oshakati
      { lng: 18.5, lat: -17.2 }, // Ondangwa
      { lng: 17.0, lat: -18.5 }, // Windhoek area
    ];

    let index = 0;
    const animate = () => {
      if (index >= route.length) return;

      const point = route[index];
      flyToLocation(point.lng, point.lat, 8);

      index++;
      setTimeout(animate, 3000); // 3 seconds between points
    };

    animate();
  };

  useEffect(() => {
    if (!mapContainer.current || loading) return;

    // Set Mapbox access token
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: currentMapStyle,
      center: [17.5, -18.0],
      zoom: 5,
      projection: 'mercator', // Start with flat map
      pitch: 0,
      bearing: 0,
      antialias: true,
    });

    mapRef.current = map;

    // Add essential controls
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(new mapboxgl.ScaleControl(), "bottom-left");
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");

    // Add geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
      placeholder: "Search for places in Namibia...",
      countries: "na", // Namibia
      limit: 5
    });
    map.addControl(geocoder, "top-left");

    map.on("load", () => {
      // River flood buffers
      map.addSource("riverFloodBuffers", {
        type: "geojson",
        data: "/data/river_flood_buffers.geojson",
      });

      map.addLayer({
        id: "river-fill",
        type: "fill",
        source: "riverFloodBuffers",
        paint: {
          "fill-color": "#0284c7",
          "fill-opacity": showRivers ? 0.35 : 0,
        },
      });

      map.addLayer({
        id: "river-outline",
        type: "line",
        source: "riverFloodBuffers",
        paint: {
          "line-color": "#075985",
          "line-width": 2,
        },
        layout: {
          visibility: showRivers ? "visible" : "none"
        }
      });

      // High ground areas
      map.addSource("highGround", {
        type: "geojson",
        data: "/data/high_ground_elevation.geojson",
      });

      map.addLayer({
        id: "high-ground-fill",
        type: "fill",
        source: "highGround",
        paint: {
          "fill-color": "#16a34a",
          "fill-opacity": showHighGround ? 0.35 : 0,
        },
      });

      map.addLayer({
        id: "high-ground-outline",
        type: "line",
        source: "highGround",
        paint: {
          "line-color": "#166534",
          "line-width": 2,
        },
        layout: {
          visibility: showHighGround ? "visible" : "none"
        }
      });

      // Safe zones markers
      if (safeZones.length > 0) {
        map.addSource("safeZones", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: safeZones.map((zone) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [zone.longitude, zone.latitude],
              },
              properties: zone,
            })),
          },
        });

        // Add markers for safe zones
        safeZones.forEach((zone) => {
          const marker = new mapboxgl.Marker({ color: "#16a34a" })
            .setLngLat([zone.longitude, zone.latitude])
            .addTo(map);

          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="font-family: 'Inter', sans-serif; max-width: 200px; line-height: 1.5;">
              <h4 style="margin: 0 0 8px 0; color: #16a34a; font-size: 1.1rem; font-weight: 600;">${zone.name}</h4>
              <p style="margin: 0 0 4px 0; font-size: 0.9rem; color: #374151;"><strong>Capacity:</strong> ${zone.capacity} people</p>
              <p style="margin: 0; font-size: 0.8rem; color: #6b7280;">🏫 Safe evacuation zone</p>
            </div>`
          );

          marker.setPopup(popup);
        });
      }

      // Add heatmap layer for flood risk visualization
      map.addSource("floodHeatmap", {
        type: "geojson",
        data: "/data/flood_zones.geojson",
      });

      map.addLayer({
        id: "flood-heatmap",
        type: "heatmap",
        source: "floodHeatmap",
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
            0, 1,
            9, 3
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
            0, 2,
            9, 20
          ],
          "heatmap-opacity": showHeatmap ? 0.7 : 0,
        },
      });

      // Namibia major rivers
      map.addSource("namibiaRivers", {
        type: "geojson",
        data: "/data/namibia/major_rivers.geojson",
      });

      map.addLayer({
        id: "namibia-rivers",
        type: "line",
        source: "namibiaRivers",
        paint: {
          "line-color": "#0066cc",
          "line-width": 3
        },
        layout: {
          visibility: showRivers ? "visible" : "none"
        }
      });

      // Namibia monitoring stations
      map.addSource("monitoringStations", {
        type: "geojson",
        data: "/data/namibia/monitoring_stations.geojson",
      });

      map.addLayer({
        id: "monitoring-stations",
        type: "circle",
        source: "monitoringStations",
        paint: {
          "circle-color": "#ff4444",
          "circle-radius": 6,
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2
        },
      });

      // Namibia population centers
      map.addSource("populationCenters", {
        type: "geojson",
        data: "/api/population-centers",
      });

      map.addLayer({
        id: "population-centers",
        type: "circle",
        source: "populationCenters",
        paint: {
          "circle-color": "#ff6b35",
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "population"],
            500, 4,
            10000, 8,
            50000, 12,
            100000, 16
          ],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
          "circle-opacity": 0.8
        },
      });

      // Add click handler for population centers
      map.on("click", "population-centers", (e) => {
        const features = e.features;
        if (!features || features.length === 0) return;

        const feature = features[0];
        const props = feature.properties;
        if (!props) return;

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="font-family: 'Inter', sans-serif; max-width: 200px; line-height: 1.5;">
              <h4 style="margin: 0 0 8px 0; color: #ff6b35; font-size: 1.1rem; font-weight: 600;">${props.city}</h4>
              <p style="margin: 0 0 4px 0; font-size: 0.9rem; color: #374151;"><strong>Population:</strong> ${props.population.toLocaleString()}</p>
              <p style="margin: 0 0 4px 0; font-size: 0.9rem; color: #374151;"><strong>Region:</strong> ${props.region}</p>
              <p style="margin: 0; font-size: 0.8rem; color: #6b7280;">🏙️ Population Center</p>
            </div>
          `)
          .addTo(map);
      });

      // Change cursor on hover
      map.on("mouseenter", "population-centers", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "population-centers", () => {
        map.getCanvas().style.cursor = "";
      });

      // Smooth entry animation
      map.easeTo({
        zoom: 6,
        duration: 2000,
      });
    });

    // Cleanup
    return () => {
      stopSpinning();
      map.remove();
    };
  }, [loading, safeZones, currentMapStyle]);

  // Update layer visibility
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setLayoutProperty(
      "river-fill",
      "visibility",
      showRivers ? "visible" : "none"
    );
    mapRef.current.setLayoutProperty(
      "river-outline",
      "visibility",
      showRivers ? "visible" : "none"
    );
    mapRef.current.setLayoutProperty(
      "namibia-rivers",
      "visibility",
      showRivers ? "visible" : "none"
    );
  }, [showRivers]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setLayoutProperty(
      "high-ground-fill",
      "visibility",
      showHighGround ? "visible" : "none"
    );
    mapRef.current.setLayoutProperty(
      "high-ground-outline",
      "visibility",
      showHighGround ? "visible" : "none"
    );
  }, [showHighGround]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setPaintProperty(
      "flood-heatmap",
      "heatmap-opacity",
      showHeatmap ? 0.7 : 0
    );
  }, [showHeatmap]);

  return (
    <div className="map-container">
      {/* Interactive Controls */}
      <div className="map-controls-panel">
        <div className="controls-grid">
          <MapStyleSelector
            currentStyle={currentMapStyle}
            onStyleChange={handleStyleChange}
          />

          <div className="control-group">
            <h4>🌍 View Controls</h4>
            <div className="control-buttons">
              <button
                onClick={toggleGlobeView}
                className={`control-btn ${isGlobeView ? 'active' : ''}`}
              >
                {isGlobeView ? '🌍 Flat Map' : '🌐 Globe View'}
              </button>
              <button
                onClick={isSpinning ? stopSpinning : startSpinning}
                className={`control-btn ${isSpinning ? 'active spinning' : ''}`}
              >
                {isSpinning ? '⏸️ Stop Spin' : '🔄 Spin Globe'}
              </button>
            </div>
          </div>

          <div className="control-group">
            <h4>🎯 Quick Locations</h4>
            <div className="control-buttons">
              <button onClick={() => flyToLocation(16.5, -17.8)} className="control-btn">
                🏙️ Oshakati
              </button>
              <button onClick={() => flyToLocation(17.1, -21.5)} className="control-btn">
                🏛️ Windhoek
              </button>
              <button onClick={() => flyToLocation(14.5, -17.5)} className="control-btn">
                🌊 Rundu
              </button>
            </div>
          </div>

          <div className="control-group">
            <h4>📊 Data Layers</h4>
            <div className="control-buttons">
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`control-btn ${showHeatmap ? 'active' : ''}`}
              >
                🔥 Flood Heatmap
              </button>
              <button
                onClick={() => setShowRivers(!showRivers)}
                className={`control-btn ${showRivers ? 'active' : ''}`}
              >
                🌊 Rivers
              </button>
              <button
                onClick={() => setShowHighGround(!showHighGround)}
                className={`control-btn ${showHighGround ? 'active' : ''}`}
              >
                ⛰️ High Ground
              </button>
            </div>
          </div>

          <div className="control-group">
            <h4>🎬 Animations</h4>
            <div className="control-buttons">
              <button onClick={animateRoute} className="control-btn">
                🚀 Monitor Route
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainer}
        className="map-viewport"
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden"
        }}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading flood data...</p>
          </div>
        </div>
      )}
    </div>
  );
}