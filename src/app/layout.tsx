// src/app/layout.tsx
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'Flood Awareness GIS System - Northern Namibia',
  description:
    'Interactive flood risk mapping and public awareness platform for Northern Namibia. Real-time weather integration, safe zones, and early warning alerts.',
  keywords:
    'flood awareness, GIS, Namibia, disaster preparedness, flood mapping, OpenWeatherMap, Supabase',
  authors: [{ name: 'Immanuel T Ndatipo' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
