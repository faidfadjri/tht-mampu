import useSWR from "swr";
import type { User, Post, Todo } from "@/types";

interface UserDetailData {
  user: User;
  posts: Post[];
  todos: Todo[];
}

export function useUserDetail(id: number) {
  return useSWR<UserDetailData>(
    id > 0 ? `user-detail-${id}` : null,
    () =>
      import("@/lib/fetcher").then((m) => m.fetchUserDetail(id)),
    { revalidateOnFocus: false }
  );
}
