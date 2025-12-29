import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Read the GeoJSON file
    const filePath = path.join(process.cwd(), "public", "data", "namibia", "population_centers.geojson");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching population centers:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch population centers data" }),
      { status: 500 }
    );
  }
}