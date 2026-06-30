"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthButton,
  AuthError,
  AuthInput,
} from "@/app/components/auth/auth-card";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const detail =
          data.errors?.map((e: { message: string }) => e.message).join(". ") ||
          data.message;
        throw new Error(detail || "Registration failed");
      }

      router.push("/login?registered=1");
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
      <AuthInput
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={setPassword}
        hint="At least 6 characters"
      />
      {error && <AuthError message={error} />}
      <AuthButton loading={loading}>
        {loading ? "Creating account…" : "Create account"}
      </AuthButton>
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
