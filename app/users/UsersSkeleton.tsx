import Link from "next/link";

export function SkeletonCard() {
  return (
    <div className="block rounded-lg border border-[#E0E6EA] p-6 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="h-5 w-full max-w-[60%] animate-pulse rounded bg-[#E0E6EA]" />
        <div className="ml-4 h-4 w-[25%] animate-pulse rounded bg-[#E0E6EA]" />
      </div>
      <div className="mb-2 h-4 w-3/5 animate-pulse rounded bg-[#E0E6EA]" />
      <div className="flex gap-4">
        <div className="h-4 w-16 animate-pulse rounded bg-[#E0E6EA]" />
        <div className="h-4 w-16 animate-pulse rounded bg-[#E0E6EA]" />
        <div className="h-4 w-20 animate-pulse rounded bg-[#E0E6EA]" />
      </div>
    </div>
  );
}

export default function UsersSkeleton() {
  const rows = Array.from({ length: 5 }, (_, i) => i);
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

      <h1 className="mb-6 text-3xl font-bold text-[#0F2A3B]" style={{ fontSize: "2rem", fontWeight: 600 }}>Users</h1>

      <div className="overflow-x-auto rounded-lg shadow-sm border border-[#E0E6EA] hidden md:block">
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
            {rows.map((i) => (
              <tr key={i} className="border-b border-[#E0E6EA] last:border-0">
                <td className="px-5 py-3.5">
                  <div className="h-4 w-full animate-pulse rounded bg-[#E0E6EA]" />
                </td>
                <td className="px-5 py-3.5">
                  <div className="h-4 w-full animate-pulse rounded bg-[#E0E6EA]" />
                </td>
                <td className="px-5 py-3.5">
                  <div className="h-4 w-full animate-pulse rounded bg-[#E0E6EA]" />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="ml-auto h-4 w-8 animate-pulse rounded bg-[#E0E6EA]" />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="ml-auto h-4 w-8 animate-pulse rounded bg-[#E0E6EA]" />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="ml-auto h-4 w-8 animate-pulse rounded bg-[#E0E6EA]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {rows.map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
