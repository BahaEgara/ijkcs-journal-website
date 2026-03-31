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


    // Use service role for all queries, no admin check
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Gather stats
    const [articlesRes, usersRes, volumesRes, pdfsRes] = await Promise.all([
      serviceClient.from("journal_articles").select("id", { count: "exact", head: true }),
      serviceClient.from("profiles").select("id", { count: "exact", head: true }),
      serviceClient.from("journal_articles").select("volume"),
      serviceClient.from("journal_articles").select("id").not("pdf_url", "is", null),
    ]);

    const totalArticles = articlesRes.count ?? 0;
    const totalUsers = usersRes.count ?? 0;
    const uniqueVolumes = new Set((volumesRes.data ?? []).map((r: any) => r.volume)).size;
    const pdfCount = pdfsRes.data?.length ?? 0;

    return new Response(
      JSON.stringify({
        totalArticles,
        totalUsers,
        activeVolumes: uniqueVolumes,
        pdfsUploaded: pdfCount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
