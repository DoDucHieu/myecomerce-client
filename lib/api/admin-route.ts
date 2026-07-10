import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/require-admin";
import type { ApiResponse } from "@/lib/types/api";

export async function requireAdminApi() {
  const session = await getAdminSession();

  if (!session) {
    return {
      error: NextResponse.json(
        { message: "Admin access required" },
        { status: 403 },
      ),
    };
  }

  return { session };
}

export async function proxyApiError(res: Response, payload: ApiResponse<unknown>) {
  return NextResponse.json(
    {
      message: payload.message || "Request failed",
      code: payload.code,
      errors: payload.errors,
    },
    { status: res.status || 400 },
  );
}
