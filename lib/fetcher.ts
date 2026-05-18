import type { User, Post, Todo, UserAggregated } from "@/types";

export const fetcher = async <T = unknown>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  return res.json();
};

export async function fetchAggregatedUsers(): Promise<UserAggregated[]> {
  const [users, posts, todos] = await Promise.all([
    fetcher<User[]>("https://jsonplaceholder.typicode.com/users"),
    fetcher<Post[]>("https://jsonplaceholder.typicode.com/posts"),
    fetcher<Todo[]>("https://jsonplaceholder.typicode.com/todos"),
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

  return users.map((u) => ({
    ...u,
    totalPosts: postCounts[u.id] ?? 0,
    completedTodos: completedCounts[u.id] ?? 0,
    pendingTodos: pendingCounts[u.id] ?? 0,
  }));
}

export async function fetchUserDetail(id: number) {
  const user = await fetcher<User>(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  if (!user.id) throw new Error("User not found");

  const [posts, todos] = await Promise.all([
    fetcher<Post[]>(
      `https://jsonplaceholder.typicode.com/users/${id}/posts`
    ),
    fetcher<Todo[]>(
      `https://jsonplaceholder.typicode.com/users/${id}/todos`
    ),
  ]);

  return { user, posts, todos };
}
