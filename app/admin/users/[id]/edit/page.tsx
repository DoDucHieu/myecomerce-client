import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { fetchUserById } from "@/lib/users/api";
import { UserForm } from "../../user-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: PageProps) {
  const { token } = await requireAdmin("/admin/users");
  const { id } = await params;

  let user;

  try {
    const response = await fetchUserById(token, id);
    user = response.data;
  } catch {
    notFound();
  }

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
            Edit user
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Update account details for {user.name}.
          </p>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-950">
          <UserForm
            mode="edit"
            userId={user.id}
            initialName={user.name}
            initialEmail={user.email}
          />
        </section>
      </div>
    </div>
  );
}
