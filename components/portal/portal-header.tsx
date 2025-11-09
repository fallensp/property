"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { usePortalAuth } from "@/app/(portal)/portal/hooks/use-portal-auth";

interface PortalHeaderProps {
  className?: string;
}

export function PortalHeader({ className }: PortalHeaderProps) {
  const user = usePortalAuth((state) => state.user);
  const logout = usePortalAuth((state) => state.logout);
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const displayName = useMemo(() => {
    if (!user) return "";
    const fallback = user.name?.trim() || user.email.split("@")[0];
    return fallback
      .split(/[\s._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }, [user]);

  const initials = useMemo(() => {
    if (!displayName) return "AG";
    const parts = displayName.split(" ");
    return parts
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  }, [displayName]);

  useEffect(() => {
    if (!profileOpen) return;
    function handleClick(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setProfileOpen(false);
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace("/portal");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur ${className ?? ""}`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/portal/listings" className="flex items-center gap-3">
            <Image
              src="/images/branding/property-ai-logo.svg"
              alt="Property AI"
              width={150}
              height={32}
              className="h-6 w-auto"
              priority
            />
          </Link>
          <span className="hidden text-sm text-muted-foreground sm:inline-flex">
            Manage property performance with confidence
          </span>
          <ThemeToggle className="md:hidden" />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden md:inline-flex" />

          <div className="relative" ref={profileRef}>
            <Button
              type="button"
              variant="ghost"
              className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-muted"
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 via-primary to-primary/70 text-sm font-semibold text-primary-foreground shadow-inner">
                {initials}
              </span>
              <span className="hidden flex-col text-left text-sm leading-tight md:flex">
                <span className="font-medium text-foreground">{displayName}</span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:inline" aria-hidden />
            </Button>

            {profileOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-4 w-60 overflow-hidden rounded-xl border border-border bg-card shadow-xl ring-1 ring-black/5"
              >
                <div className="border-b border-border/80 bg-muted/30 px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <div className="flex flex-col gap-1 p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={() => {
                      setProfileOpen(false);
                      router.push("/portal/listings?panel=profile");
                    }}
                  >
                    <UserRound className="h-4 w-4" aria-hidden />
                    View profile
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={() => {
                      setProfileOpen(false);
                      router.push("/portal/listings?panel=preferences");
                    }}
                  >
                    <ShieldCheck className="h-4 w-4" aria-hidden />
                    Account preferences
                  </Button>
                </div>
                <div className="border-t border-border/80 bg-muted/20 p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    Sign out
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
