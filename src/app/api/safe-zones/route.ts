import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("safe_zones")
      .select("name, capacity, location")
      .limit(100); // Reasonable limit for map markers

    if (error) {
      console.error("Supabase error fetching safe zones:", error);
      return new Response(
        JSON.stringify({ error: "Database error" }),
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify([]),
        {
          status: 200,
          headers: {
            "Cache-Control": "public, max-age=300", // Cache for 5 minutes
          },
        }
      );
    }

    // Validate and transform the data
    const formatted = data
      .filter((z: any) => z.location && z.location.coordinates)
      .map((z: any) => {
        const coords = z.location.coordinates;
        if (!Array.isArray(coords) || coords.length !== 2) {
          console.warn("Invalid coordinates for safe zone:", z.name);
          return null;
        }

        return {
          name: z.name || "Unnamed Shelter",
          capacity: Math.max(0, z.capacity || 0), // Ensure non-negative
          longitude: coords[0],
          latitude: coords[1],
        };
      })
      .filter(Boolean); // Remove null entries

    return new Response(
      JSON.stringify(formatted),
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300", // Cache for 5 minutes
        },
      }
    );
  } catch (error) {
    console.error("Safe zones API route error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
