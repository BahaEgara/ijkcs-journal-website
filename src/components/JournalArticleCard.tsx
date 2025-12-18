import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JournalArticle } from "@/data/journalArticles";

interface JournalArticleCardProps {
  article: JournalArticle;
  showAbstract?: boolean;
}

const JournalArticleCard = ({ article, showAbstract = false }: JournalArticleCardProps) => {
  return (
    <div className="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold leading-tight mb-2 text-foreground">
            {article.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-2">
            {article.authors.join(", ")}
          </p>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
            <span>Vol. {article.volume} ({article.year})</span>
            <span>pp. {article.pages}</span>
          </div>
          
          {showAbstract && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {article.abstract}
            </p>
          )}
          
          {article.keywords && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.keywords.slice(0, 4).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            asChild
          >
            <a href={article.pdfUrl} target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JournalArticleCard;
