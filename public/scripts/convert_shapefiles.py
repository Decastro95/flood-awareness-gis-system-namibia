#!/usr/bin/env python3
"""
Convert Atlas of Namibia shapefiles to GeoJSON for web mapping
"""
import os
import json
import struct
from pathlib import Path

def read_dbf_simple(dbf_path):
    """Simple DBF reader for shapefile attributes"""
    records = []
    try:
        with open(dbf_path, 'rb') as f:
            # Read DBF header
            f.seek(4)
            record_count = struct.unpack('<I', f.read(4))[0]
            header_length = struct.unpack('<H', f.read(2))[0]
            record_length = struct.unpack('<H', f.read(2))[0]
            
            # Skip to field descriptors
            f.seek(32)
            fields = []
            while f.tell() < header_length - 1:
                field_info = f.read(32)
                if field_info[0] == 0x0D:  # End of field descriptors
                    break
                field_name = field_info[:11].split(b'\x00')[0].decode('ascii')
                field_type = chr(field_info[11])
                field_length = field_info[16]
                fields.append((field_name, field_type, field_length))
            
            # Read records
            f.seek(header_length)
            for i in range(record_count):
                record_data = f.read(record_length)
                if record_data[0] != 0x2A:  # Not deleted record
                    record = {}
                    pos = 1
                    for field_name, field_type, field_length in fields:
                        value = record_data[pos:pos+field_length].strip()
                        if field_type == 'N':  # Numeric
                            try:
                                if b'.' in value:
                                    record[field_name] = float(value)
                                else:
                                    record[field_name] = int(value) if value else 0
                            except:
                                record[field_name] = 0
                        else:  # Character
                            record[field_name] = value.decode('ascii', errors='ignore')
                        pos += field_length
                    records.append(record)
    except Exception as e:
        print(f"Error reading DBF {dbf_path}: {e}")
    return records

def read_shp_simple(shp_path):
    """Simple SHP reader for basic geometry"""
    geometries = []
    try:
        with open(shp_path, 'rb') as f:
            # Read file header
            f.seek(32)
            shape_type = struct.unpack('<I', f.read(4))[0]
            
            # Skip to records
            f.seek(100)
            
            while True:
                try:
                    # Read record header
                    record_header = f.read(8)
                    if len(record_header) < 8:
                        break
                    
                    record_number = struct.unpack('>I', record_header[:4])[0]
                    content_length = struct.unpack('>I', record_header[4:8])[0] * 2
                    
                    # Read record content
                    record_data = f.read(content_length)
                    if len(record_data) < 4:
                        break
                        
                    rec_shape_type = struct.unpack('<I', record_data[:4])[0]
                    
                    if rec_shape_type == 1:  # Point
                        if len(record_data) >= 20:
                            x = struct.unpack('<d', record_data[4:12])[0]
                            y = struct.unpack('<d', record_data[12:20])[0]
                            geometries.append({
                                "type": "Point",
                                "coordinates": [x, y]
                            })
                    elif rec_shape_type == 3:  # Polyline
                        if len(record_data) >= 44:
                            num_parts = struct.unpack('<I', record_data[36:40])[0]
                            num_points = struct.unpack('<I', record_data[40:44])[0]
                            
                            # Read points
                            points_start = 44 + num_parts * 4
                            coordinates = []
                            for i in range(num_points):
                                point_offset = points_start + i * 16
                                if point_offset + 16 <= len(record_data):
                                    x = struct.unpack('<d', record_data[point_offset:point_offset+8])[0]
                                    y = struct.unpack('<d', record_data[point_offset+8:point_offset+16])[0]
                                    coordinates.append([x, y])
                            
                            if coordinates:
                                geometries.append({
                                    "type": "LineString",
                                    "coordinates": coordinates
                                })
                    elif rec_shape_type == 5:  # Polygon
                        if len(record_data) >= 44:
                            num_parts = struct.unpack('<I', record_data[36:40])[0]
                            num_points = struct.unpack('<I', record_data[40:44])[0]
                            
                            # Read points
                            points_start = 44 + num_parts * 4
                            coordinates = []
                            for i in range(num_points):
                                point_offset = points_start + i * 16
                                if point_offset + 16 <= len(record_data):
                                    x = struct.unpack('<d', record_data[point_offset:point_offset+8])[0]
                                    y = struct.unpack('<d', record_data[point_offset+8:point_offset+16])[0]
                                    coordinates.append([x, y])
                            
                            if coordinates:
                                geometries.append({
                                    "type": "Polygon",
                                    "coordinates": [coordinates]
                                })
                                
                except Exception as e:
                    print(f"Error reading record: {e}")
                    break
                    
    except Exception as e:
        print(f"Error reading SHP {shp_path}: {e}")
    
    return geometries

def convert_shapefile_to_geojson(shp_path, output_path):
    """Convert shapefile to GeoJSON"""
    try:
        # Read geometry and attributes
        geometries = read_shp_simple(shp_path)
        
        dbf_path = shp_path.replace('.shp', '.dbf')
        attributes = read_dbf_simple(dbf_path) if os.path.exists(dbf_path) else []
        
        # Create GeoJSON features
        features = []
        for i, geometry in enumerate(geometries):
            properties = attributes[i] if i < len(attributes) else {}
            features.append({
                "type": "Feature",
                "geometry": geometry,
                "properties": properties
            })
        
        # Create GeoJSON object
        geojson = {
            "type": "FeatureCollection",
            "features": features
        }
        
        # Write to file
        with open(output_path, 'w') as f:
            json.dump(geojson, f, indent=2)
        
        print(f"Converted {shp_path} -> {output_path} ({len(features)} features)")
        return True
        
    except Exception as e:
        print(f"Error converting {shp_path}: {e}")
        return False

def main():
    """Convert all shapefiles to GeoJSON"""
    base_path = "/workspace/uploads"
    output_base = "/workspace/processed_data"
    
    # Define shapefile mappings
    shapefiles = [
        {
            "input": f"{base_path}/Atlas_ch_04_02/Figure 4_02 Perennial rivers and upstream catchments/major international rivers.shp",
            "output": f"{output_base}/hydrology/major_rivers.geojson"
        },
        {
            "input": f"{base_path}/Atlas_ch_04_02/Figure 4_02 Perennial rivers and upstream catchments/major international rivers tributaries.shp",
            "output": f"{output_base}/hydrology/river_tributaries.geojson"
        },
        {
            "input": f"{base_path}/Atlas_ch_04_02/Figure 4_02 Perennial rivers and upstream catchments/catchment.shp",
            "output": f"{output_base}/hydrology/catchments.geojson"
        },
        {
            "input": f"{base_path}/Atlas_ch_04_02/Figure 4_02 Perennial rivers and upstream catchments/dams.shp",
            "output": f"{output_base}/hydrology/dams.geojson"
        },
        {
            "input": f"{base_path}/Atlas_ch_04_04/Figure 4_04 Seasonal variation in flow of perennial rivers/Monitoring Stations_Graphed.shp",
            "output": f"{output_base}/monitoring/monitoring_stations.geojson"
        }
    ]
    
    # Convert each shapefile
    for shapefile in shapefiles:
        if os.path.exists(shapefile["input"]):
            convert_shapefile_to_geojson(shapefile["input"], shapefile["output"])
        else:
            print(f"Shapefile not found: {shapefile['input']}")

if __name__ == "__main__":
    main()