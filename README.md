# Flood Awareness GIS System

A web-based GIS platform for flood risk mapping and public awareness in Northern Namibia, developed as an academic prototype to support disaster preparedness and early warning systems.

## 🌊 Project Overview

This system provides interactive flood risk visualization using GIS technology, integrating real-time weather data, comprehensive Namibian hydrological data, spatial flood zones, and safe evacuation areas. Designed for the oshana floodplain environment of northern Namibia, it supports community-focused disaster risk reduction through accessible web-based tools with detailed spatial analysis capabilities.

### Key Features

- **Interactive Flood Risk Map**: Visualize flood-prone zones, river buffers, high-ground safe areas, and major Namibian rivers
- **Namibia-Specific GIS Data**: Integrated comprehensive hydrological data including Zambezi, Kunene, Okavango, and Orange river systems
- **Population Centers Mapping**: Display major cities and towns with population data for impact assessment
- **AI-Powered Analysis**: Grok AI integration for intelligent flood risk assessment and disaster management insights
- **Real-time Weather Integration**: Live rainfall, temperature, and humidity data from OpenWeatherMap
- **Safe Zones Database**: Spatially-enabled shelters and evacuation points using Supabase + PostGIS
- **River Monitoring Stations**: Real-time monitoring infrastructure locations for flood early warning
- **Elevation Profiles**: Detailed river elevation data for flood modeling and risk assessment
- **Early Warning Alerts**: Flood alerts with severity classification and population-sensitive prioritization
- **Seasonal Awareness**: Flood season indicators with heightened sensitivity during peak months (Jan-Mar)
- “SMS alert functionality is implemented conceptually on the client for demonstration purposes. In production, message dispatch would be secured using Supabase Edge Functions to protect API credentials.”

### Recent Developments

- **Namibia GIS Data Integration**: Added comprehensive hydrological datasets from Atlas of Namibia including major rivers, monitoring stations, and elevation profiles
- **Population Centers Integration**: Added major Namibian cities and towns with population data for enhanced flood impact assessment
- **AI Integration**: Integrated Grok AI for intelligent flood risk analysis and disaster management insights
- **Enhanced Mapping**: Integrated Mapbox GL JS with 3D globe view and advanced layer controls
- **Data Restructuring**: Organized spatial data into dedicated Namibia-specific directories for better maintainability
- **API Improvements**: Fixed Supabase connectivity and optimized data fetching for better performance

### Academic Context

Developed as part of research on "Identifying Flood Risk and Flood-Free Areas for Emergency Evacuations and Temporary Shelters in Northern Namibia Using GIS-Based Systems". Aligns with Disaster Risk Reduction (DRR) frameworks and Hazard, Vulnerability, and Capacity (HVC) models.

## 🚀 Live Demo

**Live System URL:** [Add your Vercel deployment URL here]

