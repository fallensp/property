import { apiFetch } from "./client";
import type {
  ApiListing,
  ApiPaginatedResponse,
  ApiListingLocation,
} from "./types";

export interface ListingPayload
  extends Pick<
    ApiListing,
    | "developer_id"
    | "property_type_id"
    | "property_sub_type_id"
    | "property_unit_type_id"
    | "title"
    | "reference_number"
    | "status"
    | "listing_type"
    | "category"
    | "price_currency"
    | "price_value"
    | "price_display"
    | "price_type"
    | "available_from"
    | "tenure"
    | "completion_year"
    | "headline"
    | "description"
    | "has_video"
    | "has_virtual_tour"
    | "has_floorplan"
    | "attributes"
    | "metadata"
  > {
  location: ApiListingLocation;
}

export async function fetchListings(
  token: string,
  searchParams?: Record<string, string | number | undefined>,
): Promise<ApiPaginatedResponse<ApiListing>> {
  const params = new URLSearchParams();
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  const query = params.toString();
  const path = query ? `/listings?${query}` : "/listings";

  return apiFetch<ApiPaginatedResponse<ApiListing>>(path, {
    token,
  });
}

export async function fetchListing(
  token: string,
  listingId: string,
): Promise<ApiListing> {
  return apiFetch<ApiListing>(`/listings/${listingId}`, {
    token,
  });
}

export async function createListing(
  token: string,
  payload: ListingPayload,
): Promise<ApiListing> {
  return apiFetch<ApiListing>("/listings", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function updateListing(
  token: string,
  listingId: string,
  payload: Partial<ListingPayload>,
): Promise<ApiListing> {
  return apiFetch<ApiListing>(`/listings/${listingId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export async function deleteListing(token: string, listingId: string): Promise<void> {
  await apiFetch(`/listings/${listingId}`, {
    method: "DELETE",
    token,
  });
}
