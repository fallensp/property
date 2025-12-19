"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { usePortalAuth } from "@/app/(portal)/portal/hooks/use-portal-auth";

interface UserPillProps {
  className?: string;
}

export function UserPill({ className }: UserPillProps) {
  const user = usePortalAuth((state) => state.user);

  if (user) {
    const label = user.name?.trim() || user.email;
    const destination = user.agentId ? "/portal/listings" : "/";

    return (
      <Button
        asChild
        variant="secondary"
        className={className}
      >
        <Link href={destination}>
          {label}
        </Link>
      </Button>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Button asChild variant="ghost" className="text-sm">
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90">
        <Link href="/register">Register</Link>
      </Button>
    </div>
  );
}
