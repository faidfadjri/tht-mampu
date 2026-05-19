"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Lottie from "lottie-react";
import { useUsers } from "@/hooks/useUsers";
import UsersSkeleton from "./UsersSkeleton";
import emptyAnim from "@/public/animations/empty-ghost.json";

type SortKey = "name" | "pendingTodos" | "totalPosts";

function useQueryState() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getQuery = useCallback((): {
    q: string;
    sort: SortKey;
    dir: "asc" | "desc";
    hide: boolean;
    page: number;
  } => ({
    q: searchParams.get("q") ?? "",
    sort: (searchParams.get("sort") as SortKey) ?? "name",
    dir: (searchParams.get("dir") as "asc" | "desc") ?? "asc",
    hide: searchParams.get("hide") === "1",
    page: Math.max(1, Number(searchParams.get("page")) || 1),
  }), [searchParams]);

  const setQuery = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === "" || value === "asc" || value === "0" || value === "name") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.replace(qs ? `/users?${qs}` : "/users", { scroll: false });
    },
    [router, searchParams]
  );

  return { getQuery, setQuery };
}

export default function UsersList() {
  const { data: users, error, isLoading } = useUsers();
  const { getQuery, setQuery } = useQueryState();

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [hideNoPending, setHideNoPending] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [displayCount, setDisplayCount] = useState(5);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const initialCountRef = useRef(5);
  const BATCH_SIZE = 5;
  const CARD_HEIGHT = 130;

  const synced = useRef(false);

  useEffect(() => {
    if (synced.current) return;
    synced.current = true;
    const q = getQuery();
    setSearch(q.q);
    setSortKey(q.sort);
    setSortDir(q.dir);
    setHideNoPending(q.hide);
    setPage(q.page);
  }, [getQuery]);

  const syncTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const syncQuery = useCallback(
    (overrides: Partial<{ q: string; sort: SortKey; dir: "asc" | "desc"; hide: boolean; page: number }>) => {
      clearTimeout(syncTimer.current);
      syncTimer.current = setTimeout(() => {
        const q = getQuery();
        setQuery({
          q: overrides.q ?? q.q,
          sort: overrides.sort ?? q.sort,
          dir: overrides.dir ?? q.dir,
          hide: overrides.hide !== undefined ? (overrides.hide ? "1" : "0") : (q.hide ? "1" : "0"),
          page: String(overrides.page ?? q.page),
        });
      }, 300);
    },
    [getQuery, setQuery]
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    setDisplayCount(initialCountRef.current);
    syncQuery({ q: value, page: 1 });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      const newDir = sortDir === "asc" ? "desc" : "asc";
      setSortDir(newDir);
      syncQuery({ dir: newDir, sort: key, page: 1 });
    } else {
      setSortKey(key);
      setSortDir("asc");
      syncQuery({ sort: key, dir: "asc", page: 1 });
    }
    setPage(1);
    setDisplayCount(initialCountRef.current);
  };

  const handleHideToggle = (checked: boolean) => {
    setHideNoPending(checked);
    setPage(1);
    setDisplayCount(initialCountRef.current);
    syncQuery({ hide: checked, page: 1 });
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    syncQuery({ page: p });
  };

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
    handleSort(key);
  };

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  useEffect(() => {
    const available = window.innerHeight - 220;
    const count = Math.max(BATCH_SIZE, Math.min(10, Math.ceil(available / CARD_HEIGHT)));
    initialCountRef.current = count;
    setDisplayCount(count);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDisplayCount((prev) => {
            if (prev >= filtered.length) return prev;
            return Math.min(prev + BATCH_SIZE, filtered.length);
          });
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length]);

  if (isLoading) {
    return <UsersSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 bg-[#0E9F8E] text-white px-5 py-3 rounded-md font-semibold text-sm hover:bg-[#0C8A7C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0E9F8E]/40"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="flex flex-col items-center justify-center py-20 text-[#4F6B7C]">
          <p className="text-lg font-medium text-red-600">Failed to load users</p>
          <p className="text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 w-full">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 bg-[#0E9F8E] text-white px-5 py-3 rounded-md font-semibold text-sm hover:bg-[#0C8A7C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0E9F8E]/40"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      <h1 className="mb-6 text-3xl font-bold text-[#0F2A3B]" style={{ fontSize: "2rem", fontWeight: 600 }}>Users</h1>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-md border border-[#D0D7DE] bg-white px-4 py-2.5 text-sm text-[#0F2A3B] placeholder-[#4F6B7C] focus:outline-none focus:ring-2 focus:ring-[#0E9F8E]/40 focus:border-[#0E9F8E]"
          aria-label="Search users by name or email"
        />

        <button
          onClick={() => toggleSort("name")}
          className="rounded-md border border-[#D0D7DE] px-4 py-2.5 text-sm font-medium text-[#4F6B7C] hover:bg-[#F1F5F7] focus:outline-none focus:ring-2 focus:ring-[#0E9F8E]/40 transition-colors"
          aria-label={`Sort by name${sortIndicator("name")}`}
        >
          Sort Name{sortIndicator("name")}
        </button>

        <button
          onClick={() => toggleSort("pendingTodos")}
          className="rounded-md border border-[#D0D7DE] px-4 py-2.5 text-sm font-medium text-[#4F6B7C] hover:bg-[#F1F5F7] focus:outline-none focus:ring-2 focus:ring-[#0E9F8E]/40 transition-colors"
          aria-label={`Sort by pending todos${sortIndicator("pendingTodos")}`}
        >
          Sort Pending{sortIndicator("pendingTodos")}
        </button>

        <label className="flex items-center gap-2 rounded-md border border-[#D0D7DE] px-4 py-2.5 text-sm font-medium text-[#4F6B7C] cursor-pointer hover:bg-[#F1F5F7] focus-within:ring-2 focus-within:ring-[#0E9F8E]/40 transition-colors">
          <input
            type="checkbox"
            checked={hideNoPending}
            onChange={(e) => handleHideToggle(e.target.checked)}
            className="accent-[#0E9F8E]"
          />
          Has pending todos only
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm border border-[#E0E6EA] hidden md:block w-full">
        {filtered.length === 0 ? (
          <div
            role="status"
            className="flex w-full flex-col items-center justify-center py-16 text-[#4F6B7C]"
          >
            <Lottie animationData={emptyAnim} loop style={{ height: 200, width: 200 }} />
            <p className="mt-2 text-lg font-medium text-[#0F2A3B]">No users found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <table className="w-full table-fixed text-left text-sm" role="grid">
            <colgroup>
              <col style={{ width: "26%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-[#E0E6EA] bg-[#F1F5F7] text-xs uppercase tracking-wide text-[#4F6B7C]" style={{ fontFamily: "var(--font-ibm-plex-mono), monospace", letterSpacing: "0.04em" }}>
                <th scope="col" className="px-5 py-3.5 font-semibold">Name</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Email</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Website</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-right">Posts</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-right">Completed</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-right">Pending</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-[#E0E6EA] last:border-0 hover:bg-[#F1F5F7] transition-colors"
                >
                  <td className="px-5 py-3.5 max-w-0">
                    <Link
                      href={`/users/${u.id}`}
                      className="block truncate text-[#0E9F8E] hover:text-[#0C8A7C] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0E9F8E]/40 rounded font-semibold"
                    >
                      {u.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-[#4F6B7C] truncate max-w-0">{u.email}</td>
                  <td className="px-5 py-3.5 text-[#4F6B7C] truncate max-w-0">{u.website}</td>
                  <td className="px-5 py-3.5 text-right text-[#0F2A3B] font-semibold">
                    {u.totalPosts}
                  </td>
                  <td className="px-5 py-3.5 text-right text-[#0E9F8E] font-semibold">
                    {u.completedTodos}
                  </td>
                  <td className="px-5 py-3.5 text-right text-[#C44536] font-semibold">
                    {u.pendingTodos}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center py-16 text-[#4F6B7C] md:hidden">
          <Lottie animationData={emptyAnim} loop style={{ height: 200, width: 200 }} />
          <p className="mt-2 text-lg font-medium text-[#0F2A3B]">No users found</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {filtered.slice(0, displayCount).map((u) => (
              <Link
                key={u.id}
                href={`/users/${u.id}`}
                className="block rounded-lg border border-[#E0E6EA] p-6 shadow-sm hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0E9F8E]/40"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-[#0E9F8E]">{u.name}</span>
                  <span className="text-xs text-[#4F6B7C]">{u.website}</span>
                </div>
                <p className="mb-2 text-sm text-[#4F6B7C]">{u.email}</p>
                <div className="flex gap-4 text-xs">
                  <span className="font-semibold text-[#0F2A3B]">{u.totalPosts} posts</span>
                  <span className="font-semibold text-[#0E9F8E]">{u.completedTodos} done</span>
                  <span className="font-semibold text-[#C44536]">{u.pendingTodos} pending</span>
                </div>
              </Link>
            ))}
          </div>

          {displayCount < filtered.length && (
            <div ref={sentinelRef} className="flex justify-center py-6 md:hidden">
              <svg className="h-8 w-8 animate-spin text-[#0E9F8E]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 hidden items-center justify-center gap-2 md:flex">
              <button
                onClick={() => handlePageChange(Math.max(1, safePage - 1))}
                disabled={safePage <= 1}
                className="rounded-md border border-[#D0D7DE] px-4 py-2 text-sm font-medium text-[#4F6B7C] disabled:opacity-40 hover:bg-[#F1F5F7] focus:outline-none focus:ring-2 focus:ring-[#0E9F8E]/40 transition-colors"
                aria-label="Previous page"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => handlePageChange(n)}
                  className={`rounded-md px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0E9F8E]/40 transition-colors ${n === safePage
                    ? "bg-[#0E9F8E] text-white hover:bg-[#0C8A7C]"
                    : "border border-[#D0D7DE] text-[#4F6B7C] hover:bg-[#F1F5F7]"
                    }`}
                  aria-label={`Page ${n}`}
                  aria-current={n === safePage ? "page" : undefined}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, safePage + 1))}
                disabled={safePage >= totalPages}
                className="rounded-md border border-[#D0D7DE] px-4 py-2 text-sm font-medium text-[#4F6B7C] disabled:opacity-40 hover:bg-[#F1F5F7] focus:outline-none focus:ring-2 focus:ring-[#0E9F8E]/40 transition-colors"
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
