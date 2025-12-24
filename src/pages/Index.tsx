import { Link } from "react-router-dom";
import Header from "@/components/Header";
import JournalArticleCard from "@/components/JournalArticleCard";
import { useJournalArticles } from "@/hooks/useJournalArticles";
import { BookOpen, Users, Globe, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import readingPerson from "@/assets/readingperson.jpg";

const Index = () => {
  const { data: articles, isLoading } = useJournalArticles({ volume: 1 });

  const focusAreas = [
    "Cultural values, practices, and traditions",
    "Language, literature, and oral heritage",
    "Indigenous technologies and innovations",
    "Governance, law, and traditional conflict resolution",
    "Environmental stewardship and agroecology",
    "Health, healing knowledge, and spirituality",
    "Heritage preservation and knowledge transmission",
  ];

  // Get current issue info from articles
  const currentVolume = articles?.[0]?.volume || 1;
  const currentYear = articles?.[0]?.year || 2026;
  const publishedDate = articles?.[0]?.published_date || "February 2026";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Image Left, Content Right */}
        <section className="py-12 md:py-16 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center group">
                <img
                  src={readingPerson}
                  alt="African cultural heritage and knowledge"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-6">
                International Journal of Indigenous Knowledge and Cultural Studies
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                <span className="font-semibold text-foreground">IJKCS</span> is a peer-reviewed scholarly journal published by the{" "}
                <span className="font-semibold">African Centre for Advancement of Indigenous Knowledge and Culture (ACAIKC)</span>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The journal is dedicated to documenting, analyzing, and promoting African Indigenous Knowledge Systems.
              </p>
            </div>
          </div>
        </section>

        {/* Focus Areas */}
        <section className="py-8 md:py-12 border-t border-border">
          <h2 className="text-xl font-semibold mb-6">Areas of Focus</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {focusAreas.map((area, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-all duration-300 hover:bg-accent/10 hover:scale-[1.02] cursor-default group"
              >
                <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 transition-transform duration-300 group-hover:scale-150" />
                <span className="text-sm">{area}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Announcement */}
        <section className="py-8 md:py-12">
          <div className="rounded-xl bg-accent/10 border border-accent/20 p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:border-accent/40">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Announcement</h2>
                <p className="text-foreground">
                  The First Issue of IJKCS will be officially launched on <strong>27th February 2026</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Current Issue */}
        <section className="py-8 md:py-12 border-t border-border">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Current Issue</h2>
              <p className="text-muted-foreground">
                Volume {currentVolume} ({currentYear}) • Published: {publishedDate}
              </p>
            </div>
            <Link
              to="/archives"
              className="text-sm font-medium text-accent hover:underline hidden sm:block transition-colors duration-300 hover:text-accent/80"
            >
              View all archives →
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border rounded-xl p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {articles?.map((article) => (
                <JournalArticleCard key={article.id} article={article} showAbstract />
              ))}
            </div>
          )}
        </section>

        {/* Journal Insights */}
        <section className="py-12 md:py-16 border-t border-border">
          <h2 className="text-2xl font-bold mb-8 text-center">Journal Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-card transition-all duration-300 hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 group cursor-default">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
                <BookOpen className="w-7 h-7 text-primary transition-colors duration-300 group-hover:text-accent" />
              </div>
              <h3 className="font-semibold mb-2 transition-colors duration-300 group-hover:text-accent">Peer-Reviewed</h3>
              <p className="text-sm text-muted-foreground">
                Double-blind peer review process ensuring academic rigor and quality
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-card transition-all duration-300 hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 group cursor-default">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
                <Globe className="w-7 h-7 text-primary transition-colors duration-300 group-hover:text-accent" />
              </div>
              <h3 className="font-semibold mb-2 transition-colors duration-300 group-hover:text-accent">Open Access</h3>
              <p className="text-sm text-muted-foreground">
                Free access to all articles promoting global knowledge sharing
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-card transition-all duration-300 hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 group cursor-default">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
                <Users className="w-7 h-7 text-primary transition-colors duration-300 group-hover:text-accent" />
              </div>
              <h3 className="font-semibold mb-2 transition-colors duration-300 group-hover:text-accent">International Editorial Board</h3>
              <p className="text-sm text-muted-foreground">
                Scholars from across Africa and the global diaspora
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">About IJKCS</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                International Journal of Indigenous Knowledge and Cultural Studies (IJKCS) is published by the African Centre for Advancement of Indigenous Knowledge and Culture (ACAIKC).
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-accent transition-colors duration-300">Home</Link></li>
                <li><Link to="/archives" className="hover:text-accent transition-colors duration-300">Archives</Link></li>
                <li><Link to="/about" className="hover:text-accent transition-colors duration-300">About the Journal</Link></li>
                <li><Link to="/contact" className="hover:text-accent transition-colors duration-300">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>P.O. Box 72-00618, Nairobi, Kenya</li>
                <li>
                  <a href="mailto:info.ijikcs@gmail.com" className="hover:text-accent transition-colors duration-300">
                    info.ijikcs@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 International Journal of Indigenous Knowledge and Cultural Studies (IJKCS). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
