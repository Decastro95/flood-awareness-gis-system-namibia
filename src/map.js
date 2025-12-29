import L from 'leaflet';
import proj4 from 'proj4';  // Added to package.json: "proj4": "^2.11.0"

// Define Schwarzeck proj string (EPSG:29333 for UTM 33S, northern Namibia)
proj4.defs('EPSG:29333', '+proj=utm +zone=33 +south +ellps=bess_nam +towgs84=616,97,-251,0,0,0,0 +units=m +no_defs');

// Custom CRS for Leaflet
const schwarzeckCRS = new L.Proj.CRS('EPSG:29333', '+proj=utm +zone=33 +south +ellps=bess_nam +towgs84=616,97,-251,0,0,0,0 +units=m +no_defs', {
  resolutions: [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5],  // Adjust for zoom
  origin: [0, 0]  // UTM origin
});

// Initialize map (default WGS84, but switchable)
const map = L.map('map', { crs: L.CRS.EPSG4326 }).setView([-18, 16.5], 6);  // Northern Namibia center

// Function to transform point from Schwarzeck UTM to WGS84 LatLng
function transformToWGS84(x, y) {  // x=east, y=north in Schwarzeck
  const [lon, lat] = proj4('EPSG:29333', 'EPSG:4326', [x, y]);
  return L.latLng(lat, lon);
}

// Example: Add marker from Schwarzeck coords (e.g., trig point)
const exampleSchwarzeck = [709.758, 602.010];  // From test.txt example
const wgsPoint = transformToWGS84(exampleSchwarzeck[0], exampleSchwarzeck[1]);
L.marker(wgsPoint).addTo(map).bindPopup('Transformed Schwarzeck Point');

// For GeoJSON layers: Reproject on load if in Schwarzeck
fetch('data/flood_zones.geojson').then(res => res.json()).then(data => {
  L.geoJSON(data, {
    coordsToLatLng: function(coords) {
      const [x, y] = coords;  // Assuming GeoJSON in Schwarzeck
      const [lon, lat] = proj4('EPSG:29333', 'EPSG:4326', [x, y]);
      return [lat, lon, coords[2]];  // Preserve Z if 3D
    },
    style: { color: 'red', fillOpacity: 0.5 }
  }).addTo(map).bindPopup('Flood Prone Zone');
});