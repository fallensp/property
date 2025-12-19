"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ShieldCheck } from "lucide-react";

import { PortalHeader } from "@/components/portal/portal-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePortalAuth } from "@/app/(portal)/portal/hooks/use-portal-auth";
import { fetchAgent, updateAgent } from "@/lib/api/admin";

interface EditAgentPageProps {
  params: {
    agentId: string;
  };
}

export default function EditAgentPage({ params }: EditAgentPageProps) {
  const router = useRouter();
  const user = usePortalAuth((state) => state.user);
  const token = usePortalAuth((state) => state.token);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    developer_id: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user && (user.role === "admin" || user.id === 1);

  useEffect(() => {
    if (!token || !isAdmin) {
      return;
    }
    let active = true;
    setIsLoading(true);
    setError(null);
    fetchAgent(token, params.agentId)
      .then((agent) => {
        if (!active) return;
        setForm({
          full_name: agent.full_name ?? "",
          email: agent.email ?? "",
          phone: agent.phone ?? "",
          developer_id: agent.developer_id ?? "",
        });
      })
      .catch((err) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Unable to load agent.";
        setError(message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isAdmin, params.agentId, token]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError("You must be signed in.");
      return;
    }
    if (!isAdmin) {
      setError("Only admins can edit agents.");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateAgent(token, params.agentId, {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || undefined,
        developer_id: form.developer_id || undefined,
      });
      router.push("/portal/agents");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update agent.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-muted/40 text-center">
        <PortalHeader />
        <main className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-16">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" aria-hidden />
            <p className="text-sm font-medium">You do not have permission to edit agents.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <PortalHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <CardTitle>Edit Agent</CardTitle>
                <CardDescription>Update agent profile details.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading agent…</p>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Agent Full Name</Label>
                    <Input
                      id="full_name"
                      value={form.full_name}
                      onChange={(e) => handleChange("full_name", e.target.value)}
                      placeholder="Agent display name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="agent@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+60 ..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="developer_id">Developer ID (optional)</Label>
                    <Input
                      id="developer_id"
                      value={form.developer_id}
                      onChange={(e) => handleChange("developer_id", e.target.value)}
                      placeholder="Developer ULID"
                    />
                  </div>
                </div>

                {error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : null}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/portal/agents")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Save changes"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
