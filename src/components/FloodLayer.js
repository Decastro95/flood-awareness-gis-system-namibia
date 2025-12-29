// src/components/FloodDataLayer.js
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function FloodDataLayer({ map }) {  // Pass map instance from parent
  useEffect(() => {
    if (!map) return;

    const fetchFloodData = async () => {
      // Fetch flood zones as GeoJSON
      const { data: zones, error: zError } = await supabase
        .from('flood_zones')
        .select('id, name, risk_level, geom')
        .returns();  // Returns array of objects

      if (zError) console.error(zError);

      // Convert PostGIS geom to GeoJSON
      const floodGeoJSON = {
        type: 'FeatureCollection',
        features: zones?.map(zone => ({
          type: 'Feature',
          id: zone.id,
          properties: { name: zone.name, risk_level: zone.risk_level },
          geometry: JSON.parse(supabase.rpc('st_asgeojson', { geom: zone.geom }).single()?.st_asgeojson || '{}')  // Or pre-store as JSON
        })) || []
      };

      // Better: Add a view or function to return GeoJSON directly
      // CREATE FUNCTION get_flood_zones_geojson() RETURNS json AS $$
      // SELECT json_build_object('type', 'FeatureCollection', 'features', json_agg(json_build_object('type', 'Feature', 'properties', json_build_object('name', name, 'risk', risk_level), 'geometry', ST_AsGeoJSON(geom)::json))) FROM flood_zones;
      // $$ LANGUAGE sql;

      if (map.getSource('flood-zones')) map.removeSource('flood-zones');
      map.addSource('flood-zones', { type: 'geojson', data: floodGeoJSON });

      if (!map.getLayer('flood-fill')) {
        map.addLayer({
          id: 'flood-fill',
          type: 'fill',
          source: 'flood-zones',
          paint: {
            'fill-color': [
              'match',
              ['get', 'risk_level'],
              'High', '#EF4444',
              'Medium', '#FBBF24',
              'Low', '#10B981',
              '#cccccc'
            ],
            'fill-opacity': 0.6,
          },
        });
      }
    };

    map.on('load', fetchFloodData);  // Or call on bounds change for dynamic loading
  }, [map]);

  return null;
}
