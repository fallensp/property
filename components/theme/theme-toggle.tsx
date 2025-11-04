"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useTheme } from "./theme-provider";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme, isReady, toggleEnabled } = useTheme();

  if (!toggleEnabled) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "relative h-10 w-10 rounded-full border border-border bg-background/60 backdrop-blur transition hover:border-primary/50 hover:bg-primary/10",
        className,
      )}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      disabled={!isReady}
    >
      <Sun
        className={cn(
          "absolute h-5 w-5 rotate-0 scale-100 transition-transform duration-300",
          theme === "dark" && "-rotate-90 scale-0",
        )}
        aria-hidden
      />
      <Moon
        className={cn(
          "absolute h-5 w-5 rotate-90 scale-0 transition-transform duration-300",
          theme === "dark" && "rotate-0 scale-100",
        )}
        aria-hidden
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
