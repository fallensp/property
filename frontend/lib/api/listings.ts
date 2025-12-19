import { apiFetch, type ApiRequestOptions } from "./client";
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
    | "neighbourhood_id"
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
  /** Image IDs to associate with the listing (from draft uploads) */
  image_ids?: string[];
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
  const response = await apiFetch<{ data: ApiListing }>(`/listings/${listingId}`, {
    token,
  });
  return response.data;
}

export async function createListing(
  token: string,
  payload: ListingPayload,
): Promise<ApiListing> {
  const response = await apiFetch<{ data: ApiListing }>("/listings", {
    method: "POST",
    token,
    body: payload,
  });
  return response.data;
}

export async function updateListing(
  token: string,
  listingId: string,
  payload: Partial<ListingPayload>,
): Promise<ApiListing> {
  const response = await apiFetch<{ data: ApiListing }>(`/listings/${listingId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
  return response.data;
}

export async function deleteListing(token: string, listingId: string): Promise<void> {
  await apiFetch(`/listings/${listingId}`, {
    method: "DELETE",
    token,
  });
}

export async function fetchPublicListings(
  searchParams?: Record<string, string | number | undefined>,
  options?: ApiRequestOptions,
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
  const path = query ? `/public/listings?${query}` : "/public/listings";

  return apiFetch<ApiPaginatedResponse<ApiListing>>(path, options);
}

export async function fetchPublicListing(
  listingId: string,
  options?: ApiRequestOptions,
): Promise<ApiListing> {
  const response = await apiFetch<{ data: ApiListing }>(
    `/public/listings/${listingId}`,
    options,
  );
  return response.data;
}
