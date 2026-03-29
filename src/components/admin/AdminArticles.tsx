import { useState } from "react";
import { Search, Plus, Pencil, Trash2, FileText, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const sampleArticles = [
  { id: "1", title: "Indigenous Water Management Systems in East Africa", authors: ["Dr. Amina Osei", "Prof. Kwame Mensah"], volume: 3, issue: 1, year: 2026, topic: "Environmental Stewardship", hasPdf: true, status: "Published" },
  { id: "2", title: "Oral Traditions and Digital Archiving: A Framework", authors: ["Dr. Fatima Bello"], volume: 3, issue: 1, year: 2026, topic: "Heritage Preservation", hasPdf: true, status: "Published" },
  { id: "3", title: "Traditional Conflict Resolution in West African Communities", authors: ["Prof. Chidi Nwosu", "Dr. Aisha Kamara"], volume: 2, issue: 2, year: 2025, topic: "Governance & Law", hasPdf: false, status: "Published" },
  { id: "4", title: "Ethnobotanical Knowledge Among Maasai Pastoralists", authors: ["Dr. Lekishon Ole Nkini"], volume: 2, issue: 2, year: 2025, topic: "Health & Healing", hasPdf: true, status: "Published" },
  { id: "5", title: "The Role of Indigenous Languages in Knowledge Transfer", authors: ["Prof. Ngũgĩ Wanjiku", "Dr. Amara Diallo"], volume: 2, issue: 1, year: 2025, topic: "Language & Literature", hasPdf: true, status: "Published" },
  { id: "6", title: "Sustainable Agriculture Through Traditional Practices", authors: ["Dr. Blessing Moyo"], volume: 1, issue: 1, year: 2024, topic: "Agroecology", hasPdf: false, status: "Draft" },
];

const AdminArticles = () => {
  const [search, setSearch] = useState("");
  const [filterVolume, setFilterVolume] = useState<string>("all");

  const filtered = sampleArticles.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.authors.some((auth) => auth.toLowerCase().includes(search.toLowerCase()));
    const matchesVolume = filterVolume === "all" || a.volume.toString() === filterVolume;
    return matchesSearch && matchesVolume;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Manage Articles</h1>
          <p className="text-muted-foreground mt-1">{sampleArticles.length} articles in the database</p>
        </div>
        <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="h-4 w-4" /> New Article
        </Button>
      </div>

      {/* Filters */}
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
                <SelectItem value="3">Volume 3</SelectItem>
                <SelectItem value="2">Volume 2</SelectItem>
                <SelectItem value="1">Volume 1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[300px]">Title</TableHead>
                  <TableHead>Authors</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>PDF</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((article) => (
                  <TableRow key={article.id} className="group hover:bg-muted/40 transition-colors">
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {article.authors.join(", ")}
                    </TableCell>
                    <TableCell className="text-sm">
                      Vol. {article.volume}, Issue {article.issue} ({article.year})
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{article.topic}</Badge>
                    </TableCell>
                    <TableCell>
                      {article.hasPdf ? (
                        <span className="inline-flex items-center gap-1 text-accent text-xs font-medium">
                          <FileText className="h-3 w-3" /> Uploaded
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Missing</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={article.status === "Published" ? "default" : "outline"} className="text-xs">
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminArticles;
