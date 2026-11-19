# SVMS Web

Frontend prototype untuk Sports Venue Management System (SVMS). Aplikasi ini menyediakan alur customer untuk mencari venue, memilih slot, membuat booking, dan membayar; serta alur admin untuk memantau ringkasan bisnis, booking, venue, dan court.

## Teknologi

- React 19 dan Vite 8
- React Router 7
- Tailwind CSS 4
- `fetch` melalui satu HTTP client (`src/lib/http.js`)
- Mock API in-memory untuk demo tanpa backend

## Fitur

- Autentikasi login, registrasi, pemulihan sesi, dan pembatasan route berdasarkan role.
- Pencarian dan filter venue menurut kata kunci, jenis, serta kota.
- Pemilihan court, tanggal, dan slot waktu berurutan (maksimum empat jam), termasuk deteksi slot yang telah dibooking.
- Pembuatan booking, pembayaran simulasi, pembatalan, countdown pembayaran, dan riwayat booking customer.
- Dashboard dan daftar semua booking untuk admin.
- CRUD venue untuk admin: tabel, pencarian, filter jenis, form tambah/ubah, dan konfirmasi hapus.
- CRUD court di detail venue: form tambah/ubah, aktif/nonaktif, dan konfirmasi hapus.
- Pesan konflik bisnis (`409`) yang jelas saat venue atau court masih mempunyai booking.

## Menjalankan secara lokal

Prasyarat: Node.js 22 atau versi yang kompatibel dengan Vite 8.

```bash
cd svms-web
npm ci
copy .env.example .env
npm run dev
```

Untuk menjalankan tanpa backend, atur di `.env`:

```dotenv
VITE_USE_MOCK=true
VITE_SHOW_DEMO_ACCOUNTS=true
```

Buka URL yang ditampilkan Vite (biasanya `http://localhost:5173`).

## Akun demo

| Role     | Email                | Password      |
| -------- | -------------------- | ------------- |
| Admin    | `admin@svms.test`    | `admin123`    |
| Customer | `customer@svms.test` | `customer123` |

## Environment

| Variabel                  | Default                 | Kegunaan                                         |
| ------------------------- | ----------------------- | ------------------------------------------------ |
| `VITE_API_URL`            | `/api`                  | Prefix endpoint API saat tidak memakai mock.     |
| `VITE_USE_MOCK`           | `false`                 | Gunakan mock API in-memory bila bernilai `true`. |
| `VITE_SHOW_DEMO_ACCOUNTS` | `true`                  | Tampilkan tombol akun demo di halaman login.     |
| `VITE_DEV_PROXY_TARGET`   | `http://localhost:3000` | Target proxy `/api` saat development.            |

## Perintah kualitas

```bash
npm run lint
npm run build
```

## Docker

Image dibangun dengan multi-stage Dockerfile dan disajikan oleh Nginx. Dari folder ini:

```bash
docker build -t svms-web .
docker run --rm -p 8080:80 -e BACKEND_URL=http://host.docker.internal:3000 svms-web
```

Alternatif Compose:

```bash
docker compose up --build
```

Untuk mode mock di image, berikan build argument `VITE_USE_MOCK=true`. Docker CLI harus tersedia di mesin yang menjalankan perintah tersebut.

## Struktur penting

```text
src/
  components/ui/       Komponen UI bersama
  context/             Context autentikasi dan toast
  features/            API dan halaman per domain
  mocks/               Seed dan implementasi Mock API
  routes/              Route guard dan definisi route
  lib/http.js          HTTP client tunggal
docs/API-CONTRACT.md   Kontrak API yang dipakai frontend
```

## Kontrak dan batasan

Kontrak endpoint, payload, status error, dan bentuk entitas ada di [`docs/API-CONTRACT.md`](docs/API-CONTRACT.md). Token disimpan di `localStorage` hanya untuk prototype ini; mekanisme tersebut bukan rekomendasi untuk aplikasi produksi.
# Design system

SVMS memakai canvas `#F6F7FB`, surface putih, border slate halus, teks slate-900/600/500, dan primary indigo-600 dengan hover indigo-700. Violet hanya dipakai sebagai ujung gradient brand atau sampul venue. Tipografi menggunakan Inter Variable: judul halaman `text-2xl sm:text-3xl`, judul seksi `text-lg`, isi `text-sm`, dan label `text-xs font-medium`. Kartu/modal memakai `rounded-2xl` serta shadow level 1; input, tombol, dan slot memakai `rounded-xl`; badge memakai `rounded-full`.

Layout mobile-first memakai breakpoint `sm:640`, `md:768`, `lg:1024`, dan `xl:1280`. Sidebar menjadi drawer dengan overlay di bawah `lg`, lalu sidebar sticky 256px mulai `lg`. Tabel memakai `ResponsiveTable`: kartu pasangan label-nilai di mobile dan tabel penuh mulai `md`. Modal menjadi bottom sheet mobile dengan footer tetap terlihat, lalu modal tengah mulai `sm`. Grid venue adalah satu kolom, dua kolom mulai `sm`, dan tiga kolom mulai `xl`.

Untuk menambah jenis olahraga, tambahkan entry ke `VENUE_TYPE_STYLE` di `src/config/constants.js` dengan `gradient` Tailwind tanpa warna hijau dan `icon`. Jenis yang belum terdaftar memakai fallback deterministik dari nama venue pada komponen sampul, sehingga tidak perlu mengubah API atau data.
