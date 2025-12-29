import { Map } from "mapbox-gl";

export function addRainLayer(map: Map) {
  if (map.getSource("rain")) return;

  map.addSource("rain", {
    type: "raster",
    tiles: [
      `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`,
    ],
    tileSize: 256,
  });

  map.addLayer({
    id: "rain-layer",
    type: "raster",
    source: "rain",
    paint: {
      "raster-opacity": 0.6,
    },
  });
}
