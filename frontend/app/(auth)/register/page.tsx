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

export default function RegisterPage() {
  const router = useRouter();
  const user = usePortalAuth((state) => state.user);
  const register = usePortalAuth((state) => state.register);
  const authStatus = usePortalAuth((state) => state.status);
  const clearError = usePortalAuth((state) => state.clearError);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
  }, [clearError, confirmPassword, email, error, name, password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    clearError();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirm) {
      setError("Please fill out all fields to create your account.");
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register(trimmedName, trimmedEmail, trimmedPassword, trimmedConfirm, "web");
      const nextUser = usePortalAuth.getState().user;
      const destination = nextUser?.agentId ? "/portal/listings" : "/";
      router.push(destination);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to create your account right now.";
      setError(message);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12 text-foreground sm:px-6 lg:px-8">
      <ThemeToggle className="absolute right-6 top-6" />
      <Card className="w-full max-w-md border border-border/60 bg-card shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">Create your account</CardTitle>
          <CardDescription>
            Register to access the Property AI dashboard and publish your listings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="register-name">Full name</Label>
              <Input
                id="register-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">Email address</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="agent@youragency.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-confirm-password">Confirm password</Label>
              <Input
                id="register-confirm-password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
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
                  Creating your account…
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
