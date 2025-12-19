"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, UserRound, Eye } from "lucide-react";

import { PortalHeader } from "@/components/portal/portal-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePortalAuth } from "@/app/(portal)/portal/hooks/use-portal-auth";
import { listAgents } from "@/lib/api/admin";

export default function AgentsListPage() {
  const user = usePortalAuth((state) => state.user);
  const token = usePortalAuth((state) => state.token);
  const [agents, setAgents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user && (user.role === "admin" || user.id === 1);

  useEffect(() => {
    if (!token || !isAdmin) return;
    let active = true;
    setIsLoading(true);
    setError(null);
    listAgents(token)
      .then((response) => {
        if (!active) return;
        setAgents(response.data || []);
      })
      .catch((err) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Unable to load agents.";
        setError(message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isAdmin, token]);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-muted/40 text-center">
        <PortalHeader />
        <main className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-16">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" aria-hidden />
            <p className="text-sm font-medium">You do not have permission to manage agents.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <PortalHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Agents</h1>
            <p className="text-sm text-muted-foreground">Manage agent accounts.</p>
          </div>
          <Button asChild>
            <Link href="/portal/agents/create">Create agent</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserRound className="h-5 w-5 text-primary" aria-hidden />
              Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading agents…</p>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : agents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No agents found.</p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border/60">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Email</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Phone</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Watermark</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent) => (
                      <tr key={agent.id} className="border-t border-border/60">
                        <td className="px-4 py-3 font-medium text-foreground">{agent.full_name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{agent.email}</td>
                        <td className="px-4 py-3 text-muted-foreground">{agent.phone || "—"}</td>
                        <td className="px-4 py-3">
                          {agent.watermark_url ? (
                            <a
                              href={agent.watermark_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative inline-block"
                            >
                              <div className="flex items-center gap-2 text-primary hover:underline">
                                <Eye className="h-4 w-4" />
                                <span>View</span>
                              </div>
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground capitalize">
                          {agent.status || "active"}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/portal/agents/${agent.id}/edit`}
                            className="text-primary hover:underline"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
