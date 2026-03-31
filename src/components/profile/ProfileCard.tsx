import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileCardProps {
  user: any;
  loading: boolean;
}

const ProfileCard = ({ user, loading: authLoading }: ProfileCardProps) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<{ email: string; full_name: string } | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Password reset state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setPasswordLoading(true);
    // Supabase requires re-authentication for password change
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (signInError) {
      toast({ title: "Current password is incorrect", description: signInError.message, variant: "destructive" });
      setPasswordLoading(false);
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      toast({ title: "Failed to update password", description: updateError.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated successfully" });
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setPasswordLoading(false);
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", user.id)
        .single();
      if (error) {
        toast({ title: "Error loading profile", description: error.message, variant: "destructive" });
      } else if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setEmail(data.email || "");
      }
      setLoading(false);
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    // Update profile in DB
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id);
    if (dbError) {
      toast({ title: "Error updating profile", description: dbError.message, variant: "destructive" });
      setSaving(false);
      return;
    }
    // Update Supabase auth user metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    });
    if (authError) {
      toast({ title: "Profile updated, but failed to update user metadata", description: authError.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated" });
      setProfile((prev) => prev ? { ...prev, full_name: fullName } : prev);
    }
    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <User className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
            <CardTitle>Not signed in</CardTitle>
            <CardDescription>Sign in to view and edit your profile.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <User className="h-7 w-7 mx-auto mb-2 text-primary" />
          <CardTitle className="font-serif text-2xl">Your Profile</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <form onSubmit={handleSave}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} disabled readOnly />
            </div>
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center gap-2">
            <Button type="button" variant="outline" onClick={() => setShowPasswordForm((v) => !v)}>
              {showPasswordForm ? "Cancel Password Reset" : "Reset Password"}
            </Button>
            <Button type="submit" disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
        {showPasswordForm && (
          <form onSubmit={handlePasswordReset} className="px-6 pb-6 pt-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            <Button type="submit" disabled={passwordLoading} className="gap-2 w-full">
              {passwordLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {passwordLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ProfileCard;