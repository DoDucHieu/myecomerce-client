import { LoginForm } from "./login-form";

const KEYCLOAK_AUTH_URL =
  "http://localhost:9090/realms/myrealm/protocol/openid-connect/auth" +
  "?client_id=myclient" +
  "&redirect_uri=" +
  encodeURIComponent("http://localhost:3000") +
  "&response_type=code" +
  "&scope=openid";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-950">
        <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Sign in
        </h1>
        <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          Choose how you want to log in
        </p>

        <section className="mb-8">
          <h2 className="mb-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Option 1 — Email &amp; password
          </h2>
          <LoginForm />
        </section>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
              or
            </span>
          </div>
        </div>

        <section>
          <h2 className="mb-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Option 2 — Keycloak
          </h2>
          <a
            href={KEYCLOAK_AUTH_URL}
            className="flex h-12 w-full items-center justify-center rounded-lg border border-zinc-300 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Continue with Keycloak
          </a>
        </section>
      </div>
    </div>
  );
}
