import { apiFetch } from "./client";
import type { ApiAuthUser } from "./types";

interface LoginPayload {
  email: string;
  password: string;
  device_name?: string;
}

interface LoginResponse {
  token: string;
  user: ApiAuthUser;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  device_name?: string;
}

interface RegisterResponse {
  token: string;
  user: ApiAuthUser;
}

interface MeResponse {
  user: ApiAuthUser;
}

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function registerRequest(payload: RegisterPayload): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function logoutRequest(token: string): Promise<void> {
  await apiFetch("/auth/logout", {
    method: "POST",
    token,
  });
}

export async function fetchCurrentUser(token: string): Promise<ApiAuthUser> {
  const response = await apiFetch<MeResponse>("/auth/me", {
    method: "GET",
    token,
  });

  return response.user;
}
