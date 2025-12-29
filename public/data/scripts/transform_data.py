from pyproj import Transformer, Proj, transform
import geopandas as gpd
import pandas as pd
import json

# Namibia-specific Helmert parameters (Merry's X-Form)
# Define Schwarzeck (EPSG:29333 with custom TOWGS84)
transformer = Transformer.from_crs(
    "+proj=utm +zone=33 +south +ellps=bess_nam +towgs84=616.8,103.3,-256.9,0,0,0,0 +units=m +no_defs",
    "EPSG:4326",
    always_xy=True
)

# Function for 3D Helmert (if Z/height included; pyproj handles via TOWGS84)
def transform_3d(x, y, z=0):
    p1 = Proj("+proj=utm +zone=33 +south +ellps=bess_nam +towgs84=616.8,103.3,-256.9,0,0,0,0 +units=m +no_defs")
    p2 = Proj("EPSG:4326")
    lon, lat, z_new = transform(p1, p2, x, y, z)
    return lon, lat, z_new

# Example: Transform trig points from CSV (assuming Schwarzeck; but CSV is WGS84 - reverse if needed)
df = pd.read_csv('data/trig_points.csv')  # WGS84 Lat/Lon; for demo, assume source and transform
# For reverse: Swap from/to in Transformer
df['transformed_lon'], df['transformed_lat'] = zip(*df.apply(lambda row: transformer.transform(row['Longitude'], row['Latitude']), axis=1))
df.to_csv('data/transformed_trig_points.csv', index=False)

# Example: Pre-transform GeoJSON (e.g., historical flood zones in Schwarzeck)
gdf = gpd.read_file('data/flood_zones.geojson')  # Assume in Schwarzeck
gdf = gdf.to_crs('EPSG:4326')  # pyproj auto-applies Helmert via CRS definition
gdf.to_file('data/flood_zones_wgs84.geojson', driver='GeoJSON')

# For flood alerts: Transform PDNA shelters (hypothetical coords)
shelter_coords = [(709.758, 602.010, 100)]  # Example Schwarzeck East/North/Height
transformed = [transform_3d(x, y, z) for x, y, z in shelter_coords]
print("Transformed Shelters:", transformed)

# Output for frontend
with open('data/transformed_shelters.json', 'w') as f:
    json.dump({"type": "FeatureCollection", "features": [{"type": "Feature", "geometry": {"type": "Point", "coordinates": [lon, lat]}, "properties": {"height": z}} for lon, lat, z in transformed]}, f)