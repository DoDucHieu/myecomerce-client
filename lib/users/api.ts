import { apiFetch } from "@/lib/api/client";
import type {
  CreateUserRequest,
  CreateUserResponse,
  GetUsersParams,
  PaginationResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UserResponse,
} from "@/lib/types/api";

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

export function buildUsersQuery(params: GetUsersParams): string {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
  });

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  return searchParams.toString();
}

export async function fetchUsers(token: string, params: GetUsersParams) {
  const query = buildUsersQuery(params);
  return apiFetch<PaginationResponse<UserResponse>>(`/users?${query}`, {
    headers: authHeaders(token),
  });
}

export async function fetchUserById(token: string, id: string) {
  return apiFetch<UserResponse>(`/users/${id}`, {
    headers: authHeaders(token),
  });
}

export async function createUser(token: string, body: CreateUserRequest) {
  return apiFetch<CreateUserResponse>("/users", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
}

export async function updateUser(
  token: string,
  id: string,
  body: UpdateUserRequest,
) {
  return apiFetch<UpdateUserResponse>(`/users/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
}

export async function deleteUser(token: string, id: string) {
  return apiFetch<null>(`/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
