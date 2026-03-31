import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [journalName, setJournalName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [issnPrint, setIssnPrint] = useState("");
  const [issnOnline, setIssnOnline] = useState("");
  const [description, setDescription] = useState("");
  const [openAccess, setOpenAccess] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showDownloads, setShowDownloads] = useState(false);
  const [fetching, setFetching] = useState(false);


  // Fetch settings by journal name
  const fetchSettings = async (name: string) => {
    setFetching(true);
    try {
      // Use query param for GET
      const { data, error } = await supabase.functions.invoke("admin-settings", {
        method: "GET",
        // @ts-ignore
        url: `admin-settings?journal_name=${encodeURIComponent(name)}`,
      });
      if (error) throw error;
      if (data) {
        setAbbreviation(data.abbreviation ?? "");
        setIssnPrint(data.issn_print ?? "");
        setIssnOnline(data.issn_online ?? "");
        setDescription(data.description ?? "");
        setOpenAccess(Boolean(data.open_access));
        setEmailNotifications(Boolean(data.email_notifications));
        setShowDownloads(Boolean(data.show_downloads_count));
      } else {
        setAbbreviation("");
        setIssnPrint("");
        setIssnOnline("");
        setDescription("");
        setOpenAccess(true);
        setEmailNotifications(true);
        setShowDownloads(false);
      }
    } catch (err) {
      toast({ title: "Error fetching settings", description: (err as Error).message, variant: "destructive" });
    } finally {
      setFetching(false);
    }
  };

  // Fetch settings when journalName changes (debounced)
  useEffect(() => {
    if (journalName.trim()) {
      const handler = setTimeout(() => {
        fetchSettings(journalName.trim());
      }, 400);
      return () => clearTimeout(handler);
    } else {
      setAbbreviation("");
      setIssnPrint("");
      setIssnOnline("");
      setDescription("");
      setOpenAccess(true);
      setEmailNotifications(true);
      setShowDownloads(false);
    }
    // eslint-disable-next-line
  }, [journalName]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("admin-settings", {
        method: "PUT",
        body: {
          journal_name: journalName,
          abbreviation,
          issn_print: issnPrint,
          issn_online: issnOnline,
          description,
          open_access: openAccess,
          email_notifications: emailNotifications,
          show_downloads_count: showDownloads,
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Settings saved successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error saving settings", description: error.message, variant: "destructive" });
    },
  });

  if (fetching) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Journal Settings</h1>
        <p className="text-muted-foreground mt-1">Configure the journal's identity and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">General Information</CardTitle>
          <CardDescription>Basic details about the journal displayed on the website.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Journal Name</Label>
            <Input value={journalName} onChange={(e) => setJournalName(e.target.value)} placeholder="Type journal name..." />
          </div>
          <div className="space-y-2">
            <Label>Abbreviation</Label>
            <Input value={abbreviation} onChange={(e) => setAbbreviation(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>ISSN (Print)</Label>
              <Input value={issnPrint} onChange={(e) => setIssnPrint(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>ISSN (Online)</Label>
              <Input value={issnOnline} onChange={(e) => setIssnOnline(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Publishing Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Open Access</p>
              <p className="text-xs text-muted-foreground">Allow free access to all published articles</p>
            </div>
            <Switch checked={openAccess} onCheckedChange={setOpenAccess} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Send email alerts when new volumes are published</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Show Article Downloads Count</p>
              <p className="text-xs text-muted-foreground">Display download statistics on article pages</p>
            </div>
            <Switch checked={showDownloads} onCheckedChange={setShowDownloads} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saveMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
