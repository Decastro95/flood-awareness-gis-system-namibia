// src/components/LeafletMap.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {
  Drawer,
  IconButton,
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Switch,
  FormControlLabel,
  Paper,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import WarningIcon from '@mui/icons-material/Warning';

import { createClient } from '@supabase/supabase-js';

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CommunityPhoto {
  id: string;
  url: string;
  description: string;
  location?: { lat: number; lng: number };
  timestamp: string;
  approved: boolean;
}

interface WeatherAlert {
  event: string;
  description: string;
  start: number;
  end: number;
  sender_name: string;
}

export default function LeafletMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const photoMarkers = useRef<L.Marker[]>([]);
  const precipitationLayer = useRef<L.TileLayer | null>(null);

  // State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [communityPhotos, setCommunityPhotos] = useState<CommunityPhoto[]>([]);
  const [showRainfall, setShowRainfall] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [alertLoading, setAlertLoading] = useState(true);

  // Admin & SMS
  const [isAdmin] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertRegion, setAlertRegion] = useState('all');
  const [sending, setSending] = useState(false);
  const [alertStatus, setAlertStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Fetch community photos
  useEffect(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from('community_reports')
        .select('*')
        .eq('approved', true)
        .order('timestamp', { ascending: false });
      if (data) setCommunityPhotos(data);
    };
    fetchPhotos();
  }, []);

  // Fetch weather alerts (every 10 minutes)
  useEffect(() => {
    const fetchAlerts = async () => {
      const apiKey = process.env.NEXT_PUBLIC_OWM_API_KEY;
      if (!apiKey) {
        console.warn('Add NEXT_PUBLIC_OWM_API_KEY for weather alerts');
        setAlertLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=-17.78&lon=15.95&exclude=minutely,hourly,daily,current&appid=${apiKey}`
        );
        const data = await res.json();
        setWeatherAlerts(data.alerts || []);
      } catch (err) {
        console.error('Weather alerts error:', err);
      }
      setAlertLoading(false);
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10 * 60 * 1000); // Every 10 min
    return () => clearInterval(interval);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current).setView([-17.8, 16.0], 9);

    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map.current);

    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: 'Tiles &copy; Esri' }
    );

    // Rainfall layer
    const apiKey = process.env.NEXT_PUBLIC_OWM_API_KEY;
    if (apiKey) {
      precipitationLayer.current = L.tileLayer(
        `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`,
        { attribution: 'Rainfall &copy; OpenWeatherMap', opacity: 0.6 }
      );
      if (showRainfall) precipitationLayer.current.addTo(map.current);
    }

    // Flood zones
    fetch('/data/flood_zones.geojson')
      .then((res) => (res.ok ? res.json() : null))
      .then((geojson) => {
        if (geojson) {
          L.geoJSON(geojson, {
            style: { color: '#0284c7', weight: 4, opacity: 0.8, fillOpacity: 0.3 },
          }).addTo(map.current!);
        }
      });

    L.control
      .layers(
        { Street: osm, Satellite: satellite },
        { Rainfall: precipitationLayer.current! },
        { position: 'topright' }
      )
      .addTo(map.current);
  }, []);

  // Toggle rainfall
  useEffect(() => {
    if (!map.current || !precipitationLayer.current) return;
    if (showRainfall) {
      precipitationLayer.current.addTo(map.current);
    } else {
      map.current.removeLayer(precipitationLayer.current);
    }
  }, [showRainfall]);

  // Photo markers
  useEffect(() => {
    if (!map.current) return;
    photoMarkers.current.forEach((m) => m.remove());
    photoMarkers.current = [];

    communityPhotos.forEach((photo) => {
      if (!photo.location) return;
      const marker = L.marker([photo.location.lat, photo.location.lng], {
        icon: L.divIcon({ html: '📸', iconSize: [30, 30], className: 'text-3xl' }),
      })
        .bindPopup(
          `
          <img src="${photo.url}" style="width:100%;max-width:220px;border-radius:8px;margin-bottom:8px;" />
          <p><strong>${photo.description || 'Report'}</strong></p>
          <small>${new Date(photo.timestamp).toLocaleString()}</small>
        `
        )
        .addTo(map.current!);
      photoMarkers.current.push(marker);
    });
  }, [communityPhotos]);

  // SMS functions (sendAlert & subscribe) – keep from previous version

  return (
    <Box sx={{ height: '100vh', width: '100%', position: 'relative' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* Weather Alert Banner */}
      {!alertLoading && weatherAlerts.length > 0 && (
        <Paper
          elevation={6}
          sx={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            maxWidth: '90%',
            backgroundColor: '#d32f2f',
            color: 'white',
            p: 2,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
          >
            <WarningIcon /> Active Weather Alert
          </Typography>
          {weatherAlerts.map((alert, i) => (
            <Box key={i} sx={{ mt: 1 }}>
              <strong>{alert.event}</strong>
              <Typography variant="body2">{alert.description}</Typography>
              <Typography variant="caption">
                {new Date(alert.start * 1000).toLocaleString()} –{' '}
                {new Date(alert.end * 1000).toLocaleString()}
              </Typography>
              <Typography variant="caption" display="block">
                Source: {alert.sender_name}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}

      {/* Rainfall Toggle */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1000,
          backgroundColor: 'white',
          p: 1,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <FormControlLabel
          control={
            <Switch checked={showRainfall} onChange={(e) => setShowRainfall(e.target.checked)} />
          }
          label="🌧️ Real-time Rainfall"
        />
      </Box>

      <IconButton
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: 'absolute',
          top: 80,
          left: 16,
          zIndex: 1000,
          backgroundColor: 'white',
          boxShadow: 3,
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer with admin/subscription – keep your previous content */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {/* Your existing drawer content */}
      </Drawer>
    </Box>
  );
}
