// Updated Dashboard component (client-safe).
// Key changes:
// - Dynamic import of mapbox-gl inside useEffect to avoid SSR issues.
// - Uses NEXT_PUBLIC_ env vars for Mapbox and Supabase (client-safe).
// - Fetches flood zones from Supabase and updates map source when ready.
// - Calls server-side /api/grok instead of calling Grok directly from client.
// - Uses ResponsiveContainer for charts for better layout in Codespaces.

import React, { useState, useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css'; // If SSR errors occur, move this import into the client-only block.
import { LineChart, BarChart, PieChart, Line, Bar, Pie, Tooltip, Legend, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AppBar, Toolbar, List, ListItem, ListItemIcon, ListItemText, Typography, IconButton, Slider, Alert, Box, Grid, TextField, Button } from '@mui/material';
import { Map as MapIcon, Public as GlobeIcon, Warning as AlertIcon, Cloud as WeatherIcon, Send as SendIcon } from '@mui/icons-material';
import supabase from '../lib/supabaseClient';
import FloodAlertsPanel from '@/components/FloodAlertsPanel';
import RealTimeAlerts from '@/components/RealTimeAlerts';

<RealTimeAlerts />
// In return JSX (e.g., right sidebar)
<FloodAlertsPanel />
const Dashboard = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [globeMode, setGlobeMode] = useState(false);
  const [riskLevel, setRiskLevel] = useState(50);
  const [weatherData, setWeatherData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [floodZones, setFloodZones] = useState(null);

  // Grok UI state
  const [grokQuery, setGrokQuery] = useState('');
  const [grokResponse, setGrokResponse] = useState('');
  const [grokLoading, setGrokLoading] = useState(false);

  // Use client-exposed Mapbox token env var
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    // Load flood zones from Supabase (assumes geometry stored as GeoJSON string)
    let cancelled = false;
    const fetchFloodZones = async () => {
      try {
        const { data, error } = await supabase.from('flood_zones').select('id, geometry, properties'); // adjust column names if different
        if (error) {
          console.error('Supabase Error:', error);
          setAlerts(prev => [...prev, { severity: 'error', message: 'Failed to load flood zones' }]);
          return;
        }
        const features = (data || []).map((d) => {
          const geom = typeof d.geometry === 'string' ? JSON.parse(d.geometry) : d.geometry;
          const props = d.properties || {};
          return {
            type: 'Feature',
            geometry: geom,
            properties: { ...props, id: d.id },
          };
        });
        if (!cancelled) setFloodZones({ type: 'FeatureCollection', features });
      } catch (err) {
        console.error('fetchFloodZones err', err);
      }
    };
    fetchFloodZones();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    // Initialize Mapbox after component mounts (client-only)
    let mapboxgl;
    let mapInstance;
    let mounted = true;
    (async () => {
      try {
        // dynamic import avoids importing on server
        mapboxgl = (await import('mapbox-gl')).default;
        mapboxgl.accessToken = MAPBOX_TOKEN || '';

        mapInstance = new mapboxgl.Map({
          container: mapRef.current,
          style: 'mapbox://styles/mapbox/satellite-streets-v12',
          center: [16.5, -18],
          zoom: 6,
          projection: globeMode ? 'globe' : 'mercator',
        });

        mapInstance.on('load', () => {
          if (!mapInstance.getSource('mapbox-dem')) {
            mapInstance.addSource('mapbox-dem', {
              type: 'raster-dem',
              url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
              tileSize: 512,
              maxzoom: 14,
            });
            try {
              mapInstance.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
            } catch (e) {
              console.warn('Could not set terrain (style may not support):', e);
            }
          }

          // Add flood zones source/layer if we already fetched them
          if (floodZones && !mapInstance.getSource('flood-zones')) {
            mapInstance.addSource('flood-zones', { type: 'geojson', data: floodZones });
            mapInstance.addLayer({
              id: 'flood-layer',
              type: 'fill',
              source: 'flood-zones',
              paint: {
                'fill-color': ['coalesce', ['get', 'risk_color'], '#ff0000'],
                'fill-opacity': 0.45,
              },
            });
          }
        });

        mapInstanceRef.current = mapInstance;
      } catch (err) {
        console.error('Mapbox init error', err);
      }
    })();

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.remove(); } catch (e) { /* ignore */ }
        mapInstanceRef.current = null;
      }
    };
  }, [globeMode, MAPBOX_TOKEN]); // re-init when globeMode changes

  // Update flood zones source if map exists and floodZones updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !floodZones) return;
    if (map.getSource && map.getSource('flood-zones')) {
      map.getSource('flood-zones').setData(floodZones);
    } else {
      try {
        map.addSource('flood-zones', { type: 'geojson', data: floodZones });
        map.addLayer({
          id: 'flood-layer',
          type: 'fill',
          source: 'flood-zones',
          paint: {
            'fill-color': ['coalesce', ['get', 'risk_color'], '#ff0000'],
            'fill-opacity': 0.45,
          },
        });
      } catch (e) {
        console.warn('Could not add flood layer', e);
      }
    }
  }, [floodZones]);

  // Fetch a simple weather snapshot (serverless or public API)
  useEffect(() => {
    const OPENWEATHER_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!OPENWEATHER_KEY) return;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=-18&lon=16.5&appid=${OPENWEATHER_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        if (!data?.main) return;
        setWeatherData([{ name: 'Current', temp: data.main.temp, humidity: data.main.humidity, rain: data.rain?.['1h'] || 0 }]);
      })
      .catch(err => console.warn('OpenWeather error', err));
  }, []);

  const rainfallData = [
    { month: 'Jan', rainfall: 120 },
    { month: 'Feb', rainfall: 180 },
    { month: 'Mar', rainfall: 200 },
  ];

  const riskDistribution = [
    { name: 'High Risk', value: 30, fill: '#EF4444' },
    { name: 'Medium Risk', value: 40, fill: '#FBBF24' },
    { name: 'Low Risk', value: 30, fill: '#10B981' },
  ];

  // Query Grok via server API
  const queryGrok = async () => {
    if (!grokQuery) return;
    setGrokLoading(true);
    setGrokResponse('');
    try {
      const resp = await fetch('/api/grok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: grokQuery }),
      });
      const json = await resp.json();
      if (json.error) {
        setGrokResponse(`Error: ${json.error}${json.details ? ` — ${JSON.stringify(json.details)}` : ''}`);
      } else {
        setGrokResponse(typeof json.response === 'string' ? json.response : JSON.stringify(json.response, null, 2));
      }
    } catch (err) {
      console.error('Grok request failed', err);
      setGrokResponse('Request failed');
    } finally {
      setGrokLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white">
      <AppBar position="static" sx={{ backgroundColor: '#1E3A8A' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Flood Awareness GIS System - Northern Namibia</Typography>
          <IconButton color="inherit" onClick={() => setGlobeMode(!globeMode)} aria-label="toggle globe">
            <GlobeIcon />
          </IconButton>
          <IconButton color="inherit"><WeatherIcon /></IconButton>
        </Toolbar>
      </AppBar>

      <Grid container sx={{ flex: 1, overflow: 'hidden' }}>
        <Grid item xs={3} sx={{ backgroundColor: '#1E3A8A', p: 2, overflowY: 'auto' }}>
          <List>
            <ListItem button>
              <ListItemIcon sx={{ color: 'white' }}><MapIcon /></ListItemIcon>
              <ListItemText primary="Interactive Map" />
            </ListItem>
            <ListItem button>
              <ListItemIcon sx={{ color: 'white' }}><AlertIcon /></ListItemIcon>
              <ListItemText primary="Alerts" />
            </ListItem>
          </List>

          <Box sx={{ mt: 2 }}>
            <Typography>Risk Forecast Slider</Typography>
            <Slider value={riskLevel} onChange={(e, v) => setRiskLevel(v)} min={0} max={100} valueLabelDisplay="auto" />
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1">Risk Distribution</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" cx="50%" cy="50%" outerRadius={60} label />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <div id="map-container" ref={mapRef} style={{ width: '100%', height: '100%' }} />
        </Grid>

        <Grid item xs={3} sx={{ backgroundColor: '#1E3A8A', p: 2, overflowY: 'auto' }}>
          <Typography variant="h6">Real-Time Weather & Metrics</Typography>
          <Box sx={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temp" stroke="#10B981" name="Temperature (°C)" />
                <Line type="monotone" dataKey="rain" stroke="#3B82F6" name="Rainfall (mm)" />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ mt: 2, height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rainfallData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rainfall" fill="#EF4444" name="Monthly Rainfall" />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">AI Assistant (Grok)</Typography>
            <TextField
              value={grokQuery}
              onChange={(e) => setGrokQuery(e.target.value)}
              placeholder="Ask about floods..."
              fullWidth
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 1 }}
            />
            <Button onClick={queryGrok} variant="contained" startIcon={<SendIcon />} sx={{ mt: 1 }}>
              {grokLoading ? 'Asking...' : 'Ask Grok'}
            </Button>
            {grokResponse && <Alert severity="info" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>{grokResponse}</Alert>}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Active Alerts</Typography>
            {alerts.map((alert, i) => (
              <Alert key={i} severity={alert.severity} sx={{ mt: 1 }}>{alert.message}</Alert>
            ))}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
