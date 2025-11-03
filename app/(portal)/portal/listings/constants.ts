import type {
  ListingStatus,
  ListingSummary,
  ListingBadgeVariant,
} from "@/lib/mock-data/listings";

export interface FilterOption {
  label: string;
  value: string;
}

export interface StatusMeta {
  label: string;
  badgeVariant: ListingBadgeVariant;
  description: string;
}

export const STATUS_METADATA: Record<ListingStatus, StatusMeta> = {
  online: {
    label: "Online",
    badgeVariant: "premium",
    description: "Active listings currently visible to buyers and renters.",
  },
  draft: {
    label: "Draft",
    badgeVariant: "info",
    description: "Saved drafts awaiting required details before publishing.",
  },
  offline: {
    label: "Offline",
    badgeVariant: "standard",
    description: "Listings temporarily disabled due to payment or manual pause.",
  },
  expired: {
    label: "Expired",
    badgeVariant: "warning",
    description: "Listings that require renewal to be visible again.",
  },
};

export const SEARCH_PLACEHOLDER =
  "Search by township, postcode, address, ID or listing reference number";

export const LISTING_TYPE_OPTIONS: FilterOption[] = [
  { label: "All listing types", value: "all" },
  { label: "Buy", value: "buy" },
  { label: "Rent", value: "rent" },
];

export const CATEGORY_OPTIONS: FilterOption[] = [
  { label: "All categories", value: "all" },
  { label: "Premium", value: "premium" },
  { label: "Standard", value: "standard" },
];

export const PROPERTY_TYPE_OPTIONS: FilterOption[] = [
  { label: "All property types", value: "all" },
  { label: "Bungalow", value: "bungalow" },
  { label: "Condo", value: "condo" },
  { label: "Loft", value: "loft" },
  { label: "Retail", value: "retail" },
  { label: "Penthouse", value: "penthouse" },
];

export const UPGRADE_OPTIONS: FilterOption[] = [
  { label: "Any upgrade", value: "all" },
  { label: "Premium", value: "premium" },
  { label: "Standard", value: "standard" },
  { label: "Featured", value: "featured" },
];

export const UNIT_TYPE_OPTIONS: FilterOption[] = [
  { label: "All unit types", value: "all" },
  { label: "Corner lot", value: "corner" },
  { label: "High floor", value: "high-floor" },
  { label: "Intermediate", value: "intermediate" },
];

export const MORE_FILTERS: FilterOption[] = [
  { label: "Has video", value: "video" },
  { label: "Has 360 tour", value: "virtual-tour" },
  { label: "Has floorplan", value: "floorplan" },
];

export const SORT_OPTIONS: FilterOption[] = [
  { label: "Listed (New to old)", value: "listed_desc" },
  { label: "Listed (Old to new)", value: "listed_asc" },
  { label: "Price (High to low)", value: "price_desc" },
  { label: "Price (Low to high)", value: "price_asc" },
];

export const GRID_OPTIONS: FilterOption[] = [
  { label: "List view", value: "list" },
  { label: "Grid view", value: "grid" },
];

export const DEFAULT_STATUS: ListingStatus = "online";

export function countByStatus(
  status: ListingStatus,
  source: ListingSummary[],
): number {
  return source.filter((listing) => listing.status === status).length;
}
