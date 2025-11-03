"use client";

import { create } from "zustand";

interface PortalUser {
  email: string;
  name?: string;
}

interface PortalAuthState {
  user: PortalUser | null;
  login: (user: PortalUser) => void;
  logout: () => void;
}

export const usePortalAuth = create<PortalAuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