## 📋 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [System Architecture](#system-architecture)
- [Technologies](#technologies)
- [Data Sources](#data-sources)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenWeatherMap API key

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/flood-awareness-gis-system.git
   cd flood-awareness-gis-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env.local` file in the root directory (see `.env.example` for template):

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token
   ```

   **For XAI API Key (Grok AI Integration):**
   - Get your XAI API key from [x.ai](https://x.ai)
   - Set `XAI_API_KEY` in your Vercel dashboard (Environment Variables → Production)
   - Do NOT commit API keys to version control - use Vercel's environment variables instead

4. **Database Setup**

   Create the following tables in your Supabase database:

   ```sql
   -- Flood Alerts Table
   CREATE TABLE flood_alerts (
     id SERIAL PRIMARY KEY,
     region TEXT NOT NULL,
     alert_level TEXT NOT NULL,
     rainfall_mm DECIMAL,
     message TEXT,
     priority TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Safe Zones Table
   CREATE TABLE safe_zones (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     capacity INTEGER,
     location GEOGRAPHY(POINT, 4326)
   );
   ```

5. **GeoJSON Data**

   Place the following GeoJSON files in `public/data/` and `public/data/namibia/`:
   - `flood_zones.geojson` - Flood risk polygons
   - `high_ground_elevation.geojson` - Safe elevation areas
   - `river_flood_buffers.geojson` - Flood-prone river buffers
   - `northern_regions.geojson` - Administrative boundaries
   - `namibia/major_rivers.geojson` - Major Namibian river systems
   - `namibia/monitoring_stations.geojson` - River monitoring infrastructure
   - `namibia/catchments.geojson` - Watershed boundaries
   - `namibia/dams.geojson` - Dam locations
   - `namibia/river_tributaries.geojson` - Detailed tributary network

   Elevation profiles are available in `public/data/namibia/profiles/` as CSV files.

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Navigation

- **Home (/)**: Project overview and feature summary
- **Map (/map)**: Interactive GIS dashboard with flood risk visualization
- **Alerts (/alerts)**: Current flood alerts and rainfall monitoring

### Map Controls

- Toggle flood risk layers (river buffers, high-ground areas)
- Zoom and pan for detailed regional views
- Click on safe zone markers for shelter information

### API Usage

Fetch weather data for specific coordinates:
```
GET /api/weather?lat=-17.788&lon=15.699
```

Fetch current flood alerts:
```
GET /api/alerts
```

Fetch safe zones:
```
GET /api/safe-zones
```

## 🏗️ System Architecture

```
┌────────────────────────────────────────────┐
│            Public Web Browser               │
│        (Students / Community Users)         │
└────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────┐
│          Vercel (Next.js Frontend)           │
│  - Flood Awareness Dashboard                 │
│  - MapLibre GIS Map                           │
│  - Weather & Alert Panels                    │
└────────────────────────────────────────────┘
         │                     │
         │                     │
         ▼                     ▼
┌───────────────────┐   ┌────────────────────┐
│ Next.js API Routes │   │ External APIs       │
│ (Serverless)       │   │                    │
│ • /api/weather     │   │ • OpenWeatherMap   │
│ • /api/alerts      │   │   (Rainfall, Temp) │
│ • /api/safe-zones  │   └────────────────────┘
└───────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│          Supabase (PostgreSQL + PostGIS)     │
│                                            │
│ • Safe Zones (schools, halls)               │
│ • Flood Alerts                              │
│ • Historical flood data                     │
└────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│          Spatial Data Files (GeoJSON/CSV)    │
│                                            │
│ • Flood Risk Zones                          │
│ • Elevation / High Ground Areas             │
│ • Namibia Hydrological Data                 │
│ • River Monitoring Stations                 │
│ • Elevation Profiles (CSV)                  │
└────────────────────────────────────────────┘
```

## 🛠️ Technologies Used

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Mapbox GL JS**: Interactive mapping library with 3D globe support
- **Tailwind CSS**: Utility-first CSS framework

### Backend
- **Supabase**: PostgreSQL database with real-time capabilities
- **PostGIS**: Spatial database extension
- **Next.js API Routes**: Serverless backend functions

### External Services
- **OpenWeatherMap API**: Real-time weather data
- **OpenStreetMap**: Base map tiles

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **GitHub**: Version control
- **Vercel**: Cloud deployment and CI/CD

## 📊 Data Sources

### Spatial Data
- **Namibia Hydrological Data**: Major rivers (Zambezi, Kunene, Okavango, Orange), river tributaries, catchments, and dams
- **River Monitoring Stations**: Flow monitoring infrastructure locations
- **Elevation Profiles**: Detailed elevation data along major Namibian rivers for flood modeling
- **Population Centers**: Major cities and towns with population data for community impact assessment
- **Flood Zones**: Simulated flood risk polygons based on hydrological modeling
- **High Ground Areas**: Elevation-derived safe zones from DEM data
- **River Buffers**: Flood-prone areas along Kunene, Kavango, and Zambezi rivers
- **Safe Zones**: Schools and community facilities from OpenStreetMap

### Weather Data
- **OpenWeatherMap**: Live meteorological data including:
  - Rainfall intensity (mm/h)
  - Temperature (°C)
  - Humidity (%)
  - Weather conditions

### Database
- **Supabase/PostGIS**: Spatially-enabled PostgreSQL for:
  - Safe zone locations and capacities
  - Flood alert records with geographic context
  - Real-time data synchronization

## 🔌 API Endpoints

### GET /api/weather
Fetches current weather conditions for specified coordinates.

**Parameters:**
- `lat` (optional): Latitude (default: -17.788 for Oshakati)
- `lon` (optional): Longitude (default: 15.699 for Oshakati)

**Response:**
```json
{
  "location": "Oshakati",
  "temperature": 28.5,
  "humidity": 65,
  "condition": "light rain",
  "rainfall": 2.1
}
```

### GET /api/alerts
Retrieves current flood alerts ordered by creation date.

**Response:**
```json
[
  {
    "id": 1,
    "region": "Oshana",
    "alert_level": "High",
    "rainfall_mm": 45.2,
    "message": "Heavy rainfall detected",
    "priority": "High",
    "created_at": "2025-01-15T10:30:00Z"
  }
]
```

### GET /api/safe-zones
Returns safe zone locations with capacity information.

**Response:**
```json
[
  {
    "name": "Oshakati Primary School",
    "capacity": 500,
    "longitude": 15.699,
    "latitude": -17.788
  }
]
```

### GET /api/population-centers
Returns major Namibian cities and towns with population data as GeoJSON.

**Response:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Windhoek",
        "population": 431000,
        "region": "Khomas"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [17.0658, -22.5597]
      }
    }
  ]
}
```

### POST /api/grok
Provides AI-powered flood risk analysis and disaster management insights using Grok AI.

**Request Body:**
```json
{
  "prompt": "What are the flood risks in the Kunene River basin?"
}
```

**Response:**
```json
{
  "response": "Based on the geospatial data available, the Kunene River basin experiences seasonal flooding during the rainy season (December-March)...",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

## 🗄️ Database Schema

### flood_alerts
| Field | Type | Description |
|-------|------|-------------|
| id | SERIAL | Primary key |
| region | TEXT | Affected region |
| alert_level | TEXT | Alert severity (High/Moderate/Low) |
| rainfall_mm | DECIMAL | Rainfall amount |
| message | TEXT | Alert description |
| priority | TEXT | Population exposure priority |
| created_at | TIMESTAMP | Creation timestamp |

### safe_zones
| Field | Type | Description |
|-------|------|-------------|
| id | SERIAL | Primary key |
| name | TEXT | Shelter/facility name |
| capacity | INTEGER | Estimated capacity |
| location | GEOGRAPHY | Point geometry (PostGIS) |

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://fohtrrqbibinhqzmuhqr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_WEATHER_API_KEY=your-openweathermap-key
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-access-token
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow ESLint configuration
- Add tests for new features
- Update documentation for API changes
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

**This system is an academic prototype and should not replace official government flood warning systems.**

- Not intended for operational emergency response
- All data is simulated or derived from open sources
- Users should consult official authorities for flood warnings
- Developers assume no liability for use of this system

## 👨‍🎓 Author

**Immanuel T Ndatipo**
- Programme: Bachelor of Science in Computer Science & Information Technology (Honours) NQA LEVEL 7
- Institution: Triumphant College (Distance Programme)
- Year: 2025
- Project: Flood Awareness GIS System for Northern Namibia

## 📚 References

- Namibia Flood Risk Research (Participatory Early Warning)
- Disaster Risk Reduction (DRR) Framework
- GIS-based Flood Hazard Mapping Principles
- OpenStreetMap and OpenWeatherMap APIs

---

*"This map supports flood awareness and preparedness. It does not replace official flood warnings issued by authorities."*
