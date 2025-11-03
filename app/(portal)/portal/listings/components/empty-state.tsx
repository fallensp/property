"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onResetFilters?: () => void;
  createListingHref?: string;
}

export function EmptyState({
  onResetFilters,
  createListingHref = "/listing/create",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
      <h2 className="text-lg font-semibold text-foreground">
        No listings match your filters
      </h2>
      <p className="max-w-lg text-sm text-muted-foreground">
        Update your filters or create a new listing to keep your portfolio active.
        Accurate details and recent updates help your listings rank higher.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" asChild>
          <Link href={createListingHref}>Create listing</Link>
        </Button>
        {onResetFilters && (
          <Button variant="ghost" onClick={onResetFilters}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
