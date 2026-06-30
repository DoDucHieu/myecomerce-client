import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  clearAuthCookies,
  setAuthCookies,
} from "@/lib/auth/cookies";
import type { ApiResponse, RefreshTokenResponse } from "@/lib/types/api";

export async function POST(req: NextRequest) {
  let refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    try {
      const body = await req.json();
      if (typeof body.refreshToken === "string") {
        refreshToken = body.refreshToken;
      }
    } catch {
      // Body is optional when cookie is set.
    }
  }

  if (!refreshToken) {
    const response = NextResponse.json(
      { message: "No refresh token found" },
      { status: 401 },
    );
    clearAuthCookies(response);
    return response;
  }

  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const payload = (await res.json()) as ApiResponse<RefreshTokenResponse>;

  if (!res.ok || !payload.success || !payload.data) {
    const response = NextResponse.json(
      { message: payload.message || "Token refresh failed" },
      { status: res.status || 401 },
    );
    clearAuthCookies(response);
    return response;
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
