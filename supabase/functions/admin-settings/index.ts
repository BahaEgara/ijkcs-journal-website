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

    // GET: fetch settings (by journal_name or id=1)
    if (req.method === "GET") {
      const url = new URL(req.url);
      const journalName = url.searchParams.get("journal_name");
      let query = supabase.from("journal_settings").select("*");
      if (journalName) {
        query = query.eq("journal_name", journalName).single();
      } else {
        query = query.eq("id", 1).single();
      }
      const { data, error } = await query;
      if (error && error.code !== "PGRST116") throw error;
      return new Response(JSON.stringify(data || {}), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT: upsert settings (by journal_name)
    if (req.method === "PUT") {
      const body = await req.json();
      if (!body.journal_name) {
        return new Response(JSON.stringify({ error: "journal_name is required" }), {
          status: 400,
          headers: corsHeaders,
        });
      }
      const { data, error } = await supabase
        .from("journal_settings")
        .upsert([body], { onConflict: "journal_name" })
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
