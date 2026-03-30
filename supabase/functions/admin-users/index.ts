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

    // Verify admin
    const { data: roleData } = await serviceClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: corsHeaders,
      });
    }

    const url = new URL(req.url);

    if (req.method === "GET") {
      // Get all profiles with their roles
      const { data: profiles, error: profilesError } = await serviceClient
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await serviceClient
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      const usersWithRoles = (profiles ?? []).map((p: any) => {
        const userRole = (roles ?? []).find((r: any) => r.user_id === p.id);
        return {
          id: p.id,
          full_name: p.full_name,
          email: p.email,
          role: userRole?.role ?? "user",
          created_at: p.created_at,
        };
      });

      return new Response(JSON.stringify(usersWithRoles), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "PUT") {
      // Update user role
      const { user_id, role } = await req.json();

      if (!user_id || !role || !["admin", "moderator", "user"].includes(role)) {
        return new Response(JSON.stringify({ error: "Invalid input" }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      // Delete existing role
      await serviceClient
        .from("user_roles")
        .delete()
        .eq("user_id", user_id);

      // Insert new role if not default "user"
      if (role !== "user") {
        const { error } = await serviceClient
          .from("user_roles")
          .insert({ user_id, role });

        if (error) throw error;
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
