"use client";

interface SatelliteImage {
  id: string;
  title: string;
  satellite: string;
  date: string;
  filename: string;
  description: string;
  source: string;
}

const satelliteImages: SatelliteImage[] = [
  {
    id: "spot-5-2011-04-05",
    title: "SPOT-5 Satellite Imagery",
    satellite: "SPOT-5",
    date: "2011-04-05",
    filename: "spot-5-flooding-northern-namibia-2011-04-05.jpg",
    description: "Flooding in Northern Namibia - April 5, 2011",
    source: "Namibia Hydrological Services"
  },
  {
    id: "formosat-2011-04-12",
    title: "Formosat Satellite Imagery",
    satellite: "Formosat",
    date: "2011-04-12",
    filename: "formosat-flooding-northern-namibia-2011-04-12.jpg",
    description: "Flooding in Northern Namibia - April 12, 2011",
    source: "NSPO"
  },
  {
    id: "worldview-2011-04-15",
    title: "WorldView Satellite Imagery",
    satellite: "WorldView",
    date: "2011-04-15",
    filename: "worldview-flooding-northern-namibia-2011-04-15.jpg",
    description: "Flooding in Northern Namibia - April 15, 2011",
    source: "DigitalGlobe, USGS"
  },
  {
    id: "radarsat-2011-03-24",
    title: "RADARSAT Radar Imagery",
    satellite: "RADARSAT",
    date: "2011-03-24",
    filename: "radarsat-flooding-northern-namibia-2011-03-24.jpg",
    description: "Flooding in Northern Namibia - March 24, 2011",
    source: "Pacific Disaster Center"
  },
  {
    id: "tsx-2011-04-11",
    title: "TerraSAR-X Satellite Imagery",
    satellite: "TerraSAR-X",
    date: "2011-04-11",
    filename: "tsx-flooding-northern-namibia-2011-04-11.jpg",
    description: "Flooding in Northern Namibia - April 11, 2011",
    source: "DLR"
  },
  {
    id: "jaxa-2011-04-05",
    title: "JAXA Radar Imagery",
    satellite: "JAXA",
    date: "2011-04-05",
    filename: "jaxa-flooding-northern-namibia-2011-04-05.jpg",
    description: "Flooding in Northern Namibia - April 5, 2011",
    source: "JAXA"
  }
];

export default function HistoricalSatelliteImages() {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">🛰️</div>
        <h3 className="card-title">Historical Flood Satellite Imagery</h3>
      </div>

      <div className="card-content">
        <p className="text-sm text-gray-600 mb-4">
          Satellite images from the 2011 Namibia floods showing actual flood extents and patterns.
          These images help validate current flood risk assessments and provide historical context.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {satelliteImages.map((image) => (
            <div key={image.id} className="border rounded-lg overflow-hidden bg-gray-50">
              <div className="aspect-video bg-gray-200 relative">
                <img
                  src={`/satellite-images/historical-floods-2011/${image.filename}`}
                  alt={image.description}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Hide broken image and show placeholder
                    e.currentTarget.style.display = 'none';
                    const placeholder = e.currentTarget.parentElement?.querySelector('.image-placeholder');
                    if (placeholder) {
                      (placeholder as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
                <div className="image-placeholder absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">🛰️</div>
                    <p className="text-sm text-gray-600">Satellite Image</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Download from disasterscharter.org
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <h4 className="font-semibold text-sm mb-1">{image.title}</h4>
                <p className="text-xs text-gray-600 mb-2">{image.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>📅 {new Date(image.date).toLocaleDateString()}</span>
                  <span>🛰️ {image.satellite}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Source: {image.source}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">📋 How to Add Images:</h4>
          <ol className="text-xs text-gray-600 space-y-1">
            <li>1. Visit <a href="https://disasterscharter.org/library/products?disaster=flood&location=Namibia"
                       className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                       disasterscharter.org</a></li>
            <li>2. Download the satellite images for each flood event</li>
            <li>3. Save them as JPG files in <code className="bg-gray-200 px-1 rounded">public/satellite-images/historical-floods-2011/</code></li>
            <li>4. Update the <code className="bg-gray-200 px-1 rounded">filename</code> property in this component</li>
          </ol>
        </div>
      </div>
    </div>
  );
}