"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthButton } from "@/app/components/auth/auth-card";

export function RefreshTokenButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRefresh() {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to refresh token");
      }

      setMessage("Session refreshed successfully.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refresh failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <AuthButton
        type="button"
        variant="secondary"
        loading={loading}
        onClick={handleRefresh}
      >
        {loading ? "Refreshing…" : "Refresh session"}
      </AuthButton>
      {message && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          {message}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
