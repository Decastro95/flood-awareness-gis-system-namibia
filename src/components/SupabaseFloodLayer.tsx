'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Props = {
  map: mapboxgl.Map | null;
};

export default function SupabaseFloodLayer({ map }: Props) {
  useEffect(() => {
    if (!map) return;

    const loadFloodZones = async () => {
      const bounds = map.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      const { data, error } = await supabase
        .rpc('get_flood_zones_in_bounds', {
          min_lng: sw.lng,
          max_lng: ne.lng,
          min_lat: sw.lat,
          max_lat: ne.lat,
        })
        .single();

      if (error) {
        console.error('Supabase RPC error:', error);
        return;
      }

      const geojson = data?.get_flood_zones_in_bounds || {
        type: 'FeatureCollection',
        features: [],
      };

      // Update or add source
      const source = map.getSource('supabase-flood-zones') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(geojson);
      } else {
        map.addSource('supabase-flood-zones', {
          type: 'geojson',
          data: geojson,
        });

        map.addLayer({
          id: 'supabase-flood-fill',
          type: 'fill',
          source: 'supabase-flood-zones',
          paint: {
            'fill-color': [
              'match',
              ['get', 'risk_level'],
              'High', '#ef4444',
              'Medium', '#f59e0b',
              'Low', '#10b981',
              '#94a3b8', // default
            ],
            'fill-opacity': 0.6,
          },
        });

        map.addLayer({
          id: 'supabase-flood-outline',
          type: 'line',
          source: 'supabase-flood-zones',
          paint: {
            'line-color': '#1e293b',
            'line-width': 1.5,
          },
        });
      }
    };

    // Load once on map ready
    if (map.isStyleLoaded()) {
      loadFloodZones();
    } else {
      map.on('load', loadFloodZones);
    }

    // Reload on every moveend (pan/zoom) – debounced for performance
    let timeout: NodeJS.Timeout;
    const debouncedLoad = () => {
      clearTimeout(timeout);
      timeout = setTimeout(loadFloodZones, 300); // 300ms debounce
    };

    map.on('moveend', debouncedLoad);

    // Cleanup
    return () => {
      map.off('moveend', debouncedLoad);
      clearTimeout(timeout);
    };
  }, [map]);

  return null;
}
const [loading, setLoading] = useState(true);

// In SupabaseFloodLayer, after successful load:
setLoading(false);

// In UI:
{loading && (
  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded shadow">
    Loading flood zones...
  </div>
)}
