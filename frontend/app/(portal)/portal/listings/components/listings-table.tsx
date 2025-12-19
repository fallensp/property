"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Gauge, Ruler, Thermometer, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatMetric } from "@/lib/utils/formatting";
import type { ListingSummary } from "@/lib/types/listings";

import { EmptyState } from "./empty-state";

interface ListingsTableProps {
  listings: ListingSummary[];
  viewMode: "list" | "grid";
  onResetFilters?: () => void;
  createListingHref?: string;
}

const ATTRIBUTE_ICON_MAP = {
  bed: Users,
  bath: Thermometer,
  car: Gauge,
  size: Ruler,
  unit: ExternalLink,
} as const;

function AttributePill({
  icon,
  label,
}: {
  icon: ListingSummary["attributes"][number]["icon"];
  label: string;
}) {
  const Icon = ATTRIBUTE_ICON_MAP[icon];
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}

export function ListingsTable({
  listings,
  viewMode,
  onResetFilters,
  createListingHref,
}: ListingsTableProps) {
  if (!listings.length) {
    return (
      <EmptyState
        onResetFilters={onResetFilters}
        createListingHref={createListingHref}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        viewMode === "grid"
          ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          : "grid-cols-1",
      )}
    >
      {listings.map((listing, index) => (
        <article
          key={listing.id}
          aria-label={listing.title}
          className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm transition hover:border-primary/50 hover:shadow-md lg:flex-row"
        >
          <div className="relative h-44 overflow-hidden rounded-md bg-muted lg:h-auto lg:w-48">
            <Image
              src={listing.thumbnailUrl}
              alt={`${listing.title} preview`}
              width={320}
              height={240}
              className="h-full w-full object-cover"
              priority={index < 3}
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute left-3 bottom-3 inline-flex items-center rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-foreground opacity-90 backdrop-blur">
              Preview image
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {listing.badges.map((badge) => (
                <Badge
                  key={`${listing.id}-${badge.label}`}
                  variant={badge.variant === "premium" ? "outline" : "secondary"}
                  className={cn(
                    badge.variant === "premium" && "border-amber-500 text-amber-600",
                    badge.variant === "warning" && "border-destructive text-destructive",
                    badge.variant === "info" && "border-primary text-primary",
                  )}
                >
                  {badge.label}
                </Badge>
              ))}
            </div>
            <div className="space-y-1">
              <Link
                href={`/portal/listings/${listing.id}`}
                className="text-lg font-semibold leading-tight text-foreground hover:text-primary"
              >
                {listing.title}
              </Link>
              <p className="text-sm text-muted-foreground">{listing.address}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
              <span>{listing.price}</span>
              <span className="text-muted-foreground">•</span>
              <span>Posted: {listing.postedOn}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {listing.attributes.map((attribute) => (
                <AttributePill
                  key={`${listing.id}-${attribute.label}`}
                  icon={attribute.icon}
                  label={attribute.label}
                />
              ))}
            </div>
            <div className="grid gap-2 text-xs text-muted-foreground md:grid-cols-2 lg:grid-cols-3">
              <p>
                <strong className="font-semibold text-foreground">
                  Impressions:
                </strong>{" "}
                {formatMetric(listing.metrics.impressions)}
              </p>
              <p>
                <strong className="font-semibold text-foreground">
                  Page views:
                </strong>{" "}
                {formatMetric(listing.metrics.pageViews)}
              </p>
              <p>
                <strong className="font-semibold text-foreground">
                  Enquiries:
                </strong>{" "}
                {formatMetric(listing.metrics.enquiries)}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-border pt-3 text-sm text-muted-foreground">
              <div>
                <p>{listing.rotationInfo}</p>
                <p>{listing.visibility}</p>
              </div>
              <div className="text-right">
                <p>{listing.expiryCopy}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href={`/portal/listings/${listing.id}`}>View</Link>
              </Button>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
