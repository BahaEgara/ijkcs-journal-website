import { useState } from "react";
import { Shield, User, MoreHorizontal, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserWithRole {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  created_at: string;
}

const roleBadgeVariant = (role: string) => {
  if (role === "admin") return "default" as const;
  if (role === "moderator") return "secondary" as const;
  return "outline" as const;
};

const AdminUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("admin-users", {
        method: "GET",
      });
      if (error) throw error;
      return data as UserWithRole[];
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { data, error } = await supabase.functions.invoke("admin-users", {
        method: "PUT",
        body: { user_id: userId, role },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setEditingUserId(null);
      toast({ title: "Role updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating role", description: error.message, variant: "destructive" });
    },
  });

  const roleCounts = {
    admin: (users ?? []).filter((u) => u.role === "admin").length,
    moderator: (users ?? []).filter((u) => u.role === "moderator").length,
    user: (users ?? []).filter((u) => u.role === "user").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Users & Roles</h1>
        <p className="text-muted-foreground mt-1">Manage user accounts and permission levels.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{roleCounts.admin}</p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{roleCounts.moderator}</p>
              <p className="text-sm text-muted-foreground">Moderators</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{roleCounts.user}</p>
              <p className="text-sm text-muted-foreground">Users</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">All Users</CardTitle>
          <CardDescription>Click the role to change a user's permissions.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading users...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(users ?? []).map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/40 transition-colors">
                    <TableCell className="font-medium">{user.full_name || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.email || "—"}</TableCell>
                    <TableCell>
                      {editingUserId === user.id ? (
                        <Select
                          defaultValue={user.role}
                          onValueChange={(role) => {
                            updateRoleMutation.mutate({ userId: user.id, role });
                          }}
                        >
                          <SelectTrigger className="w-[130px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          variant={roleBadgeVariant(user.role)}
                          className="capitalize text-xs cursor-pointer"
                          onClick={() => setEditingUserId(user.id)}
                        >
                          {user.role}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {(!users || users.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
