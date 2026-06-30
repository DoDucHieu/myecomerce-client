import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";
import { setAuthCookies } from "@/lib/auth/cookies";
import type { ApiResponse, LoginResponse } from "@/lib/types/api";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, req.url),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", req.url),
    );
  }

  const res = await fetch(
    `${API_BASE_URL}/auth/oidc-callback?${new URLSearchParams({ code })}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    return NextResponse.redirect(
      new URL("/login?error=oidc_failed", req.url),
    );
  }

  const contentType = res.headers.get("Content-Type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = (await res.json()) as ApiResponse<LoginResponse>;

    if (!payload.success || !payload.data) {
      return NextResponse.redirect(
        new URL("/login?error=oidc_failed", req.url),
      );
    }

    const response = NextResponse.redirect(new URL("/account", req.url));
    setAuthCookies(
      response,
      payload.data.accessToken,
      payload.data.refreshToken,
    );
    return response;
  }

  return NextResponse.redirect(new URL("/account", req.url));
}
