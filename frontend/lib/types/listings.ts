export type ListingStatus = "online" | "draft" | "offline" | "expired";

export type ListingBadgeVariant = "premium" | "standard" | "info" | "warning";

export interface ListingBadge {
  label: string;
  variant: ListingBadgeVariant;
}

export interface ListingAttribute {
  icon: "bed" | "bath" | "car" | "size" | "unit";
  label: string;
}

export interface ListingMetrics {
  impressions: number;
  pageViews: number;
  enquiries: number;
}

export interface ListingSummary {
  id: string;
  title: string;
  address: string;
  price: string;
  priceValue: number;
  badges: ListingBadge[];
  attributes: ListingAttribute[];
  metrics: ListingMetrics;
  rotationInfo: string;
  visibility: string;
  expiryCopy: string;
  thumbnailUrl: string;
  status: ListingStatus;
  postedOn: string;
  listingType: "sale" | "rent";
  category: "residential" | "commercial" | "industrial";
  propertyType:
    | "Bungalow / Villa"
    | "Apartment / Condo / Service Residence"
    | "Semi-Detached House"
    | "Terrace / Link House"
    | "Residential Land";
  unitType?:
    | "Intermediate"
    | "Corner Lot"
    | "End Lot"
    | "Duplex"
    | "Triplex"
    | "Penthouse"
    | "Studio"
    | "Soho"
    | "Loft"
    | "Dual Key"
    | "Prefer not to say";
  upgradeTiers: string[];
  hasVideo: boolean;
  hasVirtualTour: boolean;
  hasFloorplan: boolean;
}

// Placeholder used when a listing does not have an image yet.
export const LISTING_THUMBNAIL_PLACEHOLDER =
  "/images/placeholders/listing-card.svg";
