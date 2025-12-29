import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { message, region } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Fetch subscribers
  let query = supabase.from("sms_subscribers").select("phone_number");
  if (region && region !== "all") {
    query = query.eq("region", region);
  }

  const { data: subscribers, error } = await query;

  if (error || !subscribers?.length) {
    return new Response(
      JSON.stringify({ error: "No subscribers found" }),
      { status: 400 }
    );
  }

  const phones = subscribers.map((s) => s.phone_number).join(",");

  // Africa's Talking API call
  const response = await fetch("https://api.africastalking.com/version1/messaging", {
    method: "POST",
    headers: {
      "apiKey": Deno.env.get("AFRICASTALKING_API_KEY")!,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: Deno.env.get("AFRICASTALKING_USERNAME")!,
      to: phones,
      message: `[FLOOD ALERT] ${message}`,
      from: "FloodGIS",
    }),
  });

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: "SMS sending failed" }),
      { status: 500 }
    );
  }

  // Log alert
  await supabase.from("flood_alerts").insert({
    message,
    region: region === "all" ? null : region,
  });

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200 }
  );
});
