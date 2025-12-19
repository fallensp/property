import type { ListingSummary } from "./listings";

export interface ListingDetail {
  id: string;
  summary: ListingSummary;
  agent?: {
    id: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
  propertyName: string;
  referenceNumber: string;
  neighbourhoodId?: number | null;
  neighbourhood?: {
    id: number;
    name: string;
    imageUrl: string | null;
  } | null;
  headline: string;
  description: string;
  propertyCategory: "residential" | "commercial" | "industrial";
  listingPurpose: "sale" | "rent";
  availabilityMode: "immediate" | "scheduled";
  availableDate?: string;
  location: {
    developmentName: string;
    address: string;
    propertyType: string;
    propertySubType: string;
    propertyUnitType: string;
    tenure: string;
    completionYear: string;
    latitude?: number | null;
    longitude?: number | null;
  };
  unit: {
    builtUp: string;
    landArea?: string;
    bedrooms: number;
    bathrooms: number;
    maidRooms?: number;
    parking: number;
    furnishing: string;
    features: string[];
  };
  pricing: {
    priceType: "negotiable" | "fixed" | "poa" | "none";
    sellingPrice: string;
    maintenanceFee: string;
    pricePerSqft?: string;
  };
  gallery: { id: string; src: string; alt: string }[];
}
