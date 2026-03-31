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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const userId = claimsData.claims.sub;

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );


    // (Removed admin check: allow all authenticated users)

    const url = new URL(req.url);

    if (req.method === "GET") {
      // Get all profiles, always return role: 'user'
      const { data: profiles, error: profilesError } = await serviceClient
        .from("profiles")
        .select("id, full_name, email, created_at")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const usersWithRoles = (profiles ?? []).map((p: any) => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        role: "user",
        created_at: p.created_at,
      }));

      return new Response(JSON.stringify(usersWithRoles), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT method for roles is now disabled (no-op)
    if (req.method === "PUT") {
      return new Response(JSON.stringify({ error: "Role management is disabled." }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  } catch (error) {
    // Enhanced error logging for debugging
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message + (error.stack ? `\nStack: ${error.stack}` : "");
    } else if (typeof error === "string") {
      errorMessage = error;
    } else {
      try {
        errorMessage = JSON.stringify(error);
      } catch {}
    }
    // Optionally log to console for Supabase logs
    console.error("admin-users function error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
