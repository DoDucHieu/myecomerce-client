import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth/cookies";
import { apiFetch } from "@/lib/api/client";
import type { GetMeResponse } from "@/lib/types/api";

export async function requireAdmin(redirectTo = "/admin/users") {
  const token = await getAccessToken();

  if (!token) {
    redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  }

  try {
    const response = await apiFetch<GetMeResponse>("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.role !== "ADMIN") {
      redirect("/");
    }

    return { token, user: response.data };
  } catch {
    redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  }
}

export async function getAdminSession() {
  const token = await getAccessToken();

  if (!token) {
    return null;
  }

  try {
    const response = await apiFetch<GetMeResponse>("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.role !== "ADMIN") {
      return null;
    }

    return { token, user: response.data };
  } catch {
    return null;
  }
}
