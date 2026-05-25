'use client';

import { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function ClientPostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ambil data langsung dari browser saat komponen muncul (mounted)
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data di client');
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (error) return <p className="text-red-500 text-sm">Error: {error}</p>;
  if (isLoading) return <p className="text-gray-500 text-sm animate-pulse">Memuat data di browser client...</p>;

  return (
    <ul className="space-y-3">
      {posts.map((post) => (
        <li key={post.id} className="p-3 bg-green-50 border border-green-200 rounded-md">
          <span className="inline-block bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded mr-2">
            ID: {post.id}
          </span>
          <span className="text-gray-800 font-medium">{post.title}</span>
          <p className="text-gray-500 text-xs mt-1 italic">{post.body.substring(0, 60)}...</p>
        </li>
      ))}
    </ul>
  );
}