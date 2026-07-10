import Link from "next/link";

type PaginationProps = {
  page: number;
  size: number;
  total: number;
  search?: string;
};

export function UserPagination({ page, size, total, search }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / size));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  function buildHref(targetPage: number) {
    const params = new URLSearchParams({
      page: String(targetPage),
      size: String(size),
    });

    if (search?.trim()) {
      params.set("search", search.trim());
    }

    return `/admin/users?${params.toString()}`;
  }

  const from = total === 0 ? 0 : (page - 1) * size + 1;
  const to = Math.min(page * size, total);

  return (
    <div className="flex flex-col gap-4 border-t border-zinc-200 px-6 py-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Showing {from}–{to} of {total} users
      </p>
      <div className="flex items-center gap-2">
        <PaginationLink href={buildHref(page - 1)} disabled={!hasPrev} label="Previous" />
        <span className="px-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Page {page} of {totalPages}
        </span>
        <PaginationLink href={buildHref(page + 1)} disabled={!hasNext} label="Next" />
      </div>
    </div>
  );
}

function PaginationLink({
  href,
  disabled,
  label,
}: {
  href: string;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="inline-flex h-9 items-center rounded-lg border border-zinc-200 px-3 text-sm text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center rounded-lg border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
    >
      {label}
    </Link>
  );
}
