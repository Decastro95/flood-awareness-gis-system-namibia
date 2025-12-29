import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const lat = req.nextUrl.searchParams.get("lat") || "-17.788"; // Oshakati
    const lon = req.nextUrl.searchParams.get("lon") || "15.699";

    // Validate coordinates
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (isNaN(latNum) || isNaN(lonNum)) {
      return new Response(
        JSON.stringify({ error: "Invalid latitude or longitude parameters" }),
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_WEATHER_API_KEY) {
      console.error("Weather API key not configured");
      return new Response(
        JSON.stringify({ error: "Weather service temporarily unavailable" }),
        { status: 503 }
      );
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latNum}&lon=${lonNum}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error(`Weather API error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: "Weather data temporarily unavailable" }),
        { status: 503 }
      );
    }

    const data = await response.json();

    // Validate API response
    if (!data.main || !data.weather || !data.weather[0]) {
      console.error("Invalid weather API response structure");
      return new Response(
        JSON.stringify({ error: "Weather data format error" }),
        { status: 502 }
      );
    }

    // Return simplified JSON for frontend
    return new Response(
      JSON.stringify({
        location: data.name || "Unknown Location",
        temperature: Math.round(data.main.temp * 10) / 10, // Round to 1 decimal
        humidity: data.main.humidity,
        condition: data.weather[0].description,
        rainfall: data.rain?.["1h"] || 0,
        windSpeed: data.wind?.speed || 0,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300", // Cache for 5 minutes
        },
      }
    );
  } catch (error) {
    console.error("Weather API route error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
