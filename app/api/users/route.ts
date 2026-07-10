import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";
import { proxyApiError, requireAdminApi } from "@/lib/api/admin-route";
import type { ApiResponse, PaginationResponse, UserResponse } from "@/lib/types/api";

export async function GET(req: NextRequest) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const { searchParams } = req.nextUrl;
  const page = searchParams.get("page") ?? "1";
  const size = searchParams.get("size") ?? "10";
  const search = searchParams.get("search");

  const query = new URLSearchParams({ page, size });
  if (search) {
    query.set("search", search);
  }

  const res = await fetch(`${API_BASE_URL}/users?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${auth.session.token}`,
    },
    cache: "no-store",
  });

  const payload = (await res.json()) as ApiResponse<PaginationResponse<UserResponse>>;

  if (!res.ok || !payload.success) {
    return proxyApiError(res, payload);
  }

  return NextResponse.json({
    success: true,
    message: payload.message,
    data: payload.data,
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const body = await req.json();

  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.session.token}`,
    },
    body: JSON.stringify({
      email: body.email,
      name: body.name,
      passwordHash: body.password,
    }),
  });

  const payload = (await res.json()) as ApiResponse<unknown>;

  if (!res.ok || !payload.success) {
    return proxyApiError(res, payload);
  }

  return NextResponse.json(
    {
      success: true,
      message: payload.message,
      data: payload.data,
    },
    { status: 201 },
  );
}
