"use client";

import { useSearchParams } from "next/navigation";
import { AuthError } from "@/app/components/auth/auth-card";

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: "Authentication was cancelled or incomplete.",
  oidc_failed: "Keycloak sign-in failed. Please try again.",
  access_denied: "Access was denied by the identity provider.",
};

export function LoginAlerts() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const registered = searchParams.get("registered");

  if (!error && !registered) return null;

  return (
    <div className="mb-6 flex flex-col gap-3">
      {registered && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
          Account created. Sign in to start shopping.
        </div>
      )}
      {error && (
        <AuthError
          message={ERROR_MESSAGES[error] ?? `Sign-in error: ${error}`}
        />
      )}
    </div>
  );
}
