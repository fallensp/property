"use client";

import { useCallback, useState } from "react";

import {
  useListingStore,
  type ListingDraft,
} from "@/app/(listing)/listing/create/state/listing-store";
import { usePortalAuth } from "@/app/(portal)/portal/hooks/use-portal-auth";
import { createListing, updateListing, type ListingPayload } from "@/lib/api/listings";
import { formatPrice } from "@/lib/utils/formatting";

type SubmissionStatus = "idle" | "saving" | "success" | "error";

const DEFAULT_CURRENCY = "MYR";

export function useListingSubmission() {
  const draft = useListingStore((state) => state.draft);
  const isUpdateMode = useListingStore((state) => state.isUpdateMode);
  const resetDraft = useListingStore((state) => state.reset);
  const token = usePortalAuth((state) => state.token);
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const submitDraft = useCallback(async () => {
    if (!token) {
      const message = "Please sign in again to save your listing.";
      setError(message);
      setStatus("error");
      throw new Error(message);
    }

    if (!draft.propertyName || draft.propertyName.trim().length === 0) {
      const message = "Add a property name before saving.";
      setError(message);
      setStatus("error");
      throw new Error(message);
    }

    const location = draft.location;
    if (
      !location ||
      !location.propertyTypeId ||
      !location.propertySubTypeId ||
      !location.propertyUnitTypeId
    ) {
      const message = "Select property metadata before saving.";
      setError(message);
      setStatus("error");
      throw new Error(message);
    }

    const payload = buildListingPayload(draft);

    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.__payload = payload;
      console.log('Submission Debug:', {
        isUpdateMode,
        draftId: draft.id,
        willUpdate: isUpdateMode && draft.id,
        action: isUpdateMode && draft.id ? 'UPDATE' : 'CREATE'
      });
    }

    setStatus("saving");
    setError(null);
    try {
      if (isUpdateMode && draft.id) {
        console.log('Calling updateListing with ID:', draft.id);
        await updateListing(token, draft.id, payload);
      } else {
        console.log('Calling createListing');
        await createListing(token, payload);
      }
      setStatus("success");
      resetDraft();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : isUpdateMode
            ? "Unable to update the listing. Please try again."
            : "Unable to save the listing. Please try again.";
      setError(message);
      setStatus("error");
      throw err;
    }
  }, [draft, isUpdateMode, resetDraft, token]);

  return {
    submitDraft,
    status,
    error,
  };
}

function buildListingPayload(draft: ListingDraft): ListingPayload {
  const location = draft.location!;

  const locationPayload: ListingPayload["location"] = {
    development_name: location.developmentName || draft.propertyName,
    address_line1: location.address ?? "",
    address_line2: null,
    street: location.street ?? "",
    city: location.city ?? "",
    state: location.state ?? "",
    postal_code: location.postalCode ?? "",
    country: "Malaysia",
    latitude: location.latitude ?? null,
    longitude: location.longitude ?? null,
    is_bumi_lot: location.bumiLot === "Yes",
    title_type: location.titleType ?? null,
    tenure: location.tenure ?? null,
    google_place_id: null,
    google_plus_code: null,
    google_formatted_address: location.address ?? null,
    google_metadata: null,
  };

  const attributes: Record<string, unknown> = {
    bedrooms: draft.unitDetails.bedrooms,
    bathrooms: draft.unitDetails.bathrooms,
    maid_rooms: draft.unitDetails.maidRooms,
    parking: draft.unitDetails.parkingSpots,
    built_up_sqft: draft.unitDetails.builtUp,
    furnishing: draft.unitDetails.furnishing,
  };

  const metadata: Record<string, unknown> = {
    listing_purpose: draft.listingPurpose,
    availability_mode: draft.availabilityMode,
    available_date: draft.availableDate,
    maintenance_fee: draft.pricing.maintenanceFee,
    price_per_sqft: draft.pricing.pricePerSqft,
    features: draft.unitDetails.features,
  };

  return {
    developer_id: null,
    property_type_id: location.propertyTypeId!,
    property_sub_type_id: location.propertySubTypeId!,
    property_unit_type_id: location.propertyUnitTypeId!,
    title: draft.propertyName,
    reference_number: draft.referenceNumber || null,
    status: "draft",
    listing_type: draft.listingPurpose ?? "sale",
    category: draft.propertyCategory ?? "residential",
    price_currency: DEFAULT_CURRENCY,
    price_value: draft.pricing.sellingPrice ?? null,
    price_display: draft.pricing.sellingPrice
      ? formatPrice(draft.pricing.sellingPrice)
      : null,
    price_type: draft.pricing.priceType,
    available_from: draft.availableDate ?? null,
    tenure: location.tenure ?? null,
    completion_year: location.completionYear ?? null,
    headline: draft.headline || null,
    description: draft.description || null,
    has_video: draft.media.videos.length > 0,
    has_virtual_tour: draft.media.virtualTours.length > 0,
    has_floorplan: draft.media.floorplans.length > 0,
    attributes,
    metadata,
    location: locationPayload,
  };
}
