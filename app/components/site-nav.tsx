import Link from "next/link";
import { getAccessToken } from "@/lib/auth/cookies";

export async function SiteNav() {
  const token = await getAccessToken();
  const isLoggedIn = Boolean(token);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
              M
            </span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              My Ecommerce
            </span>
          </Link>

          <ul className="hidden items-center gap-1 sm:flex">
            <NavLink href="/" label="Home" />
            {isLoggedIn && <NavLink href="/account" label="My Account" />}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Link
              href="/account"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Account
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
      >
        {label}
      </Link>
    </li>
  );
}
