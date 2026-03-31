import { useState } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminUpload = () => {
  const [dragOver, setDragOver] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  const [volume, setVolume] = useState("");
  const [issue, setIssue] = useState("");
  const [year, setYear] = useState("");
  const [pages, setPages] = useState("");
  const [doi, setDoi] = useState("");
  const [topic, setTopic] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!title || !authors || !abstract || !keywords || !volume || !year || !pages || !publishedDate) {
        throw new Error("Please fill in all required fields.");
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("authors", authors);
      formData.append("abstract", abstract);
      formData.append("keywords", keywords);
      formData.append("volume", volume);
      if (issue) formData.append("issue", issue);
      formData.append("year", year);
      formData.append("pages", pages);
      if (doi) formData.append("doi", doi);
      if (topic) formData.append("topic", topic);
      formData.append("published_date", publishedDate);
      if (pdfFile) formData.append("pdf", pdfFile);

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/upload-article`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["journal-articles"] });
      toast({ title: "Article published successfully!" });
      setTitle(""); setAuthors(""); setAbstract(""); setKeywords("");
      setVolume(""); setIssue(""); setYear(""); setPages("");
      setDoi(""); setTopic(""); setPublishedDate(""); setPdfFile(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Upload New Article</h1>
        <p className="text-muted-foreground mt-1">Add a new journal article with metadata and PDF file.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Article Metadata</CardTitle>
              <CardDescription>Fill in the bibliographic details for the article.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title <span className="text-destructive">*</span></Label>
                <Input placeholder="Enter full article title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Authors <span className="text-destructive">*</span></Label>
                <Input placeholder="Dr. Amina Osei, Prof. Kwame Mensah" value={authors} onChange={(e) => setAuthors(e.target.value)} />
                <p className="text-xs text-muted-foreground">Separate multiple authors with commas</p>
              </div>

              <div className="space-y-2">
                <Label>Abstract <span className="text-destructive">*</span></Label>
                <Textarea rows={6} placeholder="Enter the article abstract..." value={abstract} onChange={(e) => setAbstract(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Keywords <span className="text-destructive">*</span></Label>
                <Input placeholder="indigenous knowledge, cultural heritage, oral traditions" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
                <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label>Volume <span className="text-destructive">*</span></Label>
                  <Input type="number" placeholder="3" value={volume} onChange={(e) => setVolume(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Issue</Label>
                  <Input type="number" placeholder="1" value={issue} onChange={(e) => setIssue(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Year <span className="text-destructive">*</span></Label>
                  <Input type="number" placeholder="2026" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Pages <span className="text-destructive">*</span></Label>
                  <Input placeholder="1-15" value={pages} onChange={(e) => setPages(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>DOI</Label>
                  <Input placeholder="10.xxxxx/ijikcs.2026.001" value={doi} onChange={(e) => setDoi(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Topic / Region</Label>
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
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
              </div>

              <div className="space-y-2">
                <Label>Published Date <span className="text-destructive">*</span></Label>
                <Input type="date" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">PDF File</CardTitle>
              <CardDescription>Upload the article's full-text PDF.</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file && file.type === "application/pdf") setPdfFile(file);
                }}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                  dragOver ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                }`}
              >
                {pdfFile ? (
                  <div className="space-y-2">
                    <FileText className="h-8 w-8 text-accent mx-auto" />
                    <p className="text-sm font-medium text-foreground">{pdfFile.name}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setPdfFile(null); }}
                      className="text-xs text-destructive hover:underline inline-flex items-center gap-1"
                    >
                      <X className="h-3 w-3" /> Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">Drag & drop PDF here</p>
                    <p className="text-xs text-muted-foreground">or click to browse</p>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPdfFile(file);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
                onClick={() => publishMutation.mutate()}
                disabled={publishMutation.isPending}
              >
                {publishMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {publishMutation.isPending ? "Publishing..." : "Publish Article"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;
