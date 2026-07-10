import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { UserForm } from "../user-form";

export default async function NewUserPage() {
  await requireAdmin("/admin/users/new");

  return (
    <div className="flex flex-1 bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-lg px-4 py-10">
        <div className="mb-8">
          <Link
            href="/admin/users"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            ← Back to users
          </Link>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            Create user
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Add a new customer account to the platform.
          </p>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-950">
          <UserForm mode="create" />
        </section>
      </div>
    </div>
  );
}
