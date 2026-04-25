# Project Profile: Desktop IPL Management System (Offline First)

**Tech Stack:** Laravel (Latest), Inertia.js, React, SQLite, NativePHP, Tailwind CSS.
**Starter Kit:** Laravel Breeze/Jetstream (React Stack).
**Goal:** Membangun aplikasi desktop pengelola iuran lingkungan yang ringan, cepat, dan profesional dengan fitur manajemen data warga, tagihan otomatis, dan cetak struk fisik.

---

## 1. Core Principles & UI Standards

- **Offline Only:** Data disimpan di SQLite lokal. Tidak ada dependensi API eksternal yang menghambat saat offline.
- **UI Design:** Modern, Clean, Minimalist. Dominan Putih (#FFFFFF).
- **Rounding:** Maksimal `rounded-md` atau 6px. Hindari desain yang terlalu bulat.
- **Custom Filesystem:** DILARANG menggunakan `php artisan storage:link`.
    - URL: `mydomain.com/(folder)` atau `/file-upload/(folder)`.
    - Root: `public/file-upload/(folder)`.
- **Performance:** Gunakan optimasi Vite, React Memo (jika perlu), dan Lazy Loading untuk memastikan aplikasi desktop tetap responsif.

---

## 2. Phase 1: Environment & Foundation

- Setup database **SQLite**.
- Install **NativePHP** dan konfigurasi window desktop agar aplikasi berjalan otomatis saat dibuka.
- Konfigurasi **Inertia.js + React** sebagai bridge frontend-backend.
- **Global Toast System:** Implementasikan `react-hot-toast` atau `Sonner` untuk notifikasi sukses/error yang minimalist.
- **Settings System:** Tabel `settings` untuk menyimpan:
    - Nama Perusahaan (Default: PT Kemang Pratama), Alamat, Logo, & Nama Pimpinan.
    - Custom Primary Color (untuk branding aplikasi).

---

## 3. Phase 2: CRUD Optimization (Customer & Master Data)

- **Data Warga:** Field `nama`, `no_hp`, `no_rumah`, `blok`, `alamat`, `nominal_ipl_tetap`.
- **Standardisasi Halaman:** Setiap halaman index (List Data) WAJIB memiliki:
    - **Search:** Real-time search (Server-side via Inertia query strings).
    - **Filter:** Filter berdasarkan blok atau status pembayaran.
    - **Pagination:** Gunakan pagination Laravel yang diintegrasikan dengan komponen React (misal: 10-20 data per halaman).
- **Filesystem & Images:** Upload logo/bukti harus di-resize otomatis (Max 1MB) menggunakan Intervention Image sebelum disimpan ke `public/file-upload/`.

---

## 4. Phase 3: Billing & Payment Logic

- **Monthly Generator:** Tombol untuk generate tagihan massal untuk semua warga setiap bulan secara otomatis.
- **Outstanding Logic:** Sistem harus mendeteksi total tunggakan (bulan-bulan sebelumnya yang belum Lunas).
- **Payment Action:** Proses bayar harus mengubah status menjadi `Lunas` dan mencatat tanggal bayar.

---

## 5. Phase 4: Interaction & Safety (Modals & Toasts)

- **Action Confirmation:** Terapkan Modal Konfirmasi (Headless UI / Shadcn UI) untuk:
    - **Delete:** Konfirmasi sebelum menghapus data warga atau tagihan.
    - **Logout:** Konfirmasi sebelum keluar aplikasi.
    - **Generate Tagihan:** Konfirmasi sebelum membuat tagihan massal.
- **Toasts:** Tampilkan notifikasi setiap kali aksi berhasil (e.g., "Data warga berhasil diperbarui", "Tagihan berhasil dicetak").

---

## 6. Phase 5: Printing Engine (Kwitansi Fisik)

- Buat View khusus yang meniru desain kwitansi fisik (referensi PT Kemang Pratama).
- Gunakan CSS `@media print` dengan ukuran kertas khusus (Continuous Form).
- Karena berjalan di NativePHP, pastikan fungsi `window.print()` memanggil dialog print sistem desktop dengan benar.

---

## 7. Phase 6: Reporting & Export

- **Dashboard Analytics:** Ringkasan total tagihan, total uang masuk bulan ini, dan total tunggakan dalam bentuk card yang clean.
- **Export System:**
    - **Excel:** Gunakan Laravel Excel untuk laporan bulanan.
    - **PDF:** Gunakan DomPDF untuk laporan resmi atau daftar tunggakan per blok.
- **Export Filter:** Admin bisa ekspor data berdasarkan rentang tanggal atau kategori blok rumah.

---

## 8. Build & Distribution

- Jalankan `npm run build` untuk compile asset React.
- Gunakan perintah `php artisan native:build` untuk menghasilkan file `.exe`.
- Pastikan database SQLite kosong (atau hanya berisi seeder dasar) saat dibuild untuk pertama kali.

---

## Aturan Tambahan untuk AI:

1. **Inertia Progress:** Pastikan loading bar muncul saat berpindah halaman.
2. **Form Handling:** Gunakan `useForm` dari `@inertiajs/react` untuk semua input data agar validasi error dari Laravel tertangkap dengan baik.
3. **Optimasi Query:** Gunakan `Eager Loading` di Controller untuk menghindari N+1 query yang memperlambat aplikasi desktop.
4. **Code Structure:** Pisahkan komponen UI (Buttons, Modals, Inputs) agar reusable.
