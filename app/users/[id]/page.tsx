import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetcher } from "@/lib/fetcher";
import type { User, Post, Todo } from "@/types";
import UserDetailClient from "./UserDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

async function getUserData(id: number) {
  try {
    const user = await fetcher(
      `https://jsonplaceholder.typicode.com/users/${id}`
    ) as User | null;
    if (!user || !user.id) return null;

    const [posts, todos] = await Promise.all([
      fetcher(
        `https://jsonplaceholder.typicode.com/users/${id}/posts`
      ) as Promise<Post[]>,
      fetcher(
        `https://jsonplaceholder.typicode.com/users/${id}/todos`
      ) as Promise<Todo[]>,
    ]);

    return { user, posts, todos };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getUserData(Number(id));
  if (!data) return { title: "User Not Found" };

  return {
    title: data.user.name,
    description: `Details for ${data.user.name} — ${data.user.email}`,
    openGraph: {
      title: data.user.name,
      description: `View profile, posts (${data.posts.length}), and todos for ${data.user.name}.`,
    },
  };
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isFinite(numericId) || numericId < 1) {
    notFound();
  }

  const data = await getUserData(numericId);

  if (!data) {
    notFound();
  }

  return <UserDetailClient {...data} />;
}
