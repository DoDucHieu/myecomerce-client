import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";
import { setAuthCookies } from "@/lib/auth/cookies";
import type { ApiResponse, RegisterResponse } from "@/lib/types/api";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email,
      name: body.name,
      password: body.password,
    }),
  });

  const payload = (await res.json()) as ApiResponse<RegisterResponse>;

  if (!res.ok || !payload.success) {
    return NextResponse.json(
      {
        message: payload.message || "Registration failed",
        code: payload.code,
        errors: payload.errors,
      },
      { status: res.status || 400 },
    );
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
