import { Suspense } from "react";
import { AuthCard, AuthDivider } from "@/app/components/auth/auth-card";
import { LoginForm } from "./login-form";
import { getKeycloakLoginUrl } from "@/lib/config";
import { LoginAlerts } from "./login-alerts";

export default function LoginPage() {
  const keycloakUrl = getKeycloakLoginUrl();
  console.log("keycloakUrl", keycloakUrl);
  
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to manage orders, track deliveries, and update your profile"
    >
      <Suspense fallback={null}>
        <LoginAlerts />
      </Suspense>

      <section className="mb-2">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Email &amp; password
        </h2>
        <LoginForm />
      </section>

      <AuthDivider />

      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Single sign-on
        </h2>
        <a
          href={keycloakUrl}
          className="flex h-11 w-full items-center justify-center rounded-lg border border-zinc-300 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Continue with Keycloak
        </a>
      </section>
    </AuthCard>
  );
}
