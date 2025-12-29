"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  temp: number;
  rain: number;
  description: string;
  town: string;
};

const towns = [
  { name: "Windhoek", lat: -22.5594, lon: 17.0832 },
  { name: "Oshakati", lat: -17.788, lon: 15.699 },
  { name: "Rundu", lat: -17.929, lon: 19.773 },
  { name: "Katima Mulilo", lat: -17.509, lon: 24.271 },
  { name: "Swakopmund", lat: -22.678, lon: 14.528 },
];

export default function WeatherPanel() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);

  useEffect(() => {
    async function fetchWeather() {
      const promises = towns.map(async (town) => {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${town.lat}&lon=${town.lon}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
        );
        const data = await res.json();
        return {
          temp: data.main.temp,
          rain: data.rain?.["1h"] || 0,
          description: data.weather[0].description,
          town: town.name,
        };
      });
      const results = await Promise.all(promises);
      setWeatherData(results);
    }

    fetchWeather();
  }, []);

  if (weatherData.length === 0) return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      padding: "1.5rem",
      marginBottom: "1.5rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #e2e8f0"
    }}>
      <h3 style={{ margin: "0 0 1rem 0", color: "#1e293b", fontSize: "1.25rem" }}>🌦️ Current Weather in Namibia</h3>
      <p style={{ color: "#64748b" }}>Loading weather data...</p>
    </div>
  );

  return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      padding: "1.5rem",
      marginBottom: "1.5rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #e2e8f0"
    }}>
      <h3 style={{ margin: "0 0 1rem 0", color: "#1e293b", fontSize: "1.25rem" }}>🌦️ Current Weather in Namibia</h3>
      {weatherData.map((weather, index) => (
        <div key={index} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: index < weatherData.length - 1 ? "1px solid #e2e8f0" : "none" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
              {weather.temp > 25 ? "☀️" : weather.temp > 15 ? "⛅" : "🌧️"}
            </span>
            <div>
              <p style={{ margin: "0", fontSize: "1.1rem", fontWeight: "bold", color: "#1e293b" }}>
                {weather.town}: {weather.temp}°C
              </p>
              <p style={{ margin: "0", fontSize: "0.8rem", color: "#64748b", textTransform: "capitalize" }}>
                {weather.description}
              </p>
            </div>
          </div>
          <p style={{ margin: "0", fontSize: "0.8rem", color: "#64748b" }}>
            <strong>Rain (last hour):</strong> {weather.rain} mm
          </p>
        </div>
      ))}
    </div>
  );
}
