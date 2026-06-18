import { NextRequest, NextResponse } from "next/server";

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

  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": contentType },
  });
}
