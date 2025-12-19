import { apiFetch } from "./client";
import type { ApiAgentCreatePayload } from "./types";

export async function createAgent(token: string, payload: ApiAgentCreatePayload) {
  const response = await apiFetch<{ agent: any }>("/admin/agents", {
    method: "POST",
    token,
    body: payload,
  });
  return response.agent;
}

export async function updateAgent(
  token: string,
  agentId: string,
  payload: Partial<Omit<ApiAgentCreatePayload, "password">>,
) {
  const response = await apiFetch<{ agent: any }>(`/admin/agents/${agentId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
  return response.agent;
}

export async function fetchAgent(token: string, agentId: string) {
  const response = await apiFetch<{ agent: any }>(`/admin/agents/${agentId}`, {
    token,
  });
  return response.agent;
}

export async function listAgents(token: string, perPage = 100) {
  const response = await apiFetch<{ data: any[]; meta: any }>(
    `/admin/agents?per_page=${perPage}`,
    { token },
  );
  return response;
}
