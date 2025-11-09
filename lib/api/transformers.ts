import {
  LISTING_THUMBNAIL_PLACEHOLDER,
  type ListingBadge,
  type ListingSummary,
  type ListingStatus,
} from "@/lib/mock-data/listings";
import { type ListingDetail } from "@/lib/mock-data/listing-details";
import { formatDate, formatPrice } from "@/lib/utils/formatting";

import type { ApiListing } from "./types";

const STATUS_MAP: Record<string, ListingStatus> = {
  online: "online",
  draft: "draft",
  offline: "offline",
  expired: "expired",
};

const DEFAULT_STATUS: ListingStatus = "draft";

function normalizeStatus(status?: string | null): ListingStatus {
  if (!status) return DEFAULT_STATUS;
  return STATUS_MAP[status] ?? DEFAULT_STATUS;
}

function buildBadges(listing: ApiListing): ListingBadge[] {
  const badges: ListingBadge[] = [];

  const category = listing.category ?? "residential";
  badges.push({
    label: category.charAt(0).toUpperCase() + category.slice(1),
    variant: "premium",
  });

  if (listing.listing_type) {
    badges.push({
      label: listing.listing_type === "sale" ? "Sale" : "Rent",
      variant: "info",
    });
  }

  if (listing.property_type?.name) {
    badges.push({
      label: listing.property_type.name,
      variant: "standard",
    });
  }

  return badges;
}

function buildAttributes(listing: ApiListing): ListingSummary["attributes"] {
  const attributes: ListingSummary["attributes"] = [];
  const source = (listing.attributes ?? {}) as Record<string, unknown>;

  const bedrooms = Number(source.bedrooms);
  const bathrooms = Number(source.bathrooms);
  const parking = Number(source.parking);
  const builtUp = Number(source.built_up_sqft);

  if (Number.isFinite(bedrooms) && bedrooms > 0) {
    attributes.push({ icon: "bed", label: `${bedrooms}` });
  }
  if (Number.isFinite(bathrooms) && bathrooms > 0) {
    attributes.push({ icon: "bath", label: `${bathrooms}` });
  }
  if (Number.isFinite(parking) && parking > 0) {
    attributes.push({ icon: "car", label: `${parking}` });
  }
  if (Number.isFinite(builtUp) && builtUp > 0) {
    attributes.push({ icon: "size", label: `Built-up: ${builtUp} sq.ft.` });
  }

  return attributes;
}

export function toListingSummary(listing: ApiListing): ListingSummary {
  const status = normalizeStatus(listing.status);
  const createdAt = listing.created_at ? new Date(listing.created_at) : null;

  return {
    id: listing.id,
    title: listing.title || listing.location?.development_name || "Untitled listing",
    address:
      listing.location?.address_line1 ||
      listing.location?.city ||
      listing.location?.state ||
      "Address to be confirmed",
    price:
      listing.price_display ??
      (listing.price_value ? formatPrice(listing.price_value) : "Price on request"),
    priceValue: listing.price_value ?? 0,
    badges: buildBadges(listing),
    attributes: buildAttributes(listing),
    metrics: {
      impressions: 0,
      pageViews: 0,
      enquiries: 0,
    },
    rotationInfo: status === "online" ? "Live on marketplace" : "Draft saved",
    visibility: status === "online" ? "Visibility: Public" : "Visibility: Internal",
    expiryCopy: status === "online" ? "Renew to maintain visibility" : "Complete details to publish",
    thumbnailUrl: LISTING_THUMBNAIL_PLACEHOLDER,
    status,
    postedOn: createdAt ? formatDate(createdAt) : "—",
    listingType: listing.listing_type ?? "sale",
    category: (listing.category as ListingSummary["category"]) ?? "residential",
    propertyType: listing.property_type?.name ?? listing.location?.propertyType ?? "Unassigned",
    unitType: listing.property_unit_type?.name ?? listing.location?.propertyUnitType ?? undefined,
    upgradeTiers: [],
    hasVideo: Boolean(listing.has_video),
    hasVirtualTour: Boolean(listing.has_virtual_tour),
    hasFloorplan: Boolean(listing.has_floorplan),
  };
}

export function toListingDetail(listing: ApiListing): ListingDetail {
  const summary = toListingSummary(listing);
  const attributeSource = (listing.attributes ?? {}) as Record<string, unknown>;
  const getAttributeNumber = (key: string): number => {
    const value = attributeSource[key];
    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isFinite(parsed) ? Number(parsed) : 0;
  };
  const gallery = Array.from({ length: 3 }).map((_, index) => ({
    src: LISTING_THUMBNAIL_PLACEHOLDER,
    alt: `${listing.title ?? "Listing"} preview ${index + 1}`,
  }));

  const metadata = (listing.metadata ?? {}) as Record<string, unknown>;
  const availabilityMode =
    typeof metadata.availability_mode === "string"
      ? (metadata.availability_mode as ListingDetail["availabilityMode"])
      : "immediate";
  const availableDate =
    typeof metadata.available_date === "string"
      ? metadata.available_date
      : undefined;
  const maintenanceFee =
    typeof metadata.maintenance_fee === "string" ||
    typeof metadata.maintenance_fee === "number"
      ? String(metadata.maintenance_fee)
      : "—";
  const pricePerSqft =
    typeof metadata.price_per_sqft === "string" ||
    typeof metadata.price_per_sqft === "number"
      ? String(metadata.price_per_sqft)
      : undefined;
  const furnishing =
    typeof metadata.furnishing === "string"
      ? (metadata.furnishing as ListingDetail["unit"]["furnishing"])
      : "Unfurnished";
  const features = Array.isArray(metadata.features)
    ? (metadata.features as string[])
    : [];

  const builtUpSqft = getAttributeNumber("built_up_sqft");
  return {
    id: listing.id,
    summary,
    propertyName: listing.title ?? listing.location?.development_name ?? "Untitled listing",
    referenceNumber: listing.reference_number ?? listing.id,
    headline: listing.headline ?? "Listing headline coming soon",
    description:
      listing.description ??
      "Add a compelling description to help buyers fall in love with this property.",
    propertyCategory:
      (listing.category as ListingDetail["propertyCategory"]) ?? "residential",
    listingPurpose: listing.listing_type ?? "sale",
    availabilityMode,
    availableDate: availableDate ?? listing.available_from ?? undefined,
    location: {
      developmentName: listing.location?.development_name ?? summary.title,
      address: listing.location?.address_line1 ?? summary.address,
      propertyType: listing.property_type?.name ?? "Not specified",
      propertySubType: listing.property_sub_type?.name ?? "Not specified",
      propertyUnitType: listing.property_unit_type?.name ?? "Prefer not to say",
      tenure: listing.tenure ?? listing.location?.tenure ?? "Not specified",
      completionYear: listing.completion_year ?? "—",
    },
    unit: {
      builtUp: builtUpSqft > 0 ? `${builtUpSqft} sq.ft.` : "—",
      landArea: undefined,
      bedrooms: getAttributeNumber("bedrooms"),
      bathrooms: getAttributeNumber("bathrooms"),
      maidRooms: getAttributeNumber("maid_rooms"),
      parking: getAttributeNumber("parking"),
      furnishing,
      features,
    },
    pricing: {
      priceType:
        (listing.price_type as ListingDetail["pricing"]["priceType"]) ?? "fixed",
      sellingPrice: listing.price_display ?? summary.price,
      maintenanceFee,
      pricePerSqft,
    },
    gallery,
  };
}
