"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserDetail } from "@/hooks/useUserDetail";

interface Props {
  id: string;
}

export default function UserDetailClient({ id }: Props) {
  const numericId = Number(id);
  const { data, error, isLoading } = useUserDetail(numericId);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showAllTodos, setShowAllTodos] = useState(false);
  const router = useRouter();

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/users");
    }
  }, [router]);

  if (!Number.isFinite(numericId) || numericId < 1) {
    return <NotFoundState />;
  }

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20 text-[#4F6B7C]">
          <p className="text-lg font-medium text-red-600">Failed to load user</p>
          <p className="text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }

  const { user, posts, todos } = data;
  const displayedPosts = showAllPosts ? posts : posts.slice(0, 5);
  const displayedTodos = showAllTodos ? todos : todos.slice(0, 5);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button
        onClick={goBack}
        className="mb-6 inline-flex items-center gap-2 bg-[#0E9F8E] text-white px-5 py-3 rounded-md font-semibold text-sm hover:bg-[#0C8A7C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0E9F8E]/40"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to list
      </button>

      <div className="rounded-lg border border-[#E0E6EA] p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-[#0F2A3B]" style={{ fontSize: "2rem", fontWeight: 600 }}>{user.name}</h1>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <InfoItem label="Username" value={user.username} />
          <InfoItem label="Email" value={user.email} />
          <InfoItem label="Phone" value={user.phone} />
          <InfoItem label="Website" value={user.website} />
        </div>

        <h2 className="mb-3 text-lg font-semibold text-[#0F2A3B]">Company</h2>
        <div className="mb-6 grid gap-4 sm:grid-cols-2 rounded-lg bg-[#F1F5F7] p-4">
          <InfoItem label="Name" value={user.company.name} />
          <InfoItem label="Catchphrase" value={user.company.catchPhrase} />
        </div>

        <h2 className="mb-3 text-lg font-semibold text-[#0F2A3B]">Address</h2>
        <div className="grid gap-4 sm:grid-cols-2 rounded-lg bg-[#F1F5F7] p-4">
          <InfoItem label="Street" value={user.address.street} />
          <InfoItem label="Suite" value={user.address.suite} />
          <InfoItem label="City" value={user.address.city} />
          <InfoItem label="Zipcode" value={user.address.zipcode} />
        </div>
      </div>

      <section className="mt-8 rounded-lg border border-[#E0E6EA] p-6 shadow-sm" aria-labelledby="posts-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="posts-heading" className="text-lg font-semibold text-[#0F2A3B]">
            Posts ({posts.length})
          </h2>
          {posts.length > 5 && (
            <button
              onClick={() => setShowAllPosts((v) => !v)}
              className="text-sm text-[#0E9F8E] hover:text-[#0C8A7C] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0E9F8E]/40 rounded transition-colors"
            >
              {showAllPosts ? "Show less" : "Show all"}
            </button>
          )}
        </div>
        <ul className="space-y-3">
          {displayedPosts.map((p) => (
            <li key={p.id} className="rounded-lg border border-[#E0E6EA] p-3">
              <h3 className="font-medium text-[#0F2A3B] capitalize">{p.title}</h3>
              <p className="mt-1 text-sm text-[#4F6B7C]">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-lg border border-[#E0E6EA] p-6 shadow-sm" aria-labelledby="todos-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="todos-heading" className="text-lg font-semibold text-[#0F2A3B]">
            Todos ({todos.length})
          </h2>
          {todos.length > 5 && (
            <button
              onClick={() => setShowAllTodos((v) => !v)}
              className="text-sm text-[#0E9F8E] hover:text-[#0C8A7C] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0E9F8E]/40 rounded transition-colors"
            >
              {showAllTodos ? "Show less" : "Show all"}
            </button>
          )}
        </div>
        <ul className="space-y-2">
          {displayedTodos.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 rounded-lg border border-[#E0E6EA] p-3"
            >
              <span
                className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center ${t.completed
                    ? "border-[#0E9F8E] bg-[#E8F8F5] text-[#0E9F8E]"
                    : "border-[#C44536] bg-[#FDF0EE] text-[#C44536]"
                  }`}
                aria-label={t.completed ? "Completed" : "Pending"}
              >
                {t.completed ? (
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  </svg>
                )}
              </span>
              <span className={t.completed ? "text-[#4F6B7C] line-through" : "text-[#0F2A3B]"}>
                {t.title}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-[#4F6B7C]" style={{ fontFamily: "var(--font-ibm-plex-mono), monospace", letterSpacing: "0.04em" }}>
        {label}
      </dt>
      <dd className="mt-0.5 text-[#0F2A3B]">{value}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 inline-flex h-11 w-[130px] animate-pulse items-center gap-2 rounded-md bg-[#E0E6EA]" />
      <div className="rounded-lg border border-[#E0E6EA] p-6 shadow-sm">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-[#E0E6EA]" />
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>
              <div className="mb-1 h-3 w-20 animate-pulse rounded bg-[#E0E6EA]" />
              <div className="h-5 w-32 animate-pulse rounded bg-[#E0E6EA]" />
            </div>
          ))}
        </div>
        <div className="mb-6 h-6 w-24 animate-pulse rounded bg-[#E0E6EA]" />
        <div className="mb-6 grid gap-4 sm:grid-cols-2 rounded-lg bg-[#F1F5F7] p-4">
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i}>
              <div className="mb-1 h-3 w-20 animate-pulse rounded bg-[#E0E6EA]" />
              <div className="h-5 w-36 animate-pulse rounded bg-[#E0E6EA]" />
            </div>
          ))}
        </div>
        <div className="mb-6 h-6 w-24 animate-pulse rounded bg-[#E0E6EA]" />
        <div className="grid gap-4 sm:grid-cols-2 rounded-lg bg-[#F1F5F7] p-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>
              <div className="mb-1 h-3 w-20 animate-pulse rounded bg-[#E0E6EA]" />
              <div className="h-5 w-32 animate-pulse rounded bg-[#E0E6EA]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex flex-col items-center justify-center py-20 text-[#4F6B7C]">
        <p className="text-lg font-medium text-red-600">User not found</p>
        <p className="text-sm">The requested user does not exist.</p>
      </div>
    </div>
  );
}
