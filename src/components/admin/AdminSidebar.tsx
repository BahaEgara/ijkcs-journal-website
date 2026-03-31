import { LayoutDashboard, FileText, Upload, Users, Settings, LogOut, BookOpen, User, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "overview", label: "Overview",        icon: LayoutDashboard },
  { id: "articles", label: "Articles",         icon: FileText },
  { id: "upload",   label: "Upload Article",   icon: Upload },
  { id: "users",    label: "Users & Roles",    icon: Users },
  { id: "settings", label: "Settings",         icon: Settings },
  { id: "profile",  label: "Profile",          icon: User },
];

const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName =
    user?.user_metadata?.full_name || user?.email || "User";
  const displayEmail = user?.email || "";
  const initials = (
    user?.user_metadata?.full_name
      ? user.user_metadata.full_name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
      : user?.email
      ? user.email[0]
      : "U"
  ).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <p className="font-serif font-bold text-sm text-foreground">IJIKCS</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === item.id
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-xs font-bold text-accent">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
          </div>
        </div>
        <button
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent/20 hover:text-accent transition-colors"
          onClick={() => navigate("/")}
        >
          <Home className="h-4 w-4" />
          Back to Site
        </button>
        <button
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;