import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminUpload = () => {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Upload New Article</h1>
        <p className="text-muted-foreground mt-1">Add a new journal article with metadata and PDF file.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Article Metadata</CardTitle>
              <CardDescription>Fill in the bibliographic details for the article.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title <span className="text-destructive">*</span></Label>
                <Input placeholder="Enter full article title" />
              </div>

              <div className="space-y-2">
                <Label>Authors <span className="text-destructive">*</span></Label>
                <Input placeholder="Dr. Amina Osei, Prof. Kwame Mensah" />
                <p className="text-xs text-muted-foreground">Separate multiple authors with commas</p>
              </div>

              <div className="space-y-2">
                <Label>Abstract <span className="text-destructive">*</span></Label>
                <Textarea rows={6} placeholder="Enter the article abstract..." />
              </div>

              <div className="space-y-2">
                <Label>Keywords <span className="text-destructive">*</span></Label>
                <Input placeholder="indigenous knowledge, cultural heritage, oral traditions" />
                <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label>Volume <span className="text-destructive">*</span></Label>
                  <Input type="number" placeholder="3" />
                </div>
                <div className="space-y-2">
                  <Label>Issue</Label>
                  <Input type="number" placeholder="1" />
                </div>
                <div className="space-y-2">
                  <Label>Year <span className="text-destructive">*</span></Label>
                  <Input type="number" placeholder="2026" />
                </div>
                <div className="space-y-2">
                  <Label>Pages <span className="text-destructive">*</span></Label>
                  <Input placeholder="1-15" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>DOI</Label>
                  <Input placeholder="10.xxxxx/ijikcs.2026.001" />
                </div>
                <div className="space-y-2">
                  <Label>Topic / Region</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="east-africa">East Africa</SelectItem>
                      <SelectItem value="west-africa">West Africa</SelectItem>
                      <SelectItem value="southern-africa">Southern Africa</SelectItem>
                      <SelectItem value="heritage">Heritage Preservation</SelectItem>
                      <SelectItem value="governance">Governance & Law</SelectItem>
                      <SelectItem value="health">Health & Healing</SelectItem>
                      <SelectItem value="language">Language & Literature</SelectItem>
                      <SelectItem value="environment">Environmental Stewardship</SelectItem>
                      <SelectItem value="technology">Indigenous Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Published Date <span className="text-destructive">*</span></Label>
                <Input type="date" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - PDF Upload & Actions */}
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
                  if (file) setFileName(file.name);
                }}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                  dragOver ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                }`}
              >
                {fileName ? (
                  <div className="space-y-2">
                    <FileText className="h-8 w-8 text-accent mx-auto" />
                    <p className="text-sm font-medium text-foreground">{fileName}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFileName(null); }}
                      className="text-xs text-destructive hover:underline inline-flex items-center gap-1"
                    >
                      <X className="h-3 w-3" /> Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop PDF here
                    </p>
                    <p className="text-xs text-muted-foreground">or click to browse</p>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFileName(file.name);
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
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                <Upload className="h-4 w-4" /> Publish Article
              </Button>
              <Button variant="outline" className="w-full">
                Save as Draft
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;
