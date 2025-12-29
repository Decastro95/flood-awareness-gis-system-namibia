'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@mui/material'; // Or your UI library
import { Box, Typography } from '@mui/material';

type AlertItem = {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
};

export default function FloodAlertsPanel() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // GDACS RSS (parse XML to JSON via proxy or library)
        const rssResponse = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://gdacs.org/xml/gdacs.rss'));
        const rssData = await rssResponse.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(rssData.contents, 'text/xml');
        const items = xml.querySelectorAll('item');

        const gdacsAlerts: AlertItem[] = [];
        items.forEach(item => {
          const title = item.querySelector('title')?.textContent || '';
          if (title.toLowerCase().includes('namibia') || title.toLowerCase().includes('flood')) {
            gdacsAlerts.push({
              title,
              description: item.querySelector('description')?.textContent || '',
              severity: title.includes('Red') ? 'high' : title.includes('Orange') ? 'medium' : 'low',
              date: item.querySelector('pubDate')?.textContent || '',
            });
          }
        });

        // Open-Meteo Flood Forecast (example for Oshakati area in Cuvelai)
        const floodResponse = await fetch('https://flood-api.open-meteo.com/v1/flood?latitude=-17.78&longitude=15.7&daily=river_discharge');
        const floodData = await floodResponse.json();
        const discharge = floodData.daily?.river_discharge || [];

        if (discharge.some((d: number) => d > 300)) { // Threshold example m³/s
          gdacsAlerts.unshift({
            title: 'High River Discharge Forecast',
            description: 'Cuvelai Basin discharge expected to exceed safe levels in coming days.',
            severity: 'high',
            date: new Date().toISOString(),
          });
        }

        setAlerts(gdacsAlerts);
      } catch (err) {
        console.error('Alert fetch error:', err);
        setAlerts([{ title: 'Connection Issue', description: 'Unable to load real-time alerts.', severity: 'low', date: '' }]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 600000); // Every 10 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Typography>Loading alerts...</Typography>;

  return (
    <Box sx={{ maxHeight: '400px', overflowY: 'auto', p: 2 }}>
      <Typography variant="h6" gutterBottom>Real-Time Flood Alerts</Typography>
      {alerts.length === 0 ? (
        <Alert severity="info">No active flood alerts in Namibia.</Alert>
      ) : (
        alerts.map((alert, i) => (
          <Alert key={i} severity={alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'info'} sx={{ mb: 1 }}>
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.description}</AlertDescription>
            <Typography variant="caption">{alert.date}</Typography>
          </Alert>
        ))
      )}
    </Box>
  );
}
