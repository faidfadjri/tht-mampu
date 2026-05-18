import type { Metadata } from "next";
import { fetcher } from "@/lib/fetcher";
import type { User } from "@/types";
import UserDetailClient from "./UserDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId) || numericId < 1) return { title: "User Not Found" };

  try {
    const user = await fetcher<User>(
      `https://jsonplaceholder.typicode.com/users/${numericId}`
    );
    if (!user.id) return { title: "User Not Found" };

    return {
      title: user.name,
      description: `Details for ${user.name} — ${user.email}`,
      openGraph: {
        title: user.name,
        description: `View profile, posts, and todos for ${user.name}.`,
      },
    };
  } catch {
    return { title: "User Not Found" };
  }
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;

  return <UserDetailClient id={id} />;
}
