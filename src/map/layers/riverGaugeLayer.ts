import { Map } from "mapbox-gl";

export function addRiverGaugeLayer(map: Map) {
  if (map.getSource("river-gauges")) return;

  map.addSource("river-gauges", {
    type: "geojson",
    data: "/data/riverGauges.geojson",
  });

  map.addLayer({
    id: "river-gauge-points",
    type: "circle",
    source: "river-gauges",
    paint: {
      "circle-radius": 8,
      "circle-color": [
        "match",
        ["get", "level"],
        "High", "#e53935",
        "Moderate", "#fb8c00",
        "#43a047"
      ],
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff"
    }
  });
}
