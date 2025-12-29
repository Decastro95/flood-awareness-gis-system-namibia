'use client';

import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Alert, Snackbar, Button } from '@mui/material';

type FloodAlert = {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
};

export default function RealTimeAlerts() {
  const [alerts, setAlerts] = useState<FloodAlert[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [latestAlert, setLatestAlert] = useState<FloodAlert | null>(null);

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const fetchAlerts = async () => {
    try {
      // GDACS RSS (via proxy for CORS)
      const rssRes = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://gdacs.org/xml/gdacs.rss'));
      const rssData = await rssRes.json();
      const parser = new DOMParser();
      const xml = parser.parseFromString(rssData.contents, 'text/xml');
      const items = Array.from(xml.querySelectorAll('item'));

      const newAlerts: FloodAlert[] = [];
      items.forEach(item => {
        const title = item.querySelector('title')?.textContent || '';
        if (title.toLowerCase().includes('namibia') && title.toLowerCase().includes('flood')) {
          const severity = title.includes('Red') ? 'high' : title.includes('Orange') ? 'medium' : 'low';
          newAlerts.push({
            id: item.querySelector('guid')?.textContent || Math.random().toString(),
            title,
            description: item.querySelector('description')?.textContent || '',
            severity,
            date: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
          });
        }
      });

      // Open-Meteo Flood (Cuvelai example)
      const floodRes = await fetch('https://flood-api.open-meteo.com/v1/flood?latitude=-17.78&longitude=15.7&daily=river_discharge');
      const floodData = await floodRes.json();
      const highDischarge = floodData.daily?.river_discharge.some((d: number) => d > 400); // Threshold m³/s

      if (highDischarge) {
        newAlerts.unshift({
          id: 'openmeteo-' + Date.now(),
          title: 'High River Discharge Warning',
          description: 'Cuvelai Basin forecast shows elevated discharge – flood risk increasing.',
          severity: 'high',
          date: new Date().toISOString(),
        });
      }

      // Compare with previous to find new alerts
      const newOnes = newAlerts.filter(a => !alerts.some(old => old.id === a.id));
      setAlerts(prev => [...newOnes, ...prev].slice(0, 20)); // Keep recent

      // Trigger notifications for new alerts
      newOnes.forEach(alert => {
        toast.custom((t) => (
          <Alert severity={alert.severity === 'high' ? 'error' : 'warning'} onClose={() => toast.dismiss(t.id)}>
            <strong>{alert.title}</strong><br />{alert.description}
          </Alert>
        ), { duration: 8000 });

        // Browser push if permitted
        if (Notification.permission === 'granted') {
          new Notification(alert.title, { body: alert.description, icon: '/favicon.ico' });
        }

        setLatestAlert(alert);
        setOpenSnackbar(true);
      });
    } catch (err) {
      console.error('Alert fetch error:', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10 * 60 * 1000); // Every 10 mins
    return () => clearInterval(interval);
  }, [alerts]);

  return (
    <>
      <Toaster position="top-right" />
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={latestAlert?.severity === 'high' ? 'error' : 'warning'}>
          New Alert: {latestAlert?.title}
        </Alert>
      </Snackbar>
      {/* List recent alerts */}
      <div className="mt-4">
        <h3 className="font-bold">Recent Alerts</h3>
        {alerts.slice(0, 5).map(alert => (
          <Alert key={alert.id} severity={alert.severity === 'high' ? 'error' : 'warning'} className="mb-2">
            {alert.title} ({new Date(alert.date).toLocaleString()})
          </Alert>
        ))}
      </div>
    </>
  );
}
