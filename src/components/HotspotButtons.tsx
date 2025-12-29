"use client";

import { Map } from "mapbox-gl";
import { zoomToFloodHotspot } from "@/map/utils/autoZoom";

type Props = {
  map: Map | null;
};

export default function HotspotButtons({ map }: Props) {
  if (!map) return null;

  return (
    <div className="panel">
      <h4>🧭 Flood Hotspots</h4>
      <button onClick={() => zoomToFloodHotspot(map, "cuvelai")}>
        Cuvelai Basin
      </button>
      <button onClick={() => zoomToFloodHotspot(map, "kavango")}>
        Kavango River
      </button>
      <button onClick={() => zoomToFloodHotspot(map, "zambezi")}>
        Zambezi River
      </button>
    </div>
  );
}
