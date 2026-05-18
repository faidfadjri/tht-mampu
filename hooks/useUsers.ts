import useSWR from "swr";
import type { UserAggregated } from "@/types";

export function useUsers() {
  return useSWR<UserAggregated[]>("aggregated-users", () =>
    import("@/lib/fetcher").then((m) => m.fetchAggregatedUsers())
  );
}
