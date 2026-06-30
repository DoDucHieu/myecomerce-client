import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth/cookies";
import { apiFetch } from "@/lib/api/client";
import type { GetMeResponse } from "@/lib/types/api";
import { LogoutButton } from "@/app/components/auth/logout-button";
import { RefreshTokenButton } from "@/app/components/auth/refresh-token-button";

async function fetchCurrentUser(token: string) {
  return apiFetch<GetMeResponse>("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export default async function AccountPage() {
  const token = await getAccessToken();

  if (!token) {
    redirect("/login");
  }

  let userResponse;

  try {
    userResponse = await fetchCurrentUser(token);
  } catch {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-zinc-950">
          <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Session expired
          </h1>
          <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
            We couldn&apos;t load your account. Try refreshing your session or
            sign in again.
          </p>
          <div className="flex flex-col gap-3">
            <RefreshTokenButton />
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Sign in again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { data, message, meta } = userResponse;

  return (
    <div className="flex flex-1 bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-emerald-600">My Account</p>
          <h1 className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            Hello, {data.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">{message}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-950 lg:col-span-2">
            <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Profile details
            </h2>
            <dl className="divide-y divide-zinc-200 dark:divide-zinc-800">
              <InfoRow label="Customer ID" value={data.id} mono />
              <InfoRow label="Full name" value={data.name} />
              <InfoRow label="Email" value={data.email} />
              <InfoRow
                label="Role"
                value={data.role}
                badge={data.role === "ADMIN" ? "admin" : "customer"}
              />
            </dl>
            <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
              Last synced: {new Date(meta.timestamp).toLocaleString()}
            </p>
          </section>

          <aside className="flex flex-col gap-4">
            <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-950">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Quick actions
              </h2>
              <div className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-300 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  Continue shopping
                </Link>
                <RefreshTokenButton />
                <LogoutButton />
              </div>
            </section>

            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
              <h3 className="font-medium text-emerald-900 dark:text-emerald-200">
                Order tracking
              </h3>
              <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-300">
                Your order history and saved addresses will appear here as
                catalog features are connected.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
  badge,
}: {
  label: string;
  value: string;
  mono?: boolean;
  badge?: "admin" | "customer";
}) {
  return (
    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="flex items-center gap-2">
        {badge && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              badge === "admin"
                ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {badge === "admin" ? "Admin" : "Customer"}
          </span>
        )}
        <span
          className={`text-sm font-medium text-zinc-900 dark:text-zinc-50 ${
            mono ? "font-mono text-xs" : ""
          }`}
        >
          {value}
        </span>
      </dd>
    </div>
  );
}
