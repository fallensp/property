"use client";

import { cn } from "@/lib/utils";
import { STATUS_METADATA } from "../constants";
import type { ListingStatus } from "@/lib/mock-data/listings";
import { statusOrder } from "@/lib/mock-data/listings";

interface ListingsTabsProps {
  activeStatus: ListingStatus;
  statusCounts: Record<ListingStatus, number>;
  onStatusChange: (status: ListingStatus) => void;
}

export function ListingsTabs({
  activeStatus,
  statusCounts,
  onStatusChange,
}: ListingsTabsProps) {
  return (
    <div role="tablist" aria-label="Listing status">
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-1">
        {statusOrder.map((status) => {
          const isActive = status === activeStatus;
          const meta = STATUS_METADATA[status];
          const count = statusCounts[status] ?? 0;

          return (
            <button
              key={status}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onStatusChange(status)}
              className={cn(
                "flex items-center gap-2 rounded-t-md px-2 py-1 text-sm",
                "transition-colors",
                isActive
                  ? "border-b-2 border-primary bg-background font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span>{meta.label}</span>
              <span
                className={cn(
                  "min-w-[2rem] rounded-full px-2 py-0.5 text-xs",
                  isActive ? "bg-primary/10 text-primary" : "bg-muted text-foreground",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {STATUS_METADATA[activeStatus]?.description}
      </p>
    </div>
  );
}
