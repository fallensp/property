import { apiFetch } from "./client";
import type { ApiPropertyType } from "./types";

export async function fetchPropertyTypes(): Promise<ApiPropertyType[]> {
  return apiFetch<ApiPropertyType[]>("/metadata/property-types");
}
