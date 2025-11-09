"use client";

import { create } from "zustand";

import { fetchPropertyTypes } from "@/lib/api/metadata";
import type { ApiPropertyType } from "@/lib/api/types";

interface PropertyMetadataState {
  propertyTypes: ApiPropertyType[];
  status: "idle" | "loading" | "error";
  error: string | null;
  fetchMetadata: (force?: boolean) => Promise<void>;
}

export const usePropertyMetadataStore = create<PropertyMetadataState>(
  (set, get) => ({
    propertyTypes: [],
    status: "idle",
    error: null,
    fetchMetadata: async (force = false) => {
      if (!force && (get().status === "loading" || get().propertyTypes.length)) {
        return;
      }
      set({ status: "loading", error: null });
      try {
        const data = await fetchPropertyTypes();
        set({ propertyTypes: data, status: "idle", error: null });
      } catch (error) {
        set({
          status: "error",
          error:
            error instanceof Error ? error.message : "Unable to load metadata",
        });
      }
    },
  }),
);
