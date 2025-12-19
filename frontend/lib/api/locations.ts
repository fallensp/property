import { apiFetch } from "./client";
import type { LocationSuggestion } from "./types";

interface LocationSuggestionResponse {
  data: LocationSuggestion[];
}

export async function fetchLocationSuggestions(
  query?: string,
  limit = 5,
): Promise<LocationSuggestion[]> {
  const params = new URLSearchParams();
  if (query) {
    params.set("query", query);
  }
  params.set("limit", String(limit));

  const response = await apiFetch<LocationSuggestionResponse>(
    `/locations/suggestions?${params.toString()}`,
  );

  return response.data;
}
