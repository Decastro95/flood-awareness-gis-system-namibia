import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("flood_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50); // Limit results to prevent large responses

    if (error) {
      console.error("Supabase error fetching alerts:", error);
      return new Response(
        JSON.stringify({ error: "Database error" }),
        { status: 500 }
      );
    }

    // Validate and sanitize data
    const sanitizedData = (data || []).map(alert => ({
      id: alert.id,
      region: alert.region || "Unknown",
      alert_level: alert.alert_level || "Unknown",
      rainfall_mm: alert.rainfall_mm || 0,
      message: alert.message || "No details available",
      priority: alert.priority || "Normal",
      created_at: alert.created_at,
    }));

    return new Response(
      JSON.stringify(sanitizedData),
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60", // Cache for 1 minute
        },
      }
    );
  } catch (error) {
    console.error("Alerts API route error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
