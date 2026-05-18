# AI Agent Execution Plan: Frontend Take-Home Test

## Context & Objective
Kamu adalah seorang Senior Frontend Engineer. [cite_start]Tugasmu adalah menyelesaikan *take-home test* dari PT Mampu Inovasi Digital menggunakan Next.js (App Router), TypeScript, Tailwind CSS, dan Jest + React Testing Library[cite: 9, 11, 14, 15, 26]. [cite_start]Kerjakan seluruh instruksi di bawah ini dengan standar *production-ready code*, penanganan *edge cases* yang ketat, dan struktur repositori yang bersih[cite: 3, 61].

---

## Technical Stack Requirements
* [cite_start]**Framework:** Next.js 13+ (App Router) [cite: 11]
* [cite_start]**Language:** TypeScript (Strict Mode) [cite: 9]
* [cite_start]**State/Fetching:** Client-side menggunakan SWR atau React Query (pilih salah satu yang paling optimal), atau native `fetch` untuk Server Components [cite: 12, 13]
* [cite_start]**Styling:** Tailwind CSS (bikin UI yang modern, bersih, dan sepenuhnya responsif) [cite: 14, 71, 72]
* [cite_start]**Testing:** Jest + React Testing Library [cite: 15]

---

## Execution Steps & Tasks

### Technical Specs & Instructions

<task-1-setup>
1. [cite_start]Inisialisasi proyek Next.js baru dengan TypeScript, Tailwind CSS, dan konfigurasi App Router[cite: 9, 11, 14].
2. [cite_start]Konfigurasi Jest dan React Testing Library untuk siap menjalankan unit-test[cite: 15].
3. [cite_start]Pastikan `dev server` berjalan normal secara lokal[cite: 16].
4. Buat arsitektur folder yang rapi (misal: `/components`, `/hooks`, `/app`, dll).
</task-1-setup>

<task-2-users-list>
1. [cite_start]Buat halaman daftar pengguna di rute `/users`[cite: 18].
2. [cite_start]Ambil data (Fetch) dari API: `https://jsonplaceholder.typicode.com/users`[cite: 19].
3. [cite_start]Ambil juga data tambahan dari API berikut untuk proses *enrichment* (Task 4)[cite: 46]:
   * [cite_start]Posts: `https://jsonplaceholder.typicode.com/posts` [cite: 48]
   * [cite_start]Todos: `https://jsonplaceholder.typicode.com/todos` [cite: 50]
4. [cite_start]Gabungkan data tersebut sehingga setiap baris/kartu user memiliki metrik agregasi berikut[cite: 52]:
   * [cite_start]Total posts oleh user tersebut [cite: 52]
   * [cite_start]Total todos yang berstatus selesai (`completed: true`) [cite: 52]
   * [cite_start]Total todos yang berstatus pending (`completed: false`) [cite: 52]
5. [cite_start]Tampilkan data dalam bentuk **Responsive Table** untuk layar desktop (kolom: Name, Email, Website, Total Posts, Completed Todos, Pending Todos)[cite: 20, 52, 54].
6. [cite_start]Untuk layar **Mobile**, ubah tampilan menjadi bentuk **Card Layout** yang rapi agar tidak terlihat seperti tabel yang dipaksakan/sempit[cite: 53, 54].
7. Implementasikan fitur-fitur berikut di sisi klien (*client-side*):
   * [cite_start]Input pencarian (filter berdasarkan nama atau email)[cite: 25].
   * [cite_start]Fitur urutkan (*sorting*) standar (misal: berdasarkan nama)[cite: 25].
   * [cite_start]**Advanced Filter/Sort:** Tambahkan minimal satu filter/sort canggih (contoh: hanya menampilkan user yang memiliki *pending todos*, atau urutkan berdasarkan *pending todos* terbanyak)[cite: 56].
8. Sediakan UI State yang jelas untuk situasi berikut:
   * [cite_start]Loading state (gunakan Skeleton component agar estetik)[cite: 21, 74].
   * [cite_start]Error state jika API gagal dimuat[cite: 21, 61].
   * [cite_start]Empty state jika hasil pencarian/filter tidak mengembalikan data sama sekali[cite: 61, 75].
</task-2-users-list>

