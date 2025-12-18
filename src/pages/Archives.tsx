import Header from "@/components/Header";
import JournalArticleCard from "@/components/JournalArticleCard";
import { allIssues, JournalIssue } from "@/data/journalArticles";
import { BookOpen, Calendar } from "lucide-react";

const Archives = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <section className="py-8 md:py-12 border-b border-border">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Archives</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Browse past and current issues of the International Journal of Indigenous Knowledge and Cultural Studies. 
            All articles are available for free download in PDF format.
          </p>
        </section>

        {/* Issues */}
        {allIssues.length > 0 ? (
          <div className="py-8 md:py-12 space-y-12">
            {allIssues.map((issue: JournalIssue, index) => (
              <section key={index} className="space-y-6">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">
                      Volume {issue.volume} ({issue.year})
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Published: {issue.publishedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {issue.articles.map((article) => (
                    <JournalArticleCard key={article.id} article={article} showAbstract />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Archives Yet</h2>
            <p className="text-muted-foreground">
              The first issue will be published in February 2026.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 International Journal of Indigenous Knowledge and Cultural Studies (IJKCS). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Archives;
