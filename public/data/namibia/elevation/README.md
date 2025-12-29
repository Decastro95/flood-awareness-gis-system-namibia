# Elevation Data for Namibia Flood Analysis

## Files in this Directory

### `Elevation_namibia_clipSRTM90V2.tif` (108MB)
- **Format**: GeoTIFF raster
- **Resolution**: 90 meters per pixel
- **Coverage**: Complete Namibia territory
- **Source**: SRTM (Shuttle Radar Topography Mission)

⚠️ **Loading Notice**: This is a large file that may take time to preview in browser.

## Alternative Data Sources

For faster web integration, use the processed elevation profiles:
- `/profiles/Zambezi_elevation Profile-to Impalila.csv` - 1,315 points
- `/profiles/Kunene_elevation Profile.csv` - 994 points  
- `/profiles/Okavango_elevation Profile.csv` - 1,163 points
- `/profiles/Orange_elevation Profile.csv` - 2,342 points
- `/profiles/Kwando_elevation Profile.csv` - 1,760 points

## Web Integration Options

### Option 1: Use CSV Elevation Profiles
```javascript
// Load river elevation data for flood modeling
fetch('/data/profiles/Zambezi_elevation Profile-to Impalila.csv')
  .then(response => response.text())
  .then(data => {
    // Parse CSV and create elevation model
    const elevationPoints = parseCSV(data);
    // Use for flood risk calculations
  });
```

### Option 2: MapBox Terrain API (Recommended)
```javascript
// Use MapBox terrain for elevation queries
map.queryTerrainElevation([longitude, latitude], {
  // Returns elevation at specific coordinates
});
```

### Option 3: Tile-based Serving
Convert the large TIFF to smaller tiles for web serving:
```bash
# Example using GDAL (not available in current environment)
gdal2tiles.py -z 5-15 Elevation_namibia_clipSRTM90V2.tif elevation_tiles/
```

## Flood Analysis Applications

1. **Cross-sectional Analysis**: Use river elevation profiles to model flood heights
2. **Watershed Delineation**: Identify water flow patterns from elevation data
3. **Flood Plain Mapping**: Determine areas at risk based on elevation and proximity to rivers
4. **Early Warning Systems**: Combine elevation with real-time river levels

## Technical Specifications

- **Coordinate System**: WGS84 (EPSG:4326)
- **Elevation Units**: Meters above sea level
- **Data Type**: 16-bit signed integer
- **No Data Value**: -32768
- **Compression**: LZW compressed

For immediate flood analysis, start with the CSV elevation profiles which are optimized for web use.