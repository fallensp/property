"use client";

import { useCallback, useMemo, useState } from "react";

import {
  DEFAULT_STATUS,
  MORE_FILTERS,
  SORT_OPTIONS,
  STATUS_METADATA,
} from "@/app/(portal)/portal/listings/constants";
import {
  listings as LISTING_DATA,
  type ListingStatus,
  type ListingSummary,
} from "@/lib/mock-data/listings";

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
export type ViewMode = "list" | "grid";

export interface MoreFilterState {
  video: boolean;
  "virtual-tour": boolean;
  floorplan: boolean;
}

export interface FilterState {
  searchTerm: string;
  listingType: string;
  category: string;
  propertyType: string;
  unitType: string;
  sort: SortValue;
  more: MoreFilterState;
}

export const DEFAULT_FILTERS: FilterState = {
  searchTerm: "",
  listingType: "all",
  category: "all",
  propertyType: "all",
  unitType: "all",
  sort: "listed_desc",
  more: {
    video: false,
    "virtual-tour": false,
    floorplan: false,
  },
};

function normalise(value: string) {
  return value.trim().toLowerCase();
}

function matchesSearch(listing: ListingSummary, searchTerm: string) {
  if (!searchTerm) return true;
  const haystack = [
    listing.title,
    listing.address,
    listing.id,
    listing.rotationInfo,
    listing.visibility,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(normalise(searchTerm));
}

function matchesFilter(value: string | undefined, filter: string) {
  if (!value) return filter === "all";
  return filter === "all" || value === filter;
}

function applyMoreFilters(listing: ListingSummary, filters: MoreFilterState) {
  if (filters.video && !listing.hasVideo) {
    return false;
  }
  if (filters["virtual-tour"] && !listing.hasVirtualTour) {
    return false;
  }
  if (filters.floorplan && !listing.hasFloorplan) {
    return false;
  }
  return true;
}

function parseDate(value: string): number {
  if (!value || value === "—") {
    return Number.NEGATIVE_INFINITY;
  }
  const [day, month, year] = value.split("/").map(Number);
  if (!day || !month || !year) {
    return Number.NEGATIVE_INFINITY;
  }
  return new Date(year, month - 1, day).getTime();
}

export function sortListings(listings: ListingSummary[], sort: SortValue) {
  switch (sort) {
    case "listed_desc":
      return [...listings].sort((a, b) => parseDate(b.postedOn) - parseDate(a.postedOn));
    case "listed_asc":
      return [...listings].sort((a, b) => parseDate(a.postedOn) - parseDate(b.postedOn));
    case "price_desc":
      return [...listings].sort((a, b) => b.priceValue - a.priceValue);
    case "price_asc":
      return [...listings].sort((a, b) => a.priceValue - b.priceValue);
    default:
      return listings;
  }
}

export function filterListing(
  listing: ListingSummary,
  filters: FilterState,
  status: ListingStatus,
) {
  if (listing.status !== status) {
    return false;
  }

  if (!matchesSearch(listing, filters.searchTerm)) {
    return false;
  }

  if (!matchesFilter(listing.listingType, filters.listingType)) {
    return false;
  }

  if (!matchesFilter(listing.category, filters.category)) {
    return false;
  }

  if (!matchesFilter(listing.propertyType, filters.propertyType)) {
    return false;
  }

  if (!matchesFilter(listing.unitType, filters.unitType)) {
    return false;
  }

  if (!applyMoreFilters(listing, filters.more)) {
    return false;
  }

  return true;
}

function deriveCounts(filters: FilterState, data: ListingSummary[]) {
  const counts: Record<ListingStatus, number> = {
    online: 0,
    draft: 0,
    offline: 0,
    expired: 0,
  };

  data.forEach((listing) => {
    const partialFilters = { ...filters };
    if (
      filterListing(
        listing,
        partialFilters,
        listing.status,
      )
    ) {
      counts[listing.status] += 1;
    }
  });

  return counts;
}

export function useListingsFilter(
  dataset: ListingSummary[] = LISTING_DATA,
) {
  const [status, setStatus] = useState<ListingStatus>(DEFAULT_STATUS);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const filteredListings = useMemo(() => {
    const base = dataset.filter((listing) =>
      filterListing(listing, filters, status),
    );

    return sortListings(base, filters.sort);
  }, [dataset, filters, status]);

  const statusCounts = useMemo(
    () => deriveCounts(filters, dataset),
    [dataset, filters],
  );

  const resetFilters = useCallback(() => {
    setFilters({
      ...DEFAULT_FILTERS,
      more: { ...DEFAULT_FILTERS.more },
    });
    setStatus(DEFAULT_STATUS);
    setViewMode("list");
  }, []);

  const toggleMoreFilter = useCallback((key: keyof MoreFilterState) => {
    setFilters((prev) => ({
      ...prev,
      more: { ...prev.more, [key]: !prev.more[key] },
    }));
  }, []);

  const updateFilter = useCallback(
    (key: keyof FilterState, value: string | SortValue | Partial<MoreFilterState>) => {
      if (key === "more") {
        setFilters((prev) => ({
          ...prev,
          more: { ...prev.more, ...(value as Partial<MoreFilterState>) },
        }));
        return;
      }

      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  return {
    status,
    setStatus,
    filters,
    updateFilter,
    toggleMoreFilter,
    resetFilters,
    viewMode,
    setViewMode,
    filteredListings,
    statusCounts,
    statusMetadata: STATUS_METADATA,
    availableMoreFilters: MORE_FILTERS,
  };
}
