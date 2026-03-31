import { useState } from "react";
import { FileText, Upload, Users, Eye, BookOpen, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminOverview = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("admin-stats", {
        method: "GET",
      });
      if (error) throw error;
      return data as {
        totalArticles: number;
        totalUsers: number;
        activeVolumes: number;
        pdfsUploaded: number;
      };
    },
  });

  const { data: recentArticles, isLoading: articlesLoading } = useQuery({
    queryKey: ["admin-recent-articles"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("manage-articles", {
        method: "GET",
      });
      if (error) throw error;
      // Sort by updated_at descending and take the first 5
      const articles = (data?.articles ?? []).sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      return articles.slice(0, 5);
    },
  });

  const statCards = [
    { label: "Total Articles", value: stats?.totalArticles ?? "—", icon: FileText, trend: "" },
    { label: "PDFs Uploaded", value: stats?.pdfsUploaded ?? "—", icon: Upload, trend: stats ? `${Math.round(((stats.pdfsUploaded) / Math.max(stats.totalArticles, 1)) * 100)}% coverage` : "" },
    { label: "Active Volumes", value: stats?.activeVolumes ?? "—", icon: BookOpen, trend: "" },
    { label: "Registered Users", value: stats?.totalUsers ?? "—", icon: Users, trend: "" },
  ];

  const isLoading = statsLoading || articlesLoading;

  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Welcome back. Here's what's happening with IJIKCS.</p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading dashboard data...
        </div>
      )}

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow duration-200 group">
            <CardContent className="pt-5 sm:pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  {stat.trend && <p className="text-xs text-accent mt-2">{stat.trend}</p>}
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-base sm:text-lg">Recently Updated Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {(recentArticles ?? []).map((article) => (
              <div key={article.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 py-3 border-b border-border last:border-0">
                <div className="w-2 h-2 rounded-full bg-accent mt-1 sm:mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground">{article.title}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(article.updated_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {!articlesLoading && (!recentArticles || recentArticles.length === 0) && (
              <p className="text-xs sm:text-sm text-muted-foreground">No articles yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
