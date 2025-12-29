// MapBox GL JS Integration Example for Namibia Flood Awareness System
// Add this to your existing MapBox implementation

// Initialize map (assuming you already have this)
// const map = new mapboxgl.Map({...});

// Add GeoJSON data sources
map.on('load', function() {
    
    // Major Rivers
    map.addSource('major-rivers', {
        'type': 'geojson',
        'data': './data/hydrology/major_rivers.geojson'
    });
    
    // River Tributaries (detailed network)
    map.addSource('tributaries', {
        'type': 'geojson', 
        'data': './data/hydrology/river_tributaries.geojson'
    });
    
    // Catchment Areas
    map.addSource('catchments', {
        'type': 'geojson',
        'data': './data/hydrology/catchments.geojson'
    });
    
    // Dams
    map.addSource('dams', {
        'type': 'geojson',
        'data': './data/hydrology/dams.geojson'
    });
    
    // Monitoring Stations
    map.addSource('monitoring-stations', {
        'type': 'geojson',
        'data': './data/monitoring/monitoring_stations.geojson'
    });

    // LAYER STYLING
    
    // Major rivers - thick blue lines
    map.addLayer({
        'id': 'major-rivers-layer',
        'type': 'line',
        'source': 'major-rivers',
        'paint': {
            'line-color': '#0066cc',
            'line-width': 3,
            'line-opacity': 0.8
        }
    });
    
    // Tributaries - thinner lines
    map.addLayer({
        'id': 'tributaries-layer',
        'type': 'line',
        'source': 'tributaries',
        'paint': {
            'line-color': '#4da6ff',
            'line-width': 1,
            'line-opacity': 0.6
        }
    });
    
    // Catchment boundaries
    map.addLayer({
        'id': 'catchments-layer',
        'type': 'line',
        'source': 'catchments',
        'paint': {
            'line-color': '#ff6600',
            'line-width': 2,
            'line-dasharray': [2, 2],
            'line-opacity': 0.7
        }
    });
    
    // Dams - red circles
    map.addLayer({
        'id': 'dams-layer',
        'type': 'circle',
        'source': 'dams',
        'paint': {
            'circle-color': '#cc0000',
            'circle-radius': 6,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2
        }
    });
    
    // Monitoring stations - yellow circles
    map.addLayer({
        'id': 'stations-layer',
        'type': 'circle',
        'source': 'monitoring-stations',
        'paint': {
            'circle-color': '#ffcc00',
            'circle-radius': 8,
            'circle-stroke-color': '#000000',
            'circle-stroke-width': 1
        }
    });

    // POPUP INTERACTIONS
    
    // Click on monitoring stations
    map.on('click', 'stations-layer', function(e) {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;
        
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
                <h3>Monitoring Station</h3>
                <p><strong>ID:</strong> ${properties.ID || 'N/A'}</p>
                <p><strong>Location:</strong> ${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}</p>
            `)
            .addTo(map);
    });
    
    // Click on dams
    map.on('click', 'dams-layer', function(e) {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;
        
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
                <h3>Dam Infrastructure</h3>
                <p><strong>Coordinates:</strong> ${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}</p>
            `)
            .addTo(map);
    });
    
    // Hover effects
    map.on('mouseenter', 'stations-layer', function() {
        map.getCanvas().style.cursor = 'pointer';
    });
    
    map.on('mouseleave', 'stations-layer', function() {
        map.getCanvas().style.cursor = '';
    });
});

// FLOOD RISK ANALYSIS FUNCTIONS

// Function to load and process river elevation data
async function loadRiverElevationData(riverName) {
    try {
        const response = await fetch(`./data/profiles/${riverName}_elevation Profile.csv`);
        const csvText = await response.text();
        
        // Parse CSV data
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.replace(/"/g, ''));
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                data.push(row);
            }
        }
        
        return data;
    } catch (error) {
        console.error('Error loading elevation data:', error);
        return [];
    }
}

// Function to identify flood-prone areas based on elevation
function identifyFloodRiskZones(elevationData, floodThreshold = 10) {
    return elevationData.filter(point => {
        const elevation = parseFloat(point.Elevation);
        const slope = parseFloat(point['Slope (Percent)'].replace('%', ''));
        return elevation < floodThreshold && slope < 1; // Low elevation + low slope = flood risk
    });
}

// Example usage:
// loadRiverElevationData('Zambezi').then(data => {
//     const floodRiskPoints = identifyFloodRiskZones(data, 15);
//     console.log('Flood risk points:', floodRiskPoints.length);
// });

// LAYER TOGGLE CONTROLS (add to your UI)
function toggleLayer(layerId, visibility) {
    map.setLayoutProperty(layerId, 'visibility', visibility ? 'visible' : 'none');
}

// Example toggle buttons:
// toggleLayer('tributaries-layer', false); // Hide tributaries
// toggleLayer('catchments-layer', true);   // Show catchments