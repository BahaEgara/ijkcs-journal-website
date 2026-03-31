import { useState } from "react";
import { Shield, User, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// ...existing code...
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

// ...existing code...

const AdminUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  // Role editing removed

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("admin-users", {
        method: "GET",
      });
      if (error) throw error;
      // Remove role from type
      return (data as UserWithRole[]).map(({ role, ...rest }) => rest);
    },
  });

  // Role mutation removed

  // Role counts removed

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Users</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage user accounts.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-base sm:text-lg">All Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading users...
            </div>
          ) : (
            <div className="min-w-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(users ?? []).map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="font-medium text-xs sm:text-sm">{user.full_name || "—"}</TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground">{user.email || "—"}</TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!users || users.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
