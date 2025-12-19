import { apiFetch } from "./client";
import type { ApiAgentCreatePayload } from "./types";

export async function createAgent(
  token: string,
  payload: ApiAgentCreatePayload,
) {
  const response = await apiFetch<{ agent: any; message: string }>("/admin/agents", {
    method: "POST",
    token,
    body: payload,
  });
  return response.agent;
}
