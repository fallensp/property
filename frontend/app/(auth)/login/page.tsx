"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { usePortalAuth } from "@/app/(portal)/portal/hooks/use-portal-auth";

export default function LoginPage() {
  const router = useRouter();
  const user = usePortalAuth((state) => state.user);
  const login = usePortalAuth((state) => state.login);
  const authStatus = usePortalAuth((state) => state.status);
  const clearError = usePortalAuth((state) => state.clearError);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const destination = user.agentId ? "/portal/listings" : "/";
      router.replace(destination);
    }
  }, [router, user]);

  useEffect(() => {
    if (error) {
      setError(null);
    }
    clearError();
  }, [clearError, email, error, password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    clearError();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Enter your email and password to continue.");
      return;
    }

    try {
      await login(trimmedEmail, trimmedPassword, "web");
      const nextUser = usePortalAuth.getState().user;
      const destination = nextUser?.agentId ? "/portal/listings" : "/";
      router.push(destination);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to sign in right now.";
      setError(message);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12 text-foreground sm:px-6 lg:px-8">
      <ThemeToggle className="absolute right-6 top-6" />
      <Card className="w-full max-w-md border border-border/60 bg-card shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
          <CardDescription>
            Sign in with your Property AI account to manage your listings and track performance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button
              type="submit"
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={authStatus === "loading"}
            >
              {authStatus === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Create one now
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
