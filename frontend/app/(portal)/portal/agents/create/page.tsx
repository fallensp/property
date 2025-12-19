"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ShieldCheck } from "lucide-react";

import { PortalHeader } from "@/components/portal/portal-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePortalAuth } from "@/app/(portal)/portal/hooks/use-portal-auth";
import { createAgent } from "@/lib/api/admin";

export default function CreateAgentPage() {
  const router = useRouter();
  const user = usePortalAuth((state) => state.user);
  const token = usePortalAuth((state) => state.token);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    full_name: "",
    phone: "",
    developer_id: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user && (user.role === "admin" || user.id === 1);

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
      setError("Only admins can create agents.");
      return;
    }
    if (!form.name || !form.email || !form.password || !form.full_name) {
      setError("Name, full name, email, and password are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createAgent(token, {
        name: form.name,
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        developer_id: form.developer_id || undefined,
      });
      router.push("/portal/listings");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to create agent.";
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
            <p className="text-sm font-medium">You do not have permission to create agents.</p>
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
                <CardTitle>Create Agent</CardTitle>
                <CardDescription>Create a user and agent profile in one step.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">User Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Portal user name"
                    required
                  />
                </div>
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
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Min 8 characters"
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
                  onClick={() => router.push("/portal/listings")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create agent"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
