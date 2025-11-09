"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { loginRequest, logoutRequest } from "@/lib/api/auth";
import type { ApiAuthUser } from "@/lib/api/types";

export interface PortalUser {
  id: number;
  email: string;
  name?: string | null;
  agentId?: string | null;
  agentName?: string | null;
  developerId?: string | null;
}

interface PortalAuthState {
  user: PortalUser | null;
  token: string | null;
  status: "idle" | "loading";
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const mapUser = (user: ApiAuthUser): PortalUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  agentId: user.agent?.id ?? null,
  agentName: user.agent?.full_name ?? null,
  developerId: user.agent?.developer_id ?? null,
});

export const usePortalAuth = create<PortalAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      status: "idle",
      error: null,
      login: async (email, password) => {
        set({ status: "loading", error: null });
        try {
          const response = await loginRequest({
            email,
            password,
            device_name: "portal",
          });
          set({
            user: mapUser(response.user),
            token: response.token,
            status: "idle",
            error: null,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unable to sign in.";
          set({ status: "idle", error: message });
          throw error;
        }
      },
      logout: async () => {
        const token = get().token;
        try {
          if (token) {
            await logoutRequest(token);
          }
        } catch (error) {
          console.error(error);
        } finally {
          set({ user: null, token: null, status: "idle", error: null });
        }
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: "portal-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
);
