import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminArticles from "@/components/admin/AdminArticles";
import AdminUpload from "@/components/admin/AdminUpload";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminSettings from "@/components/admin/AdminSettings";
import ProfileCard from "@/components/profile/ProfileCard";
import PageLoader from "@/components/PageLoader";

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  const renderContent = () => {
    switch (activeTab) {
      case "overview":  return <AdminOverview />;
      case "articles":  return <AdminArticles />;
      case "upload":    return <AdminUpload />;
      case "users":     return <AdminUsers />;
      case "settings":  return <AdminSettings />;
      case "profile":   return <ProfileCard user={user} loading={loading} />;
      default:          return <AdminOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Admin;