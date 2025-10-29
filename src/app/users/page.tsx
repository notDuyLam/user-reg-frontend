"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers, type UserListItem } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function UsersPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Users</CardTitle>
            <CardDescription>List of registered users</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="text-sm text-muted-foreground">Loading users...</div>
            )}

            {isError && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-md">
                {(error as unknown as { message?: string })?.message || "Failed to load users"}
              </div>
            )}

            {data?.data && data.data.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4">ID</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((user: UserListItem) => (
                      <tr key={user.id} className="border-b last:border-0">
                        <td className="py-2 pr-4 align-top">{user.id}</td>
                        <td className="py-2 pr-4 align-top">{user.email}</td>
                        <td className="py-2 align-top">
                          {new Date(user.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {data?.data && data.data.length === 0 && (
              <div className="text-sm text-muted-foreground">No users found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


