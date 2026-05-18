"use client";

import Link from "next/link";
import { useState } from "react";
import type { User, Post, Todo } from "@/types";

interface Props {
  user: User;
  posts: Post[];
  todos: Todo[];
}

export default function UserDetailClient({ user, posts, todos }: Props) {
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showAllTodos, setShowAllTodos] = useState(false);

  const displayedPosts = showAllPosts ? posts : posts.slice(0, 5);
  const displayedTodos = showAllTodos ? todos : todos.slice(0, 5);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/users"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to list
      </Link>

      <div className="rounded-xl border border-zinc-200 p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">{user.name}</h1>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <InfoItem label="Username" value={user.username} />
          <InfoItem label="Email" value={user.email} />
          <InfoItem label="Phone" value={user.phone} />
          <InfoItem label="Website" value={user.website} />
        </div>

        <h2 className="mb-3 text-lg font-semibold">Company</h2>
        <div className="mb-6 grid gap-4 sm:grid-cols-2 rounded-lg bg-zinc-50 p-4">
          <InfoItem label="Name" value={user.company.name} />
          <InfoItem label="Catchphrase" value={user.company.catchPhrase} />
        </div>

        <h2 className="mb-3 text-lg font-semibold">Address</h2>
        <div className="grid gap-4 sm:grid-cols-2 rounded-lg bg-zinc-50 p-4">
          <InfoItem label="Street" value={user.address.street} />
          <InfoItem label="Suite" value={user.address.suite} />
          <InfoItem label="City" value={user.address.city} />
          <InfoItem label="Zipcode" value={user.address.zipcode} />
        </div>
      </div>

      <section className="mt-8 rounded-xl border border-zinc-200 p-6 shadow-sm" aria-labelledby="posts-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="posts-heading" className="text-lg font-semibold">
            Posts ({posts.length})
          </h2>
          {posts.length > 5 && (
            <button
              onClick={() => setShowAllPosts((v) => !v)}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              {showAllPosts ? "Show less" : "Show all"}
            </button>
          )}
        </div>
        <ul className="space-y-3">
          {displayedPosts.map((p) => (
            <li key={p.id} className="rounded-lg border border-zinc-100 p-3">
              <h3 className="font-medium capitalize">{p.title}</h3>
              <p className="mt-1 text-sm text-zinc-600">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-xl border border-zinc-200 p-6 shadow-sm" aria-labelledby="todos-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="todos-heading" className="text-lg font-semibold">
            Todos ({todos.length})
          </h2>
          {todos.length > 5 && (
            <button
              onClick={() => setShowAllTodos((v) => !v)}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              {showAllTodos ? "Show less" : "Show all"}
            </button>
          )}
        </div>
        <ul className="space-y-2">
          {displayedTodos.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3"
            >
              <span
                className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                  t.completed
                    ? "border-green-500 bg-green-50 text-green-600"
                    : "border-orange-300 bg-orange-50 text-orange-500"
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
              <span className={t.completed ? "text-zinc-500 line-through" : "text-zinc-800"}>
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
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-zinc-800">{value}</dd>
    </div>
  );
}
