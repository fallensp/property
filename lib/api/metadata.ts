import { apiFetch } from "./client";
import type { ApiPropertyType } from "./types";

type PropertyTypeResponse =
  | ApiPropertyType[]
  | {
      data?: ApiPropertyType[];
    };

export async function fetchPropertyTypes(): Promise<ApiPropertyType[]> {
  const response = await apiFetch<PropertyTypeResponse>(
    "/metadata/property-types",
  );

  if (Array.isArray(response)) {
    return response;
  }

  if (response?.data && Array.isArray(response.data)) {
    return response.data;
  }

  throw new Error("Invalid property types response");
}
