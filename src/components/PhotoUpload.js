// src/components/PhotoUpload.js
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import exif from 'exif-js';
import * as turf from '@turf/turf';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function PhotoUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [tags, setTags] = useState({});

  // Sample trig points from CSVs (parse all CSVs into this array; e.g., via code_execution tool or manual import)
  const trigPoints = [
    { name: 'Oshakati', lat: -17.78, lon: 15.70 }, // From decimaldeg.csv, etc.
    // Add all ~100 points here or fetch from Supabase
  ];

  // PDF regions/constituencies as JSON (extracted from PDF)
  const regions = {
    'Oshana': { constituencies: ['Oshakati East', 'Oshakati West'], municipalities: ['Oshakati'] },
    // Parse full PDF list here
  };

  const handleUpload = async () => {
    if (!file) return;

    // Get phone location
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => alert('Location access denied. Using photo EXIF if available.')
    );

    // Parse EXIF for fallback location
    exif.getData(file, () => {
      const exifLat = exif.getTag(file, 'GPSLatitude');
      const exifLon = exif.getTag(file, 'GPSLongitude');
      if (exifLat && exifLon) setLocation({ lat: exifLat, lon: exifLon });
    });

    if (!location) return alert('No location available.');

    // Find nearest trig point
    const userPoint = turf.point([location.lon, location.lat]);
    let nearest = null;
    let minDist = Infinity;
    trigPoints.forEach((pt) => {
      const dist = turf.distance(userPoint, turf.point([pt.lon, pt.lat]));
      if (dist < minDist) {
        minDist = dist;
        nearest = pt;
      }
    });

    // Reverse geocode with Mapbox (or Nominatim)
    const geocodeRes = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location.lon},${location.lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`);
    const geocodeData = await geocodeRes.json();
    const address = geocodeData.features[0]?.place_name || 'Unknown';

    // Tag with region/constituency (match to PDF data)
    const regionTag = Object.keys(regions).find((reg) => address.includes(reg)) || nearest?.name || 'Unknown';

    setTags({ region: regionTag, constituency: regions[regionTag]?.constituencies[0] || 'Unknown', village: address });

    // Upload to Supabase
    const { data, error } = await supabase.storage.from('flood-photos').upload(`public/${file.name}`, file);
    if (error) return alert('Upload failed.');
    
    // Store metadata in DB
    await supabase.from('flood_reports').insert({
      photo_url: data.path,
      lat: location.lat,
      lon: location.lon,
      tags,
      timestamp: new Date(),
    });

    onUpload(); // Refresh map markers
    alert('Photo uploaded and tagged!');
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload Flood Photo</button>
    </div>
  );
}
