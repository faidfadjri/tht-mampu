import { Suspense } from 'react';
import ClientPostList from './ClientPostList';

interface Post {
  id: number;
  title: string;
  body: string;
}

// 1. HALAMAN UTAMA (Server Component)
export default function PostsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Demo Manajemen Data Next.js</h1>
        <p className="text-gray-500 text-sm">Menggunakan API Resmi JSONPlaceholder</p>
      </header>

      {/* Server Component dengan Streaming */}
      <section className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          1. Server Component + Async Fetch & Streaming
        </h2>
        <Suspense fallback={<TableSkeleton />}>
          <RscPostTable />
        </Suspense>
      </section>

      {/* Client Component yang sudah dipisah filenya */}
      <section className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-green-600 mb-4">
          2. Client Component + Client-side Fetching
        </h2>
        <ClientPostList />
      </section>
    </div>
  );
}

// 2. ASYNC SERVER COMPONENT
async function RscPostTable() {
  // Delay 2 detik buat simulasi loading streaming
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5', {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Gagal mengambil data dari server');
  const posts: Post[] = await res.json();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
        <thead className="bg-blue-50 text-blue-900 uppercase text-xs">
          <tr>
            <th className="p-3 border-b">ID</th>
            <th className="p-3 border-b">Judul Artikel (Dirender di Server)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50">
              <td className="p-3 font-semibold text-gray-700">{post.id}</td>
              <td className="p-3 text-gray-900 font-medium">{post.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 3. LOADING SKELETON UI (Untuk Streaming)
function TableSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-3">
      <div className="h-8 bg-gray-200 rounded w-full"></div>
      <div className="h-6 bg-gray-100 rounded w-full"></div>
      <div className="h-6 bg-gray-100 rounded w-full"></div>
      <div className="h-6 bg-gray-100 rounded w-full"></div>
    </div>
  );
}