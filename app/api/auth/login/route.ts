import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";
import { setAuthCookies } from "@/lib/auth/cookies";
import type { ApiResponse, LoginResponse } from "@/lib/types/api";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
    }),
  });

  const payload = (await res.json()) as ApiResponse<LoginResponse>;

  if (!res.ok || !payload.success || !payload.data) {
    return NextResponse.json(
      {
        message: payload.message || "Login failed",
        code: payload.code,
        errors: payload.errors,
      },
      { status: res.status || 401 },
    );
  }

  const response = NextResponse.json({
    success: true,
    message: payload.message,
  });

  setAuthCookies(
    response,
    payload.data.accessToken,
    payload.data.refreshToken,
  );

  return response;
}
