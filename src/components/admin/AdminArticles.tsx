import { useState } from "react";
import { Search, Trash2, FileText, Download, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminArticles = () => {
  const [search, setSearch] = useState("");
  const [filterVolume, setFilterVolume] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("manage-articles", {
        method: "GET",
      });

      if (error) throw error;
      return data as { articles: any[]; volumes: number[] };
    },
  });

  const articles = data?.articles ?? [];
  const volumes = data?.volumes ?? [];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.functions.invoke("manage-articles", {
        method: "DELETE",
        body: { id },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["journal-articles"] });
      toast({ title: "Article deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting article", description: error.message, variant: "destructive" });
    },
  });

  const filtered = articles.filter((a: any) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.authors.some((auth: string) => auth.toLowerCase().includes(search.toLowerCase()));
    const matchesVolume = filterVolume === "all" || a.volume.toString() === filterVolume;
    return matchesSearch && matchesVolume;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Manage Articles</h1>
          <p className="text-muted-foreground mt-1">{articles.length} articles in the database</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterVolume} onValueChange={setFilterVolume}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by volume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Volumes</SelectItem>
                {volumes.map((v: number) => (
                  <SelectItem key={v} value={v.toString()}>Volume {v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading articles...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[300px]">Title</TableHead>
                    <TableHead>Authors</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>PDF</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((article: any) => (
                    <TableRow key={article.id} className="group hover:bg-muted/40 transition-colors">
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {article.authors.join(", ")}
                      </TableCell>
                      <TableCell className="text-sm">
                        Vol. {article.volume}{article.issue ? `, Issue ${article.issue}` : ""} ({article.year})
                      </TableCell>
                      <TableCell>
                        {article.topic && <Badge variant="secondary" className="text-xs">{article.topic}</Badge>}
                      </TableCell>
                      <TableCell>
                        {article.pdf_url ? (
                          <span className="inline-flex items-center gap-1 text-accent text-xs font-medium">
                            <FileText className="h-3 w-3" /> Uploaded
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">Missing</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {article.pdf_url && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => window.open(article.pdf_url!, "_blank")}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => {
                              if (confirm("Delete this article?")) {
                                deleteMutation.mutate(article.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No articles found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminArticles;
