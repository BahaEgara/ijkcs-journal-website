import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useJournalArticles, type JournalArticle } from "@/hooks/useJournalArticles";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Upload, LogOut, Shield, FileText, Loader2 } from "lucide-react";
import PageLoader from "@/components/PageLoader";

interface ArticleForm {
  title: string;
  authors: string;
  abstract: string;
  keywords: string;
  volume: string;
  issue: string;
  year: string;
  pages: string;
  doi: string;
  topic: string;
  published_date: string;
}

const emptyForm: ArticleForm = {
  title: "", authors: "", abstract: "", keywords: "",
  volume: "", issue: "", year: new Date().getFullYear().toString(),
  pages: "", doi: "", topic: "", published_date: new Date().toISOString().split("T")[0],
};

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: articles, isLoading } = useJournalArticles();

  const [form, setForm] = useState<ArticleForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  if (authLoading) return <PageLoader />;

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <CardTitle className="font-serif text-xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your account does not have admin privileges. Please contact the journal administrator to request access.
            </p>
            <Button variant="outline" onClick={signOut}>Sign Out</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = (article: JournalArticle) => {
    setForm({
      title: article.title,
      authors: article.authors.join(", "),
      abstract: article.abstract,
      keywords: article.keywords.join(", "),
      volume: article.volume.toString(),
      issue: article.issue?.toString() || "",
      year: article.year.toString(),
      pages: article.pages,
      doi: article.doi || "",
      topic: article.topic || "",
      published_date: article.published_date,
    });
    setEditingId(article.id);
    setPdfFile(null);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setPdfFile(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    setDeleting(id);
    const { error } = await supabase.from("journal_articles").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Article removed successfully." });
      queryClient.invalidateQueries({ queryKey: ["journal-articles"] });
    }
    setDeleting(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let pdfUrl: string | null = null;

    // Upload PDF if provided
    if (pdfFile) {
      const fileExt = pdfFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("journal-pdfs")
        .upload(fileName, pdfFile, { contentType: "application/pdf" });

      if (uploadError) {
        toast({ title: "PDF Upload Failed", description: uploadError.message, variant: "destructive" });
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("journal-pdfs").getPublicUrl(fileName);
      pdfUrl = urlData.publicUrl;
    }

    const articleData = {
      title: form.title.trim(),
      authors: form.authors.split(",").map((a) => a.trim()).filter(Boolean),
      abstract: form.abstract.trim(),
      keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      volume: parseInt(form.volume),
      issue: form.issue ? parseInt(form.issue) : null,
      year: parseInt(form.year),
      pages: form.pages.trim(),
      doi: form.doi.trim() || null,
      topic: form.topic.trim() || null,
      published_date: form.published_date,
      ...(pdfUrl && { pdf_url: pdfUrl }),
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("journal_articles").update(articleData).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("journal_articles").insert(articleData));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Updated" : "Created", description: `Article ${editingId ? "updated" : "created"} successfully.` });
      setDialogOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["journal-articles"] });
    }
    setSaving(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage journal articles and PDFs</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew} className="gap-2">
                <Plus className="h-4 w-4" /> New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif">{editingId ? "Edit Article" : "Create New Article"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Authors * (comma-separated)</Label>
                  <Input value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })} placeholder="John Doe, Jane Smith" required />
                </div>
                <div className="space-y-2">
                  <Label>Abstract *</Label>
                  <Textarea rows={5} value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Keywords * (comma-separated)</Label>
                  <Input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="indigenous knowledge, cultural heritage" required />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <Label>Volume *</Label>
                    <Input type="number" value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Issue</Label>
                    <Input type="number" value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Year *</Label>
                    <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Pages *</Label>
                    <Input value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} placeholder="1-15" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>DOI</Label>
                    <Input value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })} placeholder="10.xxxxx/xxxxx" />
                  </div>
                  <div className="space-y-2">
                    <Label>Topic</Label>
                    <Input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="e.g. East Africa" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Published Date *</Label>
                  <Input type="date" value={form.published_date} onChange={(e) => setForm({ ...form, published_date: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Upload PDF
                  </Label>
                  <Input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                  {editingId && !pdfFile && <p className="text-xs text-muted-foreground">Leave empty to keep existing PDF</p>}
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : editingId ? "Update Article" : "Create Article"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={signOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <FileText className="h-8 w-8 text-accent" />
            <div>
              <p className="text-2xl font-bold">{articles?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Total Articles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <Upload className="h-8 w-8 text-accent" />
            <div>
              <p className="text-2xl font-bold">{articles?.filter((a) => a.pdf_url).length || 0}</p>
              <p className="text-sm text-muted-foreground">With PDFs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <Shield className="h-8 w-8 text-accent" />
            <div>
              <p className="text-2xl font-bold">{user?.email}</p>
              <p className="text-sm text-muted-foreground">Logged in as Admin</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">All Articles</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : !articles?.length ? (
            <p className="text-center text-muted-foreground py-12">No articles yet. Click "New Article" to add one.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Authors</TableHead>
                    <TableHead>Vol/Year</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>PDF</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium max-w-xs truncate">{article.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                        {article.authors.join(", ")}
                      </TableCell>
                      <TableCell className="text-sm">Vol. {article.volume} ({article.year})</TableCell>
                      <TableCell className="text-sm">{article.topic || "—"}</TableCell>
                      <TableCell>
                        {article.pdf_url ? (
                          <span className="text-accent text-xs font-medium">✓ Uploaded</span>
                        ) : (
                          <span className="text-muted-foreground text-xs">No PDF</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(article)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(article.id)}
                            disabled={deleting === article.id}
                          >
                            {deleting === article.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
