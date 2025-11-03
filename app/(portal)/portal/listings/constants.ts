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
  { label: "All listing purposes", value: "all" },
  { label: "Sale", value: "sale" },
  { label: "Rent", value: "rent" },
];

export const CATEGORY_OPTIONS: FilterOption[] = [
  { label: "All property categories", value: "all" },
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Industrial", value: "industrial" },
];

export const PROPERTY_TYPE_OPTIONS: FilterOption[] = [
  { label: "All property types", value: "all" },
  { label: "Bungalow / Villa", value: "Bungalow / Villa" },
  {
    label: "Apartment / Condo / Service Residence",
    value: "Apartment / Condo / Service Residence",
  },
  { label: "Semi-Detached House", value: "Semi-Detached House" },
  { label: "Terrace / Link House", value: "Terrace / Link House" },
  { label: "Residential Land", value: "Residential Land" },
];

export const UNIT_TYPE_OPTIONS: FilterOption[] = [
  { label: "All unit types", value: "all" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Corner Lot", value: "Corner Lot" },
  { label: "End Lot", value: "End Lot" },
  { label: "Duplex", value: "Duplex" },
  { label: "Triplex", value: "Triplex" },
  { label: "Penthouse", value: "Penthouse" },
  { label: "Studio", value: "Studio" },
  { label: "Soho", value: "Soho" },
  { label: "Loft", value: "Loft" },
  { label: "Dual Key", value: "Dual Key" },
  { label: "Prefer not to say", value: "Prefer not to say" },
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
