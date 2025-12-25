import { useParams, Link } from "react-router-dom";
import { useJournalArticle } from "@/hooks/useJournalArticles";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Printer,
  FileText,
  Users,
  Calendar,
  BookOpen,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const SUPABASE_PUBLIC_BASE =
  "https://eqofxvkwjigdwkizygqp.supabase.co/storage/v1/object/public";

const ArticleView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: article, isLoading, error } = useJournalArticle(id || "");

  const handlePrint = () => {
    window.print();
  };

  // ✅ CORRECT PDF DOWNLOAD HANDLER
  const handleDownload = () => {
    if (!article?.pdf_url) {
      alert("PDF not available for this article.");
      return;
    }

    const pdfUrl = article.pdf_url.startsWith("http")
      ? article.pdf_url
      : `${SUPABASE_PUBLIC_BASE}/${article.pdf_url}`;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", "");
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link to="/archives">
            <Button variant="ghost" className="mb-8 hover:bg-primary/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Archives
            </Button>
          </Link>
          <div className="text-center py-16">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Article Not Found
            </h1>
            <p className="text-muted-foreground">
              The article you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Header Actions */}
      <div className="print:hidden border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link to="/archives">
              <Button variant="ghost" className="hover:bg-primary/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Archives
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="hover:bg-primary/10 hover:border-primary"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button
                onClick={handleDownload}
                disabled={!article.pdf_url}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Download className="mr-2 h-4 w-4" />
                {article.pdf_url ? "Download PDF" : "PDF Unavailable"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Journal Header */}
        <div className="text-center mb-8 pb-8 border-b border-border print:border-black">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            International Journal of Indigenous Knowledge and Cultural Studies
          </h2>
          <p className="text-muted-foreground text-sm">
            Volume {article.volume}, {article.year} • Pages {article.pages}
          </p>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-serif font-bold mb-6">
          {article.title}
        </h1>

        {/* Authors */}
        <div className="flex items-center gap-2 mb-6 text-muted-foreground">
          <Users className="h-5 w-5 text-primary" />
          <span>{article.authors.join(", ")}</span>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> Vol. {article.volume}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> {article.published_date}
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" /> Pages {article.pages}
          </div>
        </div>

        {/* Abstract */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Abstract</h3>
          <p className="text-muted-foreground text-justify">
            {article.abstract}
          </p>
        </div>

        {/* Keywords */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {article.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Topic */}
        {article.topic && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Topic</h3>
            <Badge variant="outline">{article.topic}</Badge>
          </div>
        )}

        {/* Citation */}
        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-3">How to Cite</h3>
          <p className="text-sm italic text-muted-foreground">
            {article.authors.join(", ")} ({article.year}). {article.title}.{" "}
            <em>
              International Journal of Indigenous Knowledge and Cultural Studies
            </em>
            , {article.volume}, {article.pages}.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground border-t pt-8">
          <p>
            © {article.year} African Centre for Advancement of Indigenous
            Knowledge and Culture (ACAIKC)
          </p>
          <p className="mt-2">
            Open access under{" "}
            <span className="text-primary">
              Creative Commons Attribution (CC BY 4.0)
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;
