"use client";

import { useEffect, useState } from "react";
import { Map } from "mapbox-gl";
import { addRainLayer } from "@/map/layers/rainLayer";

type Props = {
  map: Map | null;
};

export default function RainToggle({ map }: Props) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!map) return;

    if (enabled) {
      addRainLayer(map);
      map.setLayoutProperty("rain-layer", "visibility", "visible");
    } else if (map.getLayer("rain-layer")) {
      map.setLayoutProperty("rain-layer", "visibility", "none");
    }
  }, [enabled, map]);

  return (
    <div className="panel">
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => setEnabled(!enabled)}
        />{" "}
        🌧️ Live Rainfall Layer
      </label>
    </div>
  );
}
