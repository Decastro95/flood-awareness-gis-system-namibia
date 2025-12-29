import pandas as pd
import folium
import geopandas as gpd
from io import StringIO  # For loading sample GeoJSON from string

# Sample GeoJSON for flood-prone area (approx Cuvelai Basin near Oshakati; replace with real data)
sample_geojson = """
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {"name": "Flood Prone Zone - Oshakati", "risk_level": "High"},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [15.5, -17.5], [16.5, -17.5], [16.5, -18.5], [15.5, -18.5], [15.5, -17.5]
        ]]
      }
    }
  ]
}
"""

# Load gazetteer
df = pd.read_csv('namibia_gazetteer.csv')

# Filter northern (e.g., grids with 1-2, D-F letters)
northern = df[df['Grid'].str.contains(r'[D-F][1-2]', na=False)]

# Example grid to coord mapping (approx; use accurate geocoding for production)
grid_coords = {
    'E1': (-17.78, 15.7),  # Oshakati approx
    'F1': (-17.0, 18.0),   # Eastern areas
    # Add more from gazetteer or geocode
}

# Create map centered on Northern Namibia
m = folium.Map(location=[-18, 16.5], zoom_start=6)

# Add gazetteer points
for index, row in northern.iterrows():
    if row['Grid'] in grid_coords:
        lat, lon = grid_coords[row['Grid']]
        folium.Marker(
            [lat, lon],
            popup=f"{row['Name']} ({row['Grid']})",
            tooltip=row['Name']
        ).add_to(m)

# Load GeoJSON (use file if available, else sample)
try:
    # If you have a real file, e.g., from downloads
    gdf = gpd.read_file('flood_zones.geojson')  # Replace with your file path
except FileNotFoundError:
    # Use sample
    gdf = gpd.read_file(StringIO(sample_geojson))

# Add GeoJSON layer to map
folium.GeoJson(
    gdf,
    name="Flood Prone Zones",
    style_function=lambda feature: {
        'fillColor': 'red',
        'color': 'black',
        'weight': 2,
        'dashArray': '5, 5',
        'fillOpacity': 0.5
    },
    tooltip=folium.GeoJsonTooltip(fields=['name', 'risk_level'], aliases=['Zone:', 'Risk:'])
).add_to(m)

# Add layer control
folium.LayerControl().add_to(m)

# Save map
m.save('northern_flood_map_with_geojson.html')
print("Map saved as northern_flood_map_with_geojson.html")