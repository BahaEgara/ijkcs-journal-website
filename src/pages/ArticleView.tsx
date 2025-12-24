import { useParams, Link } from "react-router-dom";
import { useJournalArticle } from "@/hooks/useJournalArticles";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, FileText, Users, Calendar, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const ArticleView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: article, isLoading, error } = useJournalArticle(id || "");

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a sample PDF blob for demonstration
    const pdfContent = `
INTERNATIONAL JOURNAL OF INDIGENOUS KNOWLEDGE AND CULTURAL STUDIES (IJKCS)
Volume ${article?.volume}, ${article?.year}, Pages ${article?.pages}

${article?.title}

Authors: ${article?.authors.join(", ")}

Abstract:
${article?.abstract}

Keywords: ${article?.keywords.join(", ")}

Published: ${article?.published_date}

---
© ${article?.year} African Centre for Advancement of Indigenous Knowledge and Culture (ACAIKC)
This is an open access article distributed under the terms of the Creative Commons Attribution License (CC BY 4.0).
    `;

    const blob = new Blob([pdfContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IJKCS-${article?.volume}-${article?.year}-${article?.pages.replace("-", "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Article Not Found</h1>
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
      {/* Header Actions - Hidden on print */}
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
                className="hover:bg-primary/10 hover:border-primary transition-all duration-300"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button
                onClick={handleDownload}
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
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

        {/* Article Title */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Authors */}
        <div className="flex items-center gap-2 mb-6 text-muted-foreground">
          <Users className="h-5 w-5 text-primary" />
          <span className="font-medium">{article.authors.join(", ")}</span>
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>Vol. {article.volume}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{article.published_date}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Pages {article.pages}</span>
          </div>
        </div>

        {/* Abstract */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Abstract
          </h3>
          <p className="text-muted-foreground leading-relaxed text-justify">
            {article.abstract}
          </p>
        </div>

        {/* Keywords */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {article.keywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Topic */}
        {article.topic && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Topic
            </h3>
            <Badge variant="outline" className="border-primary text-primary">
              {article.topic}
            </Badge>
          </div>
        )}

        {/* Citation */}
        <div className="bg-muted/50 rounded-lg p-6 mb-8 print:bg-gray-100">
          <h3 className="text-lg font-semibold text-foreground mb-3">How to Cite</h3>
          <p className="text-sm text-muted-foreground italic">
            {article.authors.join(", ")} ({article.year}). {article.title}. 
            <em> International Journal of Indigenous Knowledge and Cultural Studies</em>, 
            {article.volume}, {article.pages}.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground border-t border-border pt-8">
          <p>© {article.year} African Centre for Advancement of Indigenous Knowledge and Culture (ACAIKC)</p>
          <p className="mt-2">
            This is an open access article distributed under the terms of the{" "}
            <span className="text-primary">Creative Commons Attribution License (CC BY 4.0)</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;
