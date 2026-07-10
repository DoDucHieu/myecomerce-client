"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthButton,
  AuthError,
  AuthInput,
} from "@/app/components/auth/auth-card";

type UserFormProps = {
  mode: "create" | "edit";
  userId?: string;
  initialName?: string;
  initialEmail?: string;
};

export function UserForm({
  mode,
  userId,
  initialName = "",
  initialEmail = "",
}: UserFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url =
        mode === "create" ? "/api/users" : `/api/users/${userId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const body =
        mode === "create"
          ? { name, email, password }
          : { name, email };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        const detail =
          data.errors?.map((e: { message: string }) => e.message).join(". ") ||
          data.message;
        throw new Error(detail || "Request failed");
      }

      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <AuthInput
        id="name"
        label="Full name"
        autoComplete="name"
        required
        value={name}
        onChange={setName}
      />
      <AuthInput
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={setEmail}
      />
      {mode === "create" && (
        <AuthInput
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={setPassword}
          hint="At least 8 characters with uppercase, lowercase, number, and special character"
        />
      )}
      {error && <AuthError message={error} />}
      <div className="flex flex-col gap-3 sm:flex-row">
        <AuthButton loading={loading}>
          {loading
            ? mode === "create"
              ? "Creating…"
              : "Saving…"
            : mode === "create"
              ? "Create user"
              : "Save changes"}
        </AuthButton>
        <Link
          href="/admin/users"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-300 px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
