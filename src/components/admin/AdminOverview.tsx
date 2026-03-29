import { FileText, Upload, Users, Eye, TrendingUp, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Total Articles", value: "24", icon: FileText, trend: "+3 this month" },
  { label: "PDFs Uploaded", value: "18", icon: Upload, trend: "75% coverage" },
  { label: "Total Views", value: "1,247", icon: Eye, trend: "+12% this week" },
  { label: "Active Volumes", value: "3", icon: BookOpen, trend: "Vol. 3 current" },
  { label: "Registered Users", value: "156", icon: Users, trend: "+8 new" },
  { label: "Downloads", value: "892", icon: TrendingUp, trend: "+5% this month" },
];

const recentActivity = [
  { action: "Article created", detail: "Indigenous Water Management in Kenya", time: "2 hours ago" },
  { action: "PDF uploaded", detail: "Vol. 3, Issue 1 - Full Text", time: "5 hours ago" },
  { action: "Article updated", detail: "Oral Traditions and Digital Archives", time: "1 day ago" },
  { action: "New user registered", detail: "researcher@university.ac.ke", time: "2 days ago" },
  { action: "Article deleted", detail: "Draft: Untitled Research", time: "3 days ago" },
];

const AdminOverview = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's what's happening with IJIKCS.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow duration-200 group">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-accent mt-2">{stat.trend}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <stat.icon className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-4 py-3 border-b border-border last:border-0">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-sm text-muted-foreground truncate">{item.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
