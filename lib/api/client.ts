import { API_BASE_URL } from "@/lib/config";
import type { ApiResponse } from "@/lib/types/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public errors?: { field: string; message: string }[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  const body = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !body.success) {
    throw new ApiError(
      body.message || `Request failed (${res.status})`,
      res.status,
      body.code,
      body.errors ?? undefined,
    );
  }

  return body;
}

export function formatApiErrors(
  errors?: { field: string; message: string }[],
): string {
  if (!errors?.length) return "";
  return errors.map((e) => e.message).join(". ");
}
