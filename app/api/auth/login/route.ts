import { NextRequest, NextResponse } from "next/server";

function extractToken(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;

  const record = payload as Record<string, unknown>;
  if (typeof record.token === "string") return record.token;

  const data = record.data;
  if (data && typeof data === "object") {
    const token = (data as Record<string, unknown>).token;
    if (typeof token === "string") return token;
  }

  return undefined;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
    }),
  });

  const contentType = res.headers.get("Content-Type") ?? "application/json";
  const data = await res.text();

  const response = new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": contentType },
  });

  if (res.ok) {
    try {
      const payload = JSON.parse(data);
      const token = extractToken(payload);

      if (token) {
        response.cookies.set("token", token, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    } catch {
      // Keep original response if body is not JSON.
    }
  }

  return response;
}
