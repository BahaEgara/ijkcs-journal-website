import { useState } from "react";
import {
  Search, Trash2, FileText, Download, Filter,
  Loader2, AlertTriangle, Pencil, X, Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Article {
  id: string;
  title: string;
  authors: string[];
  orcid?: string | null;
  abstract?: string;
  keywords?: string[];
  volume?: number;
  issue?: number;
  year?: number;
  pages?: string;
  topic?: string;
  doi?: string;
  pdf_url?: string;
  published_date?: string;
}

interface EditFormState {
  title: string;
  authors: string;       // comma-separated for the input
  orcid: string;
  abstract: string;
  keywords: string;      // comma-separated for the input
  volume: string;
  issue: string;
  year: string;
  pages: string;
  topic: string;
  doi: string;
  published_date: string;
}

const ORCID_REGEX = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;

const toFormState = (a: Article): EditFormState => ({
  title:          a.title ?? "",
  authors:        Array.isArray(a.authors) ? a.authors.join(", ") : "",
  orcid:          a.orcid ?? "",
  abstract:       a.abstract ?? "",
  keywords:       Array.isArray(a.keywords) ? a.keywords.join(", ") : "",
  volume:         a.volume?.toString() ?? "",
  issue:          a.issue?.toString() ?? "",
  year:           a.year?.toString() ?? "",
  pages:          a.pages ?? "",
  topic:          a.topic ?? "",
  doi:            a.doi ?? "",
  published_date: a.published_date ?? "",
});

// ── Component ─────────────────────────────────────────────────────────────────
const AdminArticles = () => {
  const [search, setSearch] = useState("");
  const [filterVolume, setFilterVolume] = useState<string>("all");

  // Delete dialog state
  const [articleToDelete, setArticleToDelete] = useState<{ id: string; title: string } | null>(null);

  // Edit dialog state
  const [articleToEdit, setArticleToEdit] = useState<Article | null>(null);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);
  const [orcidError, setOrcidError] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("manage-articles", {
        method: "GET",
      });
      if (error) throw error;
      return data as { articles: Article[]; volumes: number[] };
    },
  });

  const articles = data?.articles ?? [];
  const volumes  = data?.volumes  ?? [];

  // ── Delete mutation ────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.functions.invoke("manage-articles", {
        method: "DELETE",
        body: { id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["journal-articles"] });
      setArticleToDelete(null);
      toast({ title: "Article deleted successfully" });
    },
    onError: (error: Error) => {
      setArticleToDelete(null);
      toast({
        title: "Error deleting article",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // ── Edit mutation ──────────────────────────────────────────────────────────
  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { data, error } = await supabase.functions.invoke("manage-articles", {
        method: "POST",
        body: { _method: "PATCH", id, updates },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["journal-articles"] });
      setArticleToEdit(null);
      setEditForm(null);
      setOrcidError("");
      toast({ title: "Article updated successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating article",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const openEdit = (article: Article) => {
    setArticleToEdit(article);
    setEditForm(toFormState(article));
    setOrcidError("");
  };

  const handleEditField = (field: keyof EditFormState, value: string) => {
    setEditForm((prev) => prev ? { ...prev, [field]: value } : prev);
    if (field === "orcid") setOrcidError("");
  };

  const handleEditSave = () => {
    if (!articleToEdit || !editForm) return;

    // Validate ORCID if provided
    const orcidValue = editForm.orcid.trim();
    if (orcidValue !== "" && !ORCID_REGEX.test(orcidValue)) {
      setOrcidError("Invalid format. Expected: 0000-0000-0000-0000");
      return;
    }

    const updates: Record<string, any> = {
      title:          editForm.title.trim(),
      authors:        editForm.authors.split(",").map((s) => s.trim()).filter(Boolean),
      orcid:          orcidValue || null,
      abstract:       editForm.abstract.trim(),
      keywords:       editForm.keywords.split(",").map((s) => s.trim()).filter(Boolean),
      volume:         editForm.volume         ? Number(editForm.volume)  : undefined,
      issue:          editForm.issue          ? Number(editForm.issue)   : undefined,
      year:           editForm.year           ? Number(editForm.year)    : undefined,
      pages:          editForm.pages.trim()   || undefined,
      topic:          editForm.topic.trim()   || undefined,
      doi:            editForm.doi.trim()     || undefined,
      published_date: editForm.published_date || undefined,
    };

    editMutation.mutate({ id: articleToEdit.id, updates });
  };

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = articles.filter((a) => {
    const title   = a.title ?? "";
    const authors = Array.isArray(a.authors) ? a.authors : [];
    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      authors.some((auth) => auth.toLowerCase().includes(search.toLowerCase()));
    const matchesVolume =
      filterVolume === "all" || (a.volume && a.volume.toString() === filterVolume);
    return matchesSearch && matchesVolume;
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 px-2 sm:px-0">

      {/* ── Delete confirmation dialog ────────────────────────────────────── */}
      <AlertDialog
        open={!!articleToDelete}
        onOpenChange={(open) => !open && setArticleToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Article
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                &ldquo;{articleToDelete?.title}&rdquo;
              </span>
              ? This will also remove the associated PDF from storage. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={() => articleToDelete && deleteMutation.mutate(articleToDelete.id)}
            >
              {deleteMutation.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Deleting…</>
              ) : (
                "Delete Article"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Edit dialog ───────────────────────────────────────────────────── */}
      <Dialog
        open={!!articleToEdit}
        onOpenChange={(open) => {
          if (!open) {
            setArticleToEdit(null);
            setEditForm(null);
            setOrcidError("");
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit Article
            </DialogTitle>
          </DialogHeader>

          {editForm && (
            <div className="grid gap-4 py-2">

              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => handleEditField("title", e.target.value)}
                  placeholder="Article title"
                />
              </div>

              {/* Authors + ORCID side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-authors">
                    Authors{" "}
                    <span className="text-xs text-muted-foreground font-normal">(comma-separated)</span>
                  </Label>
                  <Input
                    id="edit-authors"
                    value={editForm.authors}
                    onChange={(e) => handleEditField("authors", e.target.value)}
                    placeholder="Jane Doe, John Smith"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-orcid">
                    ORCID iD{" "}
                    <span className="text-xs text-muted-foreground font-normal">(corresponding author)</span>
                  </Label>
                  <Input
                    id="edit-orcid"
                    value={editForm.orcid}
                    onChange={(e) => handleEditField("orcid", e.target.value)}
                    placeholder="0000-0000-0000-0000"
                    className={orcidError ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {orcidError ? (
                    <p className="text-xs text-destructive">{orcidError}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Leave blank to clear</p>
                  )}
                </div>
              </div>

              {/* Abstract */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-abstract">Abstract</Label>
                <Textarea
                  id="edit-abstract"
                  value={editForm.abstract}
                  onChange={(e) => handleEditField("abstract", e.target.value)}
                  placeholder="Article abstract…"
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Keywords */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-keywords">
                  Keywords{" "}
                  <span className="text-xs text-muted-foreground font-normal">(comma-separated)</span>
                </Label>
                <Input
                  id="edit-keywords"
                  value={editForm.keywords}
                  onChange={(e) => handleEditField("keywords", e.target.value)}
                  placeholder="indigenous knowledge, oral traditions"
                />
              </div>

              {/* Volume / Issue / Year / Pages */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-volume">Volume</Label>
                  <Input
                    id="edit-volume"
                    type="number"
                    value={editForm.volume}
                    onChange={(e) => handleEditField("volume", e.target.value)}
                    placeholder="1"
                    min={1}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-issue">Issue</Label>
                  <Input
                    id="edit-issue"
                    type="number"
                    value={editForm.issue}
                    onChange={(e) => handleEditField("issue", e.target.value)}
                    placeholder="1"
                    min={1}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-year">Year</Label>
                  <Input
                    id="edit-year"
                    type="number"
                    value={editForm.year}
                    onChange={(e) => handleEditField("year", e.target.value)}
                    placeholder="2024"
                    min={1900}
                    max={2100}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-pages">Pages</Label>
                  <Input
                    id="edit-pages"
                    value={editForm.pages}
                    onChange={(e) => handleEditField("pages", e.target.value)}
                    placeholder="1-15"
                  />
                </div>
              </div>

              {/* Topic + DOI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-topic">Topic / Region</Label>
                  <Select
                    value={editForm.topic || "none"}
                    onValueChange={(v) => handleEditField("topic", v === "none" ? "" : v)}
                  >
                    <SelectTrigger id="edit-topic">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— None —</SelectItem>
                      <SelectItem value="East Africa">East Africa</SelectItem>
                      <SelectItem value="West Africa">West Africa</SelectItem>
                      <SelectItem value="Southern Africa">Southern Africa</SelectItem>
                      <SelectItem value="Heritage Preservation">Heritage Preservation</SelectItem>
                      <SelectItem value="Governance & Law">Governance & Law</SelectItem>
                      <SelectItem value="Health & Healing">Health & Healing</SelectItem>
                      <SelectItem value="Language & Literature">Language & Literature</SelectItem>
                      <SelectItem value="Environmental Stewardship">Environmental Stewardship</SelectItem>
                      <SelectItem value="Indigenous Technology">Indigenous Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-doi">DOI</Label>
                  <Input
                    id="edit-doi"
                    value={editForm.doi}
                    onChange={(e) => handleEditField("doi", e.target.value)}
                    placeholder="10.xxxx/xxxxx"
                  />
                </div>
              </div>

              {/* Published Date */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-published-date">Published Date</Label>
                <Input
                  id="edit-published-date"
                  type="date"
                  value={editForm.published_date}
                  onChange={(e) => handleEditField("published_date", e.target.value)}
                />
              </div>

            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" disabled={editMutation.isPending}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleEditSave}
              disabled={editMutation.isPending || !editForm?.title.trim()}
            >
              {editMutation.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving…</>
              ) : (
                <><Save className="h-4 w-4 mr-1" />Save Changes</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Manage Articles
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {articles.length} articles in the database
          </p>
        </div>
      </div>

      {/* ── Search & filter ───────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or author…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 text-xs sm:text-sm"
              />
            </div>
            <Select value={filterVolume} onValueChange={setFilterVolume}>
              <SelectTrigger className="w-full sm:w-[180px] text-xs sm:text-sm">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by volume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Volumes</SelectItem>
                {volumes.map((v) => (
                  <SelectItem key={v} value={v.toString()}>Volume {v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading articles…
            </div>
          ) : (
            <div className="min-w-[640px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px] sm:min-w-[280px]">Title</TableHead>
                    <TableHead>Authors</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>PDF</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((article) => (
                    <TableRow
                      key={article.id}
                      className="group hover:bg-muted/40 transition-colors"
                    >
                      <TableCell className="font-medium text-xs sm:text-sm">
                        {article.title}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground">
                        <div>
                          {Array.isArray(article.authors) ? article.authors.join(", ") : ""}
                        </div>
                        {article.orcid && (
                          <div className="text-xs text-muted-foreground/70 mt-0.5 font-mono">
                            ORCID: {article.orcid}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        Vol. {article.volume}
                        {article.issue ? `, Issue ${article.issue}` : ""}{" "}
                        ({article.year})
                      </TableCell>
                      <TableCell>
                        {article.topic ? (
                          <Badge variant="secondary" className="text-xs">
                            {article.topic}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
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
                              onClick={() => window.open(article.pdf_url, "_blank")}
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => openEdit(article)}
                            title="Edit article"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() =>
                              setArticleToDelete({ id: article.id, title: article.title })
                            }
                            title="Delete article"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
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