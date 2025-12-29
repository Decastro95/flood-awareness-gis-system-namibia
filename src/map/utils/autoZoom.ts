import { Map } from "mapbox-gl";

export function zoomToFloodHotspot(map: Map, hotspot: string) {
  const locations: Record<string, [number, number, number]> = {
    kavango: [18.0, -17.9, 7],
    zambezi: [24.0, -17.8, 7],
    cuvelai: [15.5, -17.6, 7],
  };

  const target = locations[hotspot];
  if (!target) return;

  map.flyTo({
    center: [target[0], target[1]],
    zoom: target[2],
    speed: 0.8,
  });
}
