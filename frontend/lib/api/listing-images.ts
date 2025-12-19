import { apiFetch } from "./client";

export interface UploadedImage {
  id: string;
  url: string;
  thumbnail_url: string | null;
  original_filename: string;
}

export interface ListingImage extends UploadedImage {
  order: number;
  is_cover: boolean;
}

interface UploadImagesResponse {
  data: UploadedImage[];
}

interface ListingImagesResponse {
  data: ListingImage[];
}

/**
 * Upload listing images with watermark overlay
 */
export async function uploadListingImages(
  token: string,
  files: File[],
  listingId?: string
): Promise<UploadedImage[]> {
  const formData = new FormData();

  files.forEach((file, index) => {
    formData.append(`images[${index}]`, file);
  });

  if (listingId) {
    formData.append("listing_id", listingId);
  }

  const response = await apiFetch<UploadImagesResponse>("/listing-images", {
    method: "POST",
    token,
    body: formData,
  });

  return response.data;
}

/**
 * Get images for a listing
 */
export async function fetchListingImages(
  token: string,
  listingId: string
): Promise<ListingImage[]> {
  const response = await apiFetch<ListingImagesResponse>(
    `/listings/${listingId}/images`,
    { token }
  );
  return response.data;
}

/**
 * Delete a listing image
 */
export async function deleteListingImage(
  token: string,
  imageId: string
): Promise<void> {
  await apiFetch(`/listing-images/${imageId}`, {
    method: "DELETE",
    token,
  });
}

/**
 * Update image order
 */
export async function updateImageOrder(
  token: string,
  orders: Array<{ id: string; order: number }>
): Promise<void> {
  await apiFetch("/listing-images/order", {
    method: "PATCH",
    token,
    body: { orders },
  });
}

/**
 * Set cover image for a listing
 */
export async function setCoverImage(
  token: string,
  listingId: string,
  imageId: string
): Promise<void> {
  await apiFetch(`/listings/${listingId}/images/${imageId}/cover`, {
    method: "PATCH",
    token,
  });
}
