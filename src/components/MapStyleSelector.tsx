"use client";

import { useState } from "react";

interface MapStyleSelectorProps {
  currentStyle: string;
  onStyleChange: (style: string) => void;
}

const mapStyles = [
  {
    id: "streets-v12",
    name: "Streets",
    description: "General purpose map with streets and landmarks",
    preview: "🗺️"
  },
  {
    id: "satellite-v9",
    name: "Satellite",
    description: "High-resolution satellite imagery",
    preview: "🛰️"
  },
  {
    id: "satellite-streets-v12",
    name: "Satellite Streets",
    description: "Satellite imagery with street overlays",
    preview: "🌍"
  },
  {
    id: "light-v11",
    name: "Light",
    description: "Clean, minimalist light theme",
    preview: "☀️"
  },
  {
    id: "dark-v11",
    name: "Dark",
    description: "Modern dark theme for low light",
    preview: "🌙"
  },
  {
    id: "outdoors-v12",
    name: "Outdoors",
    description: "Perfect for hiking and outdoor activities",
    preview: "🏔️"
  }
];

export default function MapStyleSelector({ currentStyle, onStyleChange }: MapStyleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentStyleData = mapStyles.find(style => `mapbox://styles/mapbox/${style.id}` === currentStyle) || mapStyles[0];

  return (
    <div className="control-group">
      <div className="control-title">
        <span>🗺️</span>
        Map Style
      </div>

      <div className="form-group">
        <select
          className="form-select"
          value={currentStyle}
          onChange={(e) => onStyleChange(e.target.value)}
        >
          {mapStyles.map((style) => (
            <option key={style.id} value={`mapbox://styles/mapbox/${style.id}`}>
              {style.preview} {style.name}
            </option>
          ))}
        </select>
      </div>

      <div className="text-center mt-2">
        <small className="text-muted">
          {currentStyleData.description}
        </small>
      </div>
    </div>
  );
}