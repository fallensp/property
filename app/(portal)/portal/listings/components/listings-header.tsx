"use client";

import { type ReactNode } from "react";
import { MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ListingsHeaderProps {
  onCreateListing: () => void;
  onMoreActions?: () => void;
  children?: ReactNode;
  className?: string;
}

export function ListingsHeader({
  onCreateListing,
  onMoreActions,
  children,
  className,
}: ListingsHeaderProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Listings
          </h1>
          <p className="text-sm text-muted-foreground">
            Keep your portfolio up to date and launch new listings with ease.
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2 self-start">
          <Button
            type="button"
            variant="outline"
            onClick={onMoreActions}
            className="hidden sm:inline-flex"
            data-testid="more-actions"
            aria-label="Open bulk listing actions"
          >
            More actions
            <MoreHorizontal className="ml-2 h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={onCreateListing}
            className="inline-flex items-center gap-2"
            data-testid="create-listing"
            aria-label="Create a new listing"
          >
            <Plus className="h-4 w-4" />
            Create listing
          </Button>
        </div>
      </div>

      {children}
    </section>
  );
}
