# Historical Flood Satellite Images

This folder contains satellite imagery from past flood events in Namibia, sourced from the International Charter on Space and Major Disasters.

## 📁 Folder Structure

```
public/satellite-images/
└── historical-floods-2011/
    ├── README.md (this file)
    ├── spot-5-flooding-northern-namibia-2011-04-05.jpg
    ├── formosat-flooding-northern-namibia-2011-04-12.jpg
    ├── worldview-flooding-northern-namibia-2011-04-15.jpg
    ├── radarsat-flooding-northern-namibia-2011-03-24.jpg
    ├── tsx-flooding-northern-namibia-2011-04-11.jpg
    └── jaxa-flooding-northern-namibia-2011-04-05.jpg
```

## 🛰️ 2011 Namibia Floods Dataset

### Overview
These satellite images document the major flooding events in Northern Namibia during March-April 2011. The images show actual flood extents, affected areas, and recovery patterns.

### Satellite Missions Included:
1. **SPOT-5** - Optical satellite, 2.5-10m resolution
2. **Formosat** - Optical satellite, 2m resolution
3. **WorldView** - Very high resolution optical satellite
4. **RADARSAT** - Radar satellite, all-weather imaging
5. **TerraSAR-X** - High-resolution radar satellite
6. **JAXA** - Japanese radar satellite constellation

### Temporal Coverage:
- **Start Date**: March 24, 2011
- **End Date**: April 15, 2011
- **Peak Period**: April 5-15, 2011

## 📥 How to Download Images

1. Visit: https://disasterscharter.org/library/products?disaster=flood&location=Namibia
2. Search for "Flood in Namibia" activation
3. Download the satellite products (PDF reports and image files)
4. Save images as JPG files with descriptive filenames
5. Place them in this folder

## 🔗 Source Information

- **Organization**: International Charter on Space and Major Disasters
- **Activation**: Flood in Namibia (2011)
- **Data Producer**: Namibia Hydrological Services, Pacific Disaster Center
- **License**: Available for disaster response and research purposes

## 📊 Usage in Dashboard

These images are displayed in the `HistoricalSatelliteImages` component on the dashboard sidebar. They provide:

- Historical context for current flood risk assessments
- Validation of flood modeling predictions
- Emergency planning reference
- Educational resource for flood awareness

## 🏷️ File Naming Convention

Format: `{satellite}-{description}-{date}.jpg`

Examples:
- `spot-5-flooding-northern-namibia-2011-04-05.jpg`
- `radarsat-flooding-northern-namibia-2011-03-24.jpg`

## 📝 Notes

- Images are compressed for web display
- Full-resolution versions available from source website
- Some images may require georeferencing for GIS use
- Contact source organization for raw data access