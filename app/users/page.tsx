import Link from "next/link";
import { fetcher } from "@/lib/fetcher";
import type { User, Post, Todo, UserAggregated } from "@/types";
import UsersClient from "./UsersClient";

export const revalidate = 60;

async function getData(): Promise<{
  users: UserAggregated[];
}> {
  const [users, posts, todos] = await Promise.all([
    fetcher("https://jsonplaceholder.typicode.com/users") as Promise<User[]>,
    fetcher("https://jsonplaceholder.typicode.com/posts") as Promise<Post[]>,
    fetcher("https://jsonplaceholder.typicode.com/todos") as Promise<Todo[]>,
  ]);

  const postCounts = posts.reduce<Record<number, number>>((acc, p) => {
    acc[p.userId] = (acc[p.userId] ?? 0) + 1;
    return acc;
  }, {});

  const completedCounts = todos.reduce<Record<number, number>>((acc, t) => {
    if (t.completed) acc[t.userId] = (acc[t.userId] ?? 0) + 1;
    return acc;
  }, {});

  const pendingCounts = todos.reduce<Record<number, number>>((acc, t) => {
    if (!t.completed) acc[t.userId] = (acc[t.userId] ?? 0) + 1;
    return acc;
  }, {});

  const aggregated: UserAggregated[] = users.map((u) => ({
    ...u,
    totalPosts: postCounts[u.id] ?? 0,
    completedTodos: completedCounts[u.id] ?? 0,
    pendingTodos: pendingCounts[u.id] ?? 0,
  }));

  return { users: aggregated };
}

export default async function UsersPage() {
  const { users } = await getData();

  return <UsersClient users={users} />;
}
