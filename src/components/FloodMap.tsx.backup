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
  const [showHistoricalFloods, setShowHistoricalFloods] = useState(false);
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
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
      placeholder: "Search for places in Namibia...",
      countries: "na", // Namibia
      limit: 5
    });
    map.addControl(geocoder, "top-left");

    // Add scale control
    map.addControl(new mapboxgl.ScaleControl(), "bottom-left");

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
          "fill-opacity": 0.35,
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
          "fill-opacity": 0.35,
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
      });

      // Safe zones markers
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

      // Historical floods overlay
      map.addSource("historicalFloods", {
        type: "image",
        url: "/satellite-images/historical-floods-2011/radarsat-flooding-northern-namibia-2011-03-24.jpg",
        coordinates: [
          [14.0, -19.0], // sw
          [17.0, -19.0], // se
          [17.0, -17.0], // ne
          [14.0, -17.0]  // nw
        ]
      });

      map.addLayer({
        id: "historical-floods",
        type: "raster",
        source: "historicalFloods",
        layout: {
          visibility: "none"
        },
        paint: {
          "raster-opacity": 0.7
        }
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

    // Cleanup
    return () => map.remove();
  }, [loading, safeZones, currentMapStyle]);

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
    mapRef.current.setLayoutProperty(
      "historical-floods",
      "visibility",
      showHistoricalFloods ? "visible" : "none"
    );
  }, [showHistoricalFloods]);

  return (
    <div className="map-container">
      {/* Map Controls */}
      <div className="map-controls">
        <MapStyleSelector
          currentStyle={currentMapStyle}
          onStyleChange={handleStyleChange}
        />

        <div className="control-group">
          <div className="control-title">
            <span>🎛️</span>
            Layers
          </div>

          <div className="control-option">
            <input
              type="checkbox"
              id="rivers"
              checked={showRivers}
              onChange={() => setShowRivers(!showRivers)}
            />
            <label htmlFor="rivers">🌊 River Flood Buffers</label>
          </div>

          <div className="control-option">
            <input
              type="checkbox"
              id="highground"
              checked={showHighGround}
              onChange={() => setShowHighGround(!showHighGround)}
            />
            <label htmlFor="highground">🏔️ High-Ground Safe Areas</label>
          </div>

          <div className="control-option">
            <input
              type="checkbox"
              id="safezones"
              checked={showSafeZones}
              onChange={() => setShowSafeZones(!showSafeZones)}
            />
            <label htmlFor="safezones">🏫 Safe Zone Markers ({safeZones.length})</label>
          </div>

          <div className="control-option">
            <input
              type="checkbox"
              id="historicalfloods"
              checked={showHistoricalFloods}
              onChange={() => setShowHistoricalFloods(!showHistoricalFloods)}
            />
            <label htmlFor="historicalfloods">📜 Historical Floods (2011)</label>
          </div>
        </div>
      </div>

      {/* Map */}
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      {/* Legend */}
      <div className="map-legend">
        <div className="legend-title">📊 Map Legend</div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "#0284c7", opacity: 0.7 }}></div>
          <span>River Flood Risk Areas</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "#16a34a", opacity: 0.7 }}></div>
          <span>High Ground Safe Areas</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "#16a34a", borderRadius: "50%" }}></div>
          <span>Safe Zone Shelters</span>
        </div>
        <div className="text-center mt-2">
          <small style={{ color: "#6b7280", fontSize: "0.75rem" }}>
            Click markers for shelter details
          </small>
        </div>
      </div>
    </div>
  );
}
