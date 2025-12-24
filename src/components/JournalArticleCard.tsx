import { Link } from "react-router-dom";
import { FileText, ExternalLink } from "lucide-react";
import { JournalArticle } from "@/hooks/useJournalArticles";

interface JournalArticleCardProps {
  article: JournalArticle;
  showAbstract?: boolean;
}

const JournalArticleCard = ({ article, showAbstract = false }: JournalArticleCardProps) => {
  return (
    <article className="border border-border rounded-xl p-6 bg-card transition-all duration-300 hover:shadow-lg hover:border-accent/30 hover:scale-[1.01] group">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
          <FileText className="w-5 h-5 text-accent" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold leading-tight mb-2 text-foreground transition-colors duration-300 group-hover:text-accent">
            {article.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-2">
            {article.authors.join(", ")}
          </p>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
            <span>Vol. {article.volume} ({article.year})</span>
            <span>pp. {article.pages}</span>
            {article.topic && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {article.topic}
              </span>
            )}
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
                  className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground transition-all duration-300 hover:bg-accent/20 hover:text-accent cursor-default"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
          
          <Link
            to={`/article/${article.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-accent text-accent-foreground transition-all duration-300 hover:scale-105 hover:shadow-md"
          >
            <ExternalLink className="w-4 h-4" />
            View & Download PDF
          </Link>
        </div>
      </div>
    </article>
  );
};

export default JournalArticleCard;
