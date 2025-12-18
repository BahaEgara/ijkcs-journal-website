import { useState, useMemo } from "react";
import Header from "@/components/Header";
import JournalArticleCard from "@/components/JournalArticleCard";
import { allIssues, JournalIssue } from "@/data/journalArticles";
import { BookOpen, Calendar, Search, Filter } from "lucide-react";

const Archives = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  // Extract unique years
  const years = useMemo(() => {
    const yearSet = new Set(allIssues.map((issue) => issue.year.toString()));
    return Array.from(yearSet).sort((a, b) => parseInt(b) - parseInt(a));
  }, []);

  // Extract topics from keywords
  const topics = [
    { value: "all", label: "All Topics" },
    { value: "east africa", label: "East Africa" },
    { value: "conflict resolution", label: "Conflict Resolution" },
    { value: "agroecology", label: "Agroecology & Environment" },
    { value: "technology", label: "Indigenous Technology" },
    { value: "medicine", label: "Traditional Medicine" },
    { value: "oral literature", label: "Oral Literature" },
    { value: "cultural preservation", label: "Cultural Preservation" },
    { value: "governance", label: "Governance & Law" },
  ];

  // Filter issues and articles
  const filteredIssues = useMemo(() => {
    return allIssues
      .filter((issue) => {
        if (selectedYear !== "all" && issue.year.toString() !== selectedYear) {
          return false;
        }
        return true;
      })
      .map((issue) => ({
        ...issue,
        articles: issue.articles.filter((article) => {
          const matchesSearch =
            searchQuery === "" ||
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.authors.some((author) =>
              author.toLowerCase().includes(searchQuery.toLowerCase())
            ) ||
            article.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.keywords.some((keyword) =>
              keyword.toLowerCase().includes(searchQuery.toLowerCase())
            );

          const matchesTopic =
            selectedTopic === "all" ||
            article.keywords.some((keyword) =>
              keyword.toLowerCase().includes(selectedTopic.toLowerCase())
            ) ||
            article.title.toLowerCase().includes(selectedTopic.toLowerCase()) ||
            article.abstract.toLowerCase().includes(selectedTopic.toLowerCase());

          return matchesSearch && matchesTopic;
        }),
      }))
      .filter((issue) => issue.articles.length > 0);
  }, [searchQuery, selectedYear, selectedTopic]);

  const totalArticles = filteredIssues.reduce(
    (sum, issue) => sum + issue.articles.length,
    0
  );

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
                placeholder="Search by title, author, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300"
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
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Topic Filter */}
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300 cursor-pointer hover:border-accent"
              >
                {topics.map((topic) => (
                  <option key={topic.value} value={topic.value}>
                    {topic.label}
                  </option>
                ))}
              </select>

              {/* Results Count */}
              <span className="text-sm text-muted-foreground ml-auto">
                {totalArticles} article{totalArticles !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>
        </section>

        {/* Issues */}
        {filteredIssues.length > 0 ? (
          <div className="py-8 md:py-12 space-y-12">
            {filteredIssues.map((issue: JournalIssue, index) => (
              <section key={index} className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-4 pb-4 border-b border-border group">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
                    <BookOpen className="w-6 h-6 text-primary transition-colors duration-300 group-hover:text-accent" />
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
        ) : (
          <div className="py-16 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {allIssues.length === 0 ? "No Archives Yet" : "No Results Found"}
            </h2>
            <p className="text-muted-foreground">
              {allIssues.length === 0
                ? "The first issue will be published in February 2026."
                : "Try adjusting your search or filters."}
            </p>
          </div>
        )}
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
