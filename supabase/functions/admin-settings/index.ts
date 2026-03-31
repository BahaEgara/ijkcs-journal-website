import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // GET: fetch settings (single row, id=1)
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("journal_settings")
        .select("*")
        .eq("id", 1)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return new Response(JSON.stringify(data || {}), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT: upsert settings (single row, id=1)
    if (req.method === "PUT") {
      const body = await req.json();
      const { data, error } = await supabase
        .from("journal_settings")
        .upsert([{ id: 1, ...body }], { onConflict: "id" })
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  } catch (error) {
    // Log the full error object for debugging
    console.error("admin-settings error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error,
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
