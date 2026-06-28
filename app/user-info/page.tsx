import { cookies } from "next/headers";
import Link from "next/link";

const API_BASE_URL = "http://localhost:8080";

type UserMeResponse = {
  success: boolean;
  code: string;
  message: string;
  requestId: string;
  correlationId: string;
  data: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  errors: unknown;
  meta: {
    timestamp: string;
    path: string;
  };
};

async function fetchCurrentUser(token: string): Promise<UserMeResponse> {
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const body = await res.json();
  console.log("body:", body);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch user info (${res.status})`);
  }


  return res.json();
}

export default async function UserInfoPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  console.log("token: ", token)

  if (!token) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-zinc-950">
          <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            User Info
          </h1>
          <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
            You are not signed in. Please log in to view your profile.
          </p>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  let userResponse: UserMeResponse;

  try {
    userResponse = await fetchCurrentUser(token);
    console.log("userResponse: ", userResponse)
  } catch {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-zinc-950">
          <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            User Info
          </h1>
          <p className="mb-6 text-sm text-red-600">
            Could not load your profile. Your session may have expired.
          </p>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Sign in again
          </Link>
        </div>
      </div>
    );
  }

  const { data, message, meta } = userResponse;

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-950">
        <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          User Info
        </h1>
        <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>

        <dl className="divide-y divide-zinc-200 dark:divide-zinc-800">
          <InfoRow label="ID" value={data.id} />
          <InfoRow label="Name" value={data.name} />
          <InfoRow label="Email" value={data.email} />
          <InfoRow label="Role" value={data.role} />
        </dl>

        <p className="mt-8 text-xs text-zinc-500 dark:text-zinc-400">
          Last updated: {new Date(meta.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
        {value}
      </dd>
    </div>
  );
}
