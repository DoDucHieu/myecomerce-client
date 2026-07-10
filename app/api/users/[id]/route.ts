import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";
import { proxyApiError, requireAdminApi } from "@/lib/api/admin-route";
import type { ApiResponse, UserResponse } from "@/lib/types/api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const { id } = await context.params;

  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${auth.session.token}`,
    },
    cache: "no-store",
  });

  const payload = (await res.json()) as ApiResponse<UserResponse>;

  if (!res.ok || !payload.success) {
    return proxyApiError(res, payload);
  }

  return NextResponse.json({
    success: true,
    message: payload.message,
    data: payload.data,
  });
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const { id } = await context.params;
  const body = await req.json();

  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.session.token}`,
    },
    body: JSON.stringify({
      email: body.email,
      name: body.name,
    }),
  });

  const payload = (await res.json()) as ApiResponse<unknown>;

  if (!res.ok || !payload.success) {
    return proxyApiError(res, payload);
  }

  return NextResponse.json({
    success: true,
    message: payload.message,
    data: payload.data,
  });
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const { id } = await context.params;

  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${auth.session.token}`,
    },
  });

  if (res.status === 204) {
    return NextResponse.json({ success: true, message: "User deleted" });
  }

  const payload = (await res.json().catch(() => null)) as ApiResponse<unknown> | null;

  if (!res.ok) {
    return NextResponse.json(
      {
        message: payload?.message || "Delete failed",
        code: payload?.code,
        errors: payload?.errors,
      },
      { status: res.status || 400 },
    );
  }

  return NextResponse.json({
    success: true,
    message: payload?.message || "User deleted",
  });
}
