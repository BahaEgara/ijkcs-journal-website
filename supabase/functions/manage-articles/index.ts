import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};


async function verifyAuth(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) throw new Error("UNAUTHORIZED");

  const token = authHeader.replace("Bearer ", "");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: { user }, error } = await userClient.auth.getUser(token);
  if (error || !user) throw new Error("UNAUTHORIZED");

  const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
  return { serviceClient, user };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { serviceClient } = await verifyAuth(req);
    const url = new URL(req.url);

    if (req.method === "GET") {
      // List all articles for admin
      const { data, error } = await serviceClient
        .from("journal_articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Also get unique volumes
      const volumes = [...new Set((data ?? []).map((d: any) => d.volume))].sort(
        (a: number, b: number) => b - a
      );

      return new Response(JSON.stringify({ articles: data, volumes }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "DELETE") {
      const { id } = await req.json();
      if (!id) {
        return new Response(JSON.stringify({ error: "Missing article id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get article to check for PDF to delete from storage
      const { data: article } = await serviceClient
        .from("journal_articles")
        .select("pdf_url")
        .eq("id", id)
        .maybeSingle();

      if (article?.pdf_url) {
        // Extract filename from public URL
        const urlParts = article.pdf_url.split("/journal-pdfs/");
        if (urlParts.length > 1) {
          const fileName = decodeURIComponent(urlParts[1]);
          await serviceClient.storage.from("journal-pdfs").remove([fileName]);
        }
      }

      const { error } = await serviceClient
        .from("journal_articles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const status = err.message === "UNAUTHORIZED" ? 401 : err.message === "FORBIDDEN" ? 403 : 500;
    return new Response(JSON.stringify({ error: err.message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
