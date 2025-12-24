import { useState } from "react";
import Header from "@/components/Header";
import JournalArticleCard from "@/components/JournalArticleCard";
import { 
  useJournalArticles, 
  useAvailableYears, 
  useAvailableTopics, 
  useAvailableVolumes,
  SearchFilters 
} from "@/hooks/useJournalArticles";
import { BookOpen, Calendar, Search, Filter, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const Archives = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedVolume, setSelectedVolume] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState("");
  const [keywordFilter, setKeywordFilter] = useState("");

  const filters: SearchFilters = {
    searchQuery: searchQuery || undefined,
    year: selectedYear !== "all" ? parseInt(selectedYear) : undefined,
    topic: selectedTopic !== "all" ? selectedTopic : undefined,
    volume: selectedVolume !== "all" ? parseInt(selectedVolume) : undefined,
    author: authorFilter || undefined,
    keyword: keywordFilter || undefined,
  };

  const { data: articles, isLoading } = useJournalArticles(filters);
  const { data: years = [] } = useAvailableYears();
  const { data: topics = [] } = useAvailableTopics();
  const { data: volumes = [] } = useAvailableVolumes();

  // Group articles by volume
  const groupedArticles = articles?.reduce((acc, article) => {
    const key = `${article.volume}-${article.year}`;
    if (!acc[key]) {
      acc[key] = {
        volume: article.volume,
        year: article.year,
        publishedDate: article.published_date,
        articles: [],
      };
    }
    acc[key].articles.push(article);
    return acc;
  }, {} as Record<string, { volume: number; year: number; publishedDate: string; articles: typeof articles }>) || {};

  const sortedGroups = Object.values(groupedArticles).sort(
    (a, b) => b.volume - a.volume || b.year - a.year
  );

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedYear("all");
    setSelectedTopic("all");
    setSelectedVolume("all");
    setAuthorFilter("");
    setKeywordFilter("");
  };

  const hasActiveFilters = 
    searchQuery || 
    selectedYear !== "all" || 
    selectedTopic !== "all" || 
    selectedVolume !== "all" ||
    authorFilter ||
    keywordFilter;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <section className="py-8 md:py-12 border-b border-border animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Archives</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Browse past and current issues of the International Journal of
            Indigenous Knowledge and Cultural Studies. All articles are available
            for free download in PDF format.
          </p>
        </section>

        {/* Search and Filters */}
        <section className="py-6 border-b border-border">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title or abstract..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300"
              />
            </div>

            {/* Additional Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Filter by author name..."
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300"
              />
              <input
                type="text"
                placeholder="Filter by keyword..."
                value={keywordFilter}
                onChange={(e) => setKeywordFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span>Filter by:</span>
              </div>

              {/* Year Filter */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300 cursor-pointer hover:border-accent"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Volume Filter */}
              <select
                value={selectedVolume}
                onChange={(e) => setSelectedVolume(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300 cursor-pointer hover:border-accent"
              >
                <option value="all">All Volumes</option>
                {volumes.map((vol) => (
                  <option key={vol} value={vol.toString()}>
                    Volume {vol}
                  </option>
                ))}
              </select>

              {/* Topic Filter */}
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300 cursor-pointer hover:border-accent"
              >
                <option value="all">All Topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}

              {/* Results Count */}
              <span className="text-sm text-muted-foreground ml-auto">
                {articles?.length || 0} article{articles?.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <div className="py-8 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-border rounded-xl p-6">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        )}

        {/* Issues */}
        {!isLoading && sortedGroups.length > 0 ? (
          <div className="py-8 md:py-12 space-y-12">
            {sortedGroups.map((group, index) => (
              <section key={index} className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-4 pb-4 border-b border-border group">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
                    <BookOpen className="w-6 h-6 text-primary transition-colors duration-300 group-hover:text-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">
                      Volume {group.volume} ({group.year})
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Published: {group.publishedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {group.articles.map((article) => (
                    <JournalArticleCard
                      key={article.id}
                      article={article}
                      showAbstract
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : !isLoading ? (
          <div className="py-16 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {hasActiveFilters ? "No Results Found" : "No Archives Yet"}
            </h2>
            <p className="text-muted-foreground">
              {hasActiveFilters
                ? "Try adjusting your search or filters."
                : "The first issue will be published in February 2026."}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © 2025 International Journal of Indigenous Knowledge and Cultural
              Studies (IJKCS). All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Archives;
