'use client'; // WAJIB di baris paling atas karena kita pakai Hooks dan SWR

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useState } from 'react';

// ==========================================
// 1. DEFINISI TYPE DATA & FETCHER
// ==========================================
interface Post {
  id: number;
  title: string;
  body: string;
}

const ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';

// Fetcher standar untuk GET data (useSWR)
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Fetcher khusus untuk POST data (useSWRMutation)
// arg berisi data tambahan yang kita kirim saat fungsi ini dipicu (trigger)
async function sendPostRequest(url: string, { arg }: { arg: { title: string; body: string } }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  });
  
  if (!res.ok) throw new Error('Gagal mengirim data ke server');
  return res.json();
}

// ==========================================
// 2. KOMPONEN UTAMA
// ==========================================
export default function PostsCrudPage() {
  const [inputTitle, setInputTitle] = useState('');

  // ----------------------------------------------------
  // A. useSWR (Membaca / Ambil Data)
  // ----------------------------------------------------
  // Kita batasi _limit=5 agar list-nya tidak terlalu panjang di layar
  const { data: posts, error, isLoading, mutate } = useSWR<Post[]>(
    `${ENDPOINT}?_limit=5`, 
    fetcher
  );

  // ----------------------------------------------------
  // B. useSWRMutation (Mengubah / Tambah Data)
  // ----------------------------------------------------
  // Kita arahkan ke ENDPOINT yang sama. SWR otomatis tahu kalau cache 
  // untuk endpoint ini harus divalidasi ulang setelah mutation sukses.
  const { trigger, isMutating } = useSWRMutation(ENDPOINT, sendPostRequest, {
    // Kerennya useSWRMutation: Kita bisa pasang callback setelah sukses!
    onSuccess: (dataBaru) => {
      // JSONPlaceholder itu API Mock (palsu), dia tidak benar-benar menyimpan data baru ke database mereka.
      // Supaya data baru hasil ketikanmu langsung muncul di layar, kita manipulasi cache lokal pake mutate() bawaan useSWR.
      if (posts) {
        mutate([dataBaru, ...posts], false); 
      }
      setInputTitle(''); // Kosongkan input setelah sukses
      alert(`Sukses menambah artikel baru dengan ID: ${dataBaru.id}`);
    },
    onError: (err) => {
      alert(`Waduh error: ${err.message}`);
    }
  });

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    // Pemicu (trigger) untuk mengeksekusi sendPostRequest di atas
    await trigger({
      title: inputTitle,
      body: 'Ini adalah isi konten artikel dummy yang dibuat lewat useSWRMutation.',
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">SWR CRUD Demo (1 File Utuh)</h1>

      {/* FORM UNTUK MUTATION (CREATE) */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 border rounded-lg space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">Tambah Artikel Baru (Mutation)</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ketik judul artikel..."
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            disabled={isMutating}
            className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <button
            type="submit"
            disabled={isMutating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md disabled:bg-gray-400 transition"
          >
            {isMutating ? 'Menyimpan...' : 'Submit'}
          </button>
        </div>
      </form>

      {/* AREA UNTUK MENAMPILKAN DATA (READ) */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Daftar Artikel (useSWR Fetching)</h2>
        
        {error && <p className="text-red-500 text-sm">Gagal memuat data.</p>}
        {isLoading && <p className="text-gray-500 text-sm animate-pulse">Memuat data dari server...</p>}

        <ul className="divide-y divide-gray-200 border rounded-lg overflow-hidden">
          {posts?.map((post) => (
            <li key={post.id} className="p-4 bg-white hover:bg-gray-50 transition">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-0.5 rounded">
                  ID: {post.id}
                </span>
                <h3 className="font-semibold text-gray-900 text-sm">{post.title}</h3>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{post.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}