import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Journal Settings</h1>
        <p className="text-muted-foreground mt-1">Configure the journal's identity and preferences.</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">General Information</CardTitle>
          <CardDescription>Basic details about the journal displayed on the website.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Journal Name</Label>
            <Input defaultValue="International Journal of Indigenous Knowledge and Cultural Studies" />
          </div>
          <div className="space-y-2">
            <Label>Abbreviation</Label>
            <Input defaultValue="IJIKCS" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>ISSN (Print)</Label>
              <Input defaultValue="XXXX-XXXX" />
            </div>
            <div className="space-y-2">
              <Label>ISSN (Online)</Label>
              <Input defaultValue="XXXX-XXXX" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={3} defaultValue="A peer-reviewed, open-access journal dedicated to the study, preservation, and dissemination of indigenous knowledge systems and cultural heritage across Africa and the Global South." />
          </div>
        </CardContent>
      </Card>

      {/* Publishing Preferences */}
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
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Send email alerts when new volumes are published</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Show Article Downloads Count</p>
              <p className="text-xs text-muted-foreground">Display download statistics on article pages</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
          <Save className="h-4 w-4" /> Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
