import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/require-admin";
import { fetchUsers } from "@/lib/users/api";
import { UserPagination } from "./user-pagination";
import { UserSearchForm } from "./user-search-form";
import { UserTable } from "./user-table";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    size?: string;
    search?: string;
  }>;
};

const DEFAULT_SIZE = 10;

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const { token } = await requireAdmin("/admin/users");
  const params = await searchParams;

  const page = Math.max(1, Number(params.page) || 1);
  const size = Math.min(100, Math.max(1, Number(params.size) || DEFAULT_SIZE));
  const search = params.search?.trim() ?? "";

  let usersData;
  let errorMessage: string | null = null;

  try {
    const response = await fetchUsers(token, { page, size, search });
    usersData = response.data;
  } catch (err) {
    errorMessage =
      err instanceof Error ? err.message : "Failed to load users";
  }

  return (
    <div className="flex flex-1 bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600">Admin</p>
            <h1 className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
              User management
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Create, update, and remove customer accounts.
            </p>
          </div>
          <Link
            href="/admin/users/new"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Create user
          </Link>
        </div>

        <section className="rounded-2xl bg-white shadow-sm dark:bg-zinc-950">
          <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
            <Suspense fallback={null}>
              <UserSearchForm defaultSearch={search} />
            </Suspense>
          </div>

          {errorMessage ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">
                {errorMessage}
              </p>
            </div>
          ) : usersData ? (
            <>
              <UserTable users={usersData.data} />
              <UserPagination
                page={usersData.page}
                size={usersData.size}
                total={usersData.total}
                search={search}
              />
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}
