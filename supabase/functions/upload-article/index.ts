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
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify user with their token
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // No admin/role check: any authenticated user can upload
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse multipart form data
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const authorsRaw = formData.get("authors") as string;
    const abstract = formData.get("abstract") as string;
    const keywordsRaw = formData.get("keywords") as string;
    const volume = formData.get("volume") as string;
    const issue = formData.get("issue") as string | null;
    const year = formData.get("year") as string;
    const pages = formData.get("pages") as string;
    const doi = formData.get("doi") as string | null;
    const topic = formData.get("topic") as string | null;
    const publishedDate = formData.get("published_date") as string;
    const pdfFile = formData.get("pdf") as File | null;

    // Validate required fields
    if (!title || !authorsRaw || !abstract || !keywordsRaw || !volume || !year || !pages || !publishedDate) {
      return new Response(JSON.stringify({ error: "Missing required fields: title, authors, abstract, keywords, volume, year, pages, published_date" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let pdfUrl: string | null = null;

    // Upload PDF if provided
    if (pdfFile && pdfFile.size > 0) {
      const fileName = `${Date.now()}-${pdfFile.name}`;
      const arrayBuffer = await pdfFile.arrayBuffer();
      const { error: uploadError } = await serviceClient.storage
        .from("journal-pdfs")
        .upload(fileName, arrayBuffer, {
          contentType: "application/pdf",
          upsert: false,
        });

      if (uploadError) {
        return new Response(JSON.stringify({ error: `PDF upload failed: ${uploadError.message}` }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: urlData } = serviceClient.storage
        .from("journal-pdfs")
        .getPublicUrl(fileName);
      pdfUrl = urlData.publicUrl;
    }

    // Insert article metadata
    const authors = authorsRaw.split(",").map((a: string) => a.trim()).filter(Boolean);
    const keywords = keywordsRaw.split(",").map((k: string) => k.trim()).filter(Boolean);

    const { data: article, error: insertError } = await serviceClient
      .from("journal_articles")
      .insert({
        title,
        authors,
        abstract,
        keywords,
        volume: parseInt(volume),
        issue: issue ? parseInt(issue) : null,
        year: parseInt(year),
        pages,
        doi: doi || null,
        topic: topic || null,
        published_date: publishedDate,
        pdf_url: pdfUrl,
      })
      .select()
      .single();

    if (insertError) {
      return new Response(JSON.stringify({ error: `Insert failed: ${insertError.message}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, article }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
