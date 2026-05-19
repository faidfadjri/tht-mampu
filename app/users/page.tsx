import { Suspense } from "react";
import UsersClient from "./UsersClient";
import UsersSkeleton from "./UsersSkeleton";

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersSkeleton />}>
      <UsersClient />
    </Suspense>
  );
}
