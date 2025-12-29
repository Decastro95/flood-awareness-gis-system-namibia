# Namibia Flood Awareness GIS Data

This directory contains processed GIS data from the Atlas of Namibia for flood risk assessment and early warning systems in Northern Namibia.

## Data Structure

### 📁 `/hydrology` - Water Infrastructure Data
- **major_rivers.geojson** - Major international rivers (Zambezi, Kunene, Orange, Okavango)
- **river_tributaries.geojson** - Detailed river tributary network (4MB+ data)
- **catchments.geojson** - Watershed boundaries for drainage analysis
- **dams.geojson** - Dam locations and infrastructure points

### 📁 `/monitoring` - Flow Monitoring Infrastructure
- **monitoring_stations.geojson** - River flow monitoring station locations

### 📁 `/profiles` - River Elevation Data (CSV)
- **Kunene_elevation Profile.csv** - 994 elevation points along Kunene River
- **Zambezi_elevation Profile-to Impalila.csv** - 1,315 points along Zambezi
- **Okavango_elevation Profile.csv** - 1,163 points along Okavango River
- **Orange_elevation Profile.csv** - 2,342 points along Orange River
- **Kwando_elevation Profile.csv** - 1,760 points along Kwando River

### 📁 `/elevation` - Topographic Data
- **Elevation_namibia_clipSRTM90V2.tif** - 90m resolution elevation raster for Namibia

## CSV Data Format

Each river profile CSV contains:
- **ID**: Point identifier
- **X, Y**: Longitude, Latitude coordinates
- **Elevation**: Height above sea level (meters)
- **Distance (Total)**: Cumulative distance along river (meters)
- **Slope (Degrees/Percent)**: River gradient data

## MapBox Integration

### 1. Vector Layers (GeoJSON)
```javascript
// Add river network
map.addSource('rivers', {
    'type': 'geojson',
    'data': './data/hydrology/major_rivers.geojson'
});

// Add monitoring stations
map.addSource('stations', {
    'type': 'geojson', 
    'data': './data/monitoring/monitoring_stations.geojson'
});
```

### 2. Styling Examples
```javascript
// River styling
map.addLayer({
    'id': 'rivers-layer',
    'type': 'line',
    'source': 'rivers',
    'paint': {
        'line-color': '#0080ff',
        'line-width': 2
    }
});

// Monitoring stations
map.addLayer({
    'id': 'stations-layer',
    'type': 'circle',
    'source': 'stations',
    'paint': {
        'circle-color': '#ff4444',
        'circle-radius': 6
    }
});
```

### 3. Flood Risk Analysis
Use elevation profiles for:
- Calculating flood gradients
- Identifying low-lying areas
- Modeling water flow direction
- Creating flood inundation zones

## Usage Notes

1. **Coordinate System**: All data uses WGS84 (EPSG:4326) - compatible with MapBox
2. **File Sizes**: River tributaries file is large (~4MB) - consider simplification for web use
3. **Elevation Data**: TIFF file requires raster processing for web display
4. **Northern Namibia Focus**: Data covers Zambezi, Kunene, and Okavango systems

## Data Source
Original data from Atlas of Namibia Online (https://atlasofnamibia.online/)
Processed for flood awareness and early warning systems.