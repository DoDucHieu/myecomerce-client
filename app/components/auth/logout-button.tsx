"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthButton } from "@/app/components/auth/auth-card";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthButton
      type="button"
      variant="secondary"
      loading={loading}
      onClick={handleLogout}
    >
      {loading ? "Signing out…" : "Sign out"}
    </AuthButton>
  );
}
