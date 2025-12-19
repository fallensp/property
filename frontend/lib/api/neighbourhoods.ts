import { apiFetch } from "./client";

export interface Neighbourhood {
  id: number;
  name: string;
  image_url: string | null;
  listings_count?: number;
  created_at: string;
  updated_at: string;
}

export interface NeighbourhoodCreatePayload {
  name: string;
  image?: File;
}

export async function listNeighbourhoods(token?: string) {
  const response = await apiFetch<{ data: Neighbourhood[] }>(
    "/neighbourhoods",
    token ? { token } : {},
  );
  return response.data;
}

export async function fetchNeighbourhood(token: string, id: string) {
  const response = await apiFetch<{ data: Neighbourhood }>(
    `/admin/neighbourhoods/${id}`,
    { token },
  );
  return response.data;
}

export async function createNeighbourhood(
  token: string,
  payload: NeighbourhoodCreatePayload,
) {
  const formData = new FormData();
  formData.append("name", payload.name);
  if (payload.image) {
    formData.append("image", payload.image);
  }

  const response = await apiFetch<{ data: Neighbourhood }>(
    "/admin/neighbourhoods",
    {
      method: "POST",
      token,
      body: formData,
    },
  );
  return response.data;
}

export async function updateNeighbourhood(
  token: string,
  id: string,
  payload: Partial<NeighbourhoodCreatePayload>,
) {
  const formData = new FormData();
  if (payload.name) {
    formData.append("name", payload.name);
  }
  if (payload.image) {
    formData.append("image", payload.image);
  }
  formData.append("_method", "PATCH");

  const response = await apiFetch<{ data: Neighbourhood }>(
    `/admin/neighbourhoods/${id}`,
    {
      method: "POST",
      token,
      body: formData,
    },
  );
  return response.data;
}

export async function deleteNeighbourhood(token: string, id: string) {
  await apiFetch(`/admin/neighbourhoods/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function listPublicNeighbourhoods() {
  const response = await apiFetch<{ data: Neighbourhood[] }>("/neighbourhoods");
  return response.data;
}
