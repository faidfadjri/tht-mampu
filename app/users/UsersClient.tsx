"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useUsers } from "@/hooks/useUsers";
import type { UserAggregated } from "@/types";

type SortKey = "name" | "pendingTodos" | "totalPosts";

export default function UsersList() {
  const { data: users, error, isLoading } = useUsers();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [hideNoPending, setHideNoPending] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = useMemo(() => {
    if (!users) return [];
    let result = users;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    if (hideNoPending) {
      result = result.filter((u) => u.pendingTodos > 0);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "pendingTodos") cmp = a.pendingTodos - b.pendingTodos;
      else if (sortKey === "totalPosts") cmp = a.totalPosts - b.totalPosts;
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [users, search, sortKey, sortDir, hideNoPending]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  if (isLoading) {
    return <UsersSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <p className="text-lg font-medium text-red-600">Failed to load users</p>
          <p className="text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Users</h1>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 min-w-[200px] rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search users by name or email"
        />

        <button
          onClick={() => toggleSort("name")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Sort by name${sortIndicator("name")}`}
        >
          Sort Name{sortIndicator("name")}
        </button>

        <button
          onClick={() => toggleSort("pendingTodos")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Sort by pending todos${sortIndicator("pendingTodos")}`}
        >
          Sort Pending{sortIndicator("pendingTodos")}
        </button>

        <label className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm cursor-pointer hover:bg-zinc-100 focus-within:ring-2 focus-within:ring-blue-500">
          <input
            type="checkbox"
            checked={hideNoPending}
            onChange={(e) => {
              setHideNoPending(e.target.checked);
              setPage(1);
            }}
          />
          Has pending todos only
        </label>
      </div>

      {filtered.length === 0 ? (
        <div
          role="status"
          className="flex flex-col items-center justify-center py-20 text-zinc-500"
        >
          <svg
            className="mb-3 h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-lg font-medium">No users found</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 hidden md:block">
            <table className="w-full text-left text-sm" role="grid">
              <thead>
                <tr className="border-b bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <th scope="col" className="px-4 py-3 font-medium">Name</th>
                  <th scope="col" className="px-4 py-3 font-medium">Email</th>
                  <th scope="col" className="px-4 py-3 font-medium">Website</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Posts</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Completed</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Pending</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b last:border-0 hover:bg-zinc-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={`/users/${u.id}`}
                        className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      >
                        {u.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{u.email}</td>
                    <td className="px-4 py-3 text-zinc-600">{u.website}</td>
                    <td className="px-4 py-3 text-right">{u.totalPosts}</td>
                    <td className="px-4 py-3 text-right text-green-600">
                      {u.completedTodos}
                    </td>
                    <td className="px-4 py-3 text-right text-orange-600">
                      {u.pendingTodos}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 md:hidden">
            {paginated.map((u) => (
              <Link
                key={u.id}
                href={`/users/${u.id}`}
                className="block rounded-xl border border-zinc-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-blue-600">{u.name}</span>
                  <span className="text-xs text-zinc-400">{u.website}</span>
                </div>
                <p className="mb-2 text-sm text-zinc-600">{u.email}</p>
                <div className="flex gap-4 text-xs text-zinc-500">
                  <span>{u.totalPosts} posts</span>
                  <span className="text-green-600">{u.completedTodos} done</span>
                  <span className="text-orange-600">{u.pendingTodos} pending</span>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Previous page"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    n === safePage
                      ? "bg-blue-600 text-white"
                      : "border border-zinc-300 hover:bg-zinc-100"
                  }`}
                  aria-label={`Page ${n}`}
                  aria-current={n === safePage ? "page" : undefined}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function UsersSkeleton() {
  const rows = Array.from({ length: 5 }, (_, i) => i);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Users</h1>
      <div className="overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full text-left text-sm" role="grid">
          <thead>
            <tr className="border-b bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              {["Name", "Email", "Website", "Posts", "Completed", "Pending"].map(
                (h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-medium">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => (
              <tr key={i} className="border-b last:border-0">
                {Array.from({ length: 6 }, (_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 w-full max-w-24 animate-pulse rounded bg-zinc-200" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
