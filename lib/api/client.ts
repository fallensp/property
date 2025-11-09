const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown, message?: string) {
    super(message ?? "Request failed");
    this.status = status;
    this.data = data;
  }
}

export interface ApiRequestOptions extends RequestInit {
  token?: string | null;
  body?: unknown;
}

const buildUrl = (path: string) => {
  if (path.startsWith("http")) {
    return path;
  }
  const base = API_BASE_URL.replace(/\/$/, "");
  const cleaned = path.replace(/^\//, "");
  return `${base}/${cleaned}`;
};

export async function apiFetch<T>(
  path: string,
  { token, body, headers, ...init }: ApiRequestOptions = {},
): Promise<T> {
  const computedHeaders = new Headers(headers ?? {});
  computedHeaders.set("Accept", "application/json");

  let preparedBody: BodyInit | undefined;

  if (body instanceof FormData) {
    preparedBody = body;
  } else if (body !== undefined && body !== null) {
    preparedBody = JSON.stringify(body);
    computedHeaders.set("Content-Type", "application/json");
  }

  if (token) {
    computedHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers: computedHeaders,
    body: preparedBody,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (typeof data === "object" &&
        data &&
        "message" in data &&
        typeof data.message === "string" &&
        data.message) ||
      response.statusText ||
      "Request failed";
    throw new ApiError(response.status, data, message);
  }

  return data as T;
}