<task-3-user-details>
1. [cite_start]Buat rute dinamis untuk detail pengguna di `/users/[id]`[cite: 34]. [cite_start]Memilih baris atau kartu pada daftar pengguna harus mengarahkan user ke halaman ini[cite: 34].
2. [cite_start]Ambil data detail dari: `https://jsonplaceholder.typicode.com/users/{userId}`[cite: 35, 36].
3. Tampilkan informasi dalam bentuk card yang bersih, memuat komponen berikut:
   * [cite_start]Info Utama: Name, Username, Email, Phone, Website [cite: 37]
   * [cite_start]Company: Name, Catchphrase [cite: 38]
   * [cite_start]Address: Street, Suite, City, Zipcode [cite: 39]
4. [cite_start]**Task 4 Extension:** Tambahkan section khusus di bawah card utama untuk menampilkan daftar lengkap **Posts** dan **Todos** milik user tersebut[cite: 57]. [cite_start]Batasi tampilannya atau buat navigasi yang nyaman agar tidak membuat user kewalahan (*avoid overwhelming the user*)[cite: 58].
5. [cite_start]Sediakan tombol/link "Back to list" yang menonjol[cite: 40].
6. [cite_start]**State Preservation:** Pastikan ketika user kembali ke halaman utama `/users`, status pencarian, filter, atau sorting sebelumnya **tidak hilang** (tetap tersimpan)[cite: 59, 60].
7. [cite_start]Tampilkan loading skeleton, penanganan error, dan tangani skenario *invalid user ID* secara anggun[cite: 41, 61].
8. [cite_start]**SEO Bonus:** Implementasikan `generateMetadata` untuk rute dinamis ini guna mengekspos metadata SEO yang relevan[cite: 42].
</task-3-user-details>

<task-5-ux-accessibility>
1. [cite_start]Gunakan semantik HTML tabel yang aksesibel (`<thead>`, `<tbody>`, `<th>`, `scope`, dll)[cite: 76].
2. [cite_start]Berikan kejelasan pada *focus states* dan pastikan area klik tautan (*link hit areas*) cukup besar dan mudah ditekan[cite: 76].
</task-5-ux-accessibility>

<task-6-testing-specs>
[cite_start]Tulis unit test menggunakan **Jest + React Testing Library** dengan melakukan *mocking* pada semua *network calls*[cite: 81].
1. **Test Suite - Users List Page:**
   * [cite_start]Memastikan komponen merrender user bersama sinyal aktivitas hasil kalkulasi (*derived activity signals*)[cite: 79].
   * [cite_start]Memastikan fungsi pencarian (filter nama/email) berjalan lancar[cite: 79].
   * [cite_start]Memastikan *advanced filter/sort* yang kamu buat berfungsi dengan benar[cite: 79].
   * [cite_start]Memastikan kondisi *loading*, *error*, dan *empty states* muncul di saat yang tepat[cite: 79].
2. **Test Suite - User Details Page:**
   * [cite_start]Memastikan detail user beserta rincian posts & todos terrender sempurna[cite: 80].
   * [cite_start]Memastikan *loading* dan *error states* bekerja[cite: 80].
   * [cite_start]Memastikan penanganan jika terjadi kasus *invalid user id* atau data user tidak ditemukan[cite: 80].
</task-6-testing-specs>

<bonus-tasks>
*Jika semua tugas utama selesai, implementasikan fitur opsional berikut untuk nilai tambah:*
1. [cite_start]**Pagination:** Tambahkan pagination pada halaman `/users`[cite: 84].
2. [cite_start]**ISR:** Lakukan caching data user selama 60 detik menggunakan aturan `fetch({ next: { revalidate: 60 } })`[cite: 85].
3. [cite_start]**Error Boundary:** Bungkus rute detail dengan React Error Boundary untuk menangani eror tak terduga[cite: 87].
</bonus-tasks>

---

## Output Expectations
1. Kode yang bersih, modular, dan bebas dari *TypeScript errors* / *warnings*.
2. [cite_start]Commit history yang rapi dan deskriptif untuk menunjukkan proses pengembangan langkah-demi-langkah[cite: 3].
3. Pastikan semua *test case* berjalan sukses (`pass`) sebelum menandai tugas selesai.