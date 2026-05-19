import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#F1F5F7]" style={{ fontFamily: "var(--font-ibm-plex-sans), sans-serif" }}>
      <main className="flex w-full max-w-3xl flex-col items-center px-6 py-20 text-center">
        <img
          src="mampu-wordmark.webp"
          alt="Mampu Logo"
          className="mb-8 h-10"
        />

        <h1 className="text-display mb-4 text-[#0F2A3B]" style={{ fontSize: "3.5rem", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          Frontend Engineer<br />
          Take Home Test
        </h1>

        <p className="mb-2 text-[#4F6B7C]" style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
          for <span className="font-semibold text-[#0F2A3B]">Mampu</span>
        </p>

        <div className="mt-2 mb-10 flex items-center gap-2 text-sm text-[#4F6B7C]">
          <span>by</span>
          <a
            href="https://faidfadjri.space"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#0E9F8E] hover:text-[#0C8A7C] hover:underline transition-colors"
          >
            Faid Fadjri
          </a>
        </div>

        <Link
          href="/users"
          className="inline-flex items-center gap-2 bg-[#0E9F8E] text-white px-5 py-3 rounded-md font-semibold text-sm hover:bg-[#0C8A7C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0E9F8E]/40"
        >
          View Users
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </main>
    </div>
  );
}
