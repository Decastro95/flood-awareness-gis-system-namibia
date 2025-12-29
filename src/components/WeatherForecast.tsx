'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const locations = [
  { name: 'Oshakati', lat: -17.7833, lon: 15.6833 },
  { name: 'Ondangwa', lat: -17.9167, lon: 15.9833 },
  { name: 'Ongwediva', lat: -17.7833, lon: 15.7667 },
  { name: 'Eenhana', lat: -17.4667, lon: 16.3333 },
  { name: 'Ruacana', lat: -17.4167, lon: 14.2167 },
  { name: 'Outapi', lat: -17.5000, lon: 14.9833 },
  { name: 'Oshikuku', lat: -17.6333, lon: 15.4667 },
  { name: 'Okahao', lat: -17.8833, lon: 15.0667 },
  { name: 'Oniipa', lat: -17.8167, lon: 16.0333 },
];

type CurrentWeather = {
  location: string;
  temp: number;
  humidity: number;
  rain: number;
  time: string;
};

type DailyForecast = {
  date: string;
  [key: string]: number | string; // Dynamic for each location's rainfall
};

export default function WeatherForecast() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [currentAll, setCurrentAll] = useState<CurrentWeather[]>([]);
  const [forecastAll, setForecastAll] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMultiWeather = async () => {
    try {
      // Build comma-separated lists
      const latitudes = locations.map(l => l.lat).join(',');
      const longitudes = locations.map(l => l.lon).join(',');

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitudes}&longitude=${longitudes}&current=temperature_2m,relative_humidity_2m,precipitation&daily=precipitation_sum&timezone=Africa%2FWindhoek`;

      const res = await fetch(url);
      const data = await res.json();

      // Current weather for each location
      const currentList: CurrentWeather[] = locations.map((loc, i) => ({
        location: loc.name,
        temp: data.current.temperature_2m[i],
        humidity: data.current.relative_humidity_2m[i],
        rain: data.current.precipitation[i],
        time: new Date(data.current.time[i]).toLocaleString('en-NA'),
      }));
      setCurrentAll(currentList);

      // Combined daily forecast
      const dailyForecast: DailyForecast[] = data.daily.time[0].map((date: string, dayIndex: number) => {
        const entry: DailyForecast = { date: new Date(date).toLocaleDateString('en-NA', { weekday: 'short', day: 'numeric' }) };
        locations.forEach((loc, locIndex) => {
          entry[loc.name] = data.daily.precipitation_sum[locIndex][dayIndex];
        });
        return entry;
      });
      setForecastAll(dailyForecast);

      setError(null);
    } catch (err) {
      setError('Failed to load multi-location weather');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMultiWeather();
    const interval = setInterval(fetchMultiWeather, 30 * 60 * 1000); // Refresh every 30 mins
    return () => clearInterval(interval);
  }, []);

  const selectedCurrent = currentAll.find(c => c.location === selectedLocation.name);

  if (loading) return <Card><CardContent><p>Loading forecasts for northern towns...</p></CardContent></Card>;
  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>🌧️ Multi-Location Weather Forecast</CardTitle>
        <Select value={selectedLocation.name} onValueChange={(value) => setSelectedLocation(locations.find(l => l.name === value)!)}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map(loc => (
              <SelectItem key={loc.name} value={loc.name}>{loc.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {/* Current for selected */}
        {selectedCurrent && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Current in {selectedCurrent.location} ({selectedCurrent.time})</p>
            <div className="flex justify-between items-center mt-2">
              <div>
                <p className="text-3xl font-bold">{selectedCurrent.temp}°C</p>
                <p>Humidity: {selectedCurrent.humidity}%</p>
                <p>Rain (hour): {selectedCurrent.rain} mm</p>
              </div>
              {selectedCurrent.rain > 5 && (
                <Alert variant="destructive" className="text-sm">
                  <AlertDescription>Ongoing heavy rain</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}

        {/* Combined Rainfall Chart */}
        <Typography variant="subtitle1" className="mb-2">7-Day Rainfall Across Northern Towns</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastAll}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => `${value.toFixed(1)} mm`} />
            <Legend />
            {locations.map(loc => (
              <Line
                key={loc.name}
                type="monotone"
                dataKey={loc.name}
                stroke={loc.name === selectedLocation.name ? '#ef4444' : '#3b82f6'}
                strokeWidth={loc.name === selectedLocation.name ? 4 : 2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        {/* High Risk Alerts */}
        {forecastAll.some(day => Object.values(day).some((v: any) => typeof v === 'number' && v > 30)) && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              <strong>Flood Risk:</strong> Heavy rainfall (>30mm/day) forecast in multiple locations.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
