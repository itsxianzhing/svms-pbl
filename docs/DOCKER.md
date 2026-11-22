# Docker SVMS

## Arsitektur

```text
Browser → Cloudflare Tunnel → Nginx Proxy Manager (proxy-network)
                                      │
                                      ▼
                              svms-web :80
                         (proxy-network + svms-internal)
                                      │ /api/*
                                      ▼
                              svms-api :3000
                         (svms-internal + mysql-network)
                                      │
                              MySQL yang sudah ada
```

Tidak ada container MySQL baru dan tidak ada port yang dipublikasikan ke host.
`proxy-network` dan `mysql-network` adalah network external yang harus sudah ada;
`svms-internal` dibuat oleh Compose.

| Image | Container | Port internal | Network | Healthcheck |
|---|---|---:|---|---|
| `ghcr.io/itsxianzhing/svms-api:latest` | `svms-api` | 3000 | `svms-internal`, network MySQL external | `GET 127.0.0.1:3000/api/health` |
| `ghcr.io/itsxianzhing/svms-web:latest` | `svms-web` | 80 | `svms-internal`, `proxy-network` | `GET 127.0.0.1:80/` |

## Lokal

Salin `svms-api/.env.example` menjadi `svms-api/.env.production`, isi kredensial
MySQL lokal, dan buat network `proxy-network` bila ingin menjalankan Compose penuh.

```bash
docker compose build
docker compose up -d
docker compose logs -f svms-api
```

Compose mendukung `build:` untuk lokal, sedangkan VPS dapat memakai image GHCR.

## Deploy di VPS

1. Pastikan Docker Compose, container MySQL, dan Nginx Proxy Manager sudah berjalan.
2. Buat database dan user khusus:

```sql
CREATE DATABASE svms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'svms_user'@'%' IDENTIFIED BY 'PASSWORD_KUAT';
GRANT ALL PRIVILEGES ON svms.* TO 'svms_user'@'%';
FLUSH PRIVILEGES;
```

3. Cari network MySQL dengan `docker inspect <nama-container-mysql> --format '{{json .NetworkSettings.Networks}}'`, lalu isi `MYSQL_NETWORK` di `.env` atau environment shell.
4. Salin `svms-api/.env.example` ke `.env.production`, lalu isi `DATABASE_URL`, `DB_HOST` (nama container MySQL), `DB_USER`, `DB_PASSWORD`, `DB_NAME`, dan `JWT_SECRET` production.
5. Pastikan `proxy-network` adalah network Nginx Proxy Manager, lalu jalankan:

```bash
docker compose pull
docker compose up -d
```

6. Di Nginx Proxy Manager buat Proxy Host ke hostname `svms-web`, port `80`, scheme
`http`. Alurnya: `proxy-network → svms-web → svms-api → MySQL`.

## Migration dan seed

`RUN_MIGRATIONS=true` (default) menjalankan `npx prisma migrate deploy` saat API
mulai. Perintah ini tidak membuat shadow database dan tidak mereset data. Untuk
menonaktifkannya, set `RUN_MIGRATIONS=false` dan kelola migration secara terpisah.

Seed tidak dijalankan otomatis. Jalankan manual setelah container sehat:

```bash
docker compose exec svms-api npx prisma db seed
```

Repository ini belum mendefinisikan konfigurasi seed di `package.json`, sehingga
perintah tersebut baru berhasil setelah script/seed Prisma ditambahkan. Seed yang
membutuhkan devDependency juga harus memindahkan dependency tersebut ke
`dependencies` atau dijalankan dari environment development.

## Build variables dan runtime variables

`VITE_API_URL`, `VITE_USE_MOCK`, dan `VITE_SHOW_DEMO_ACCOUNTS` adalah build args.
Vite membakarnya ke bundle saat `npm run build`; perubahan setelah image dibuat
tidak berpengaruh. `DATABASE_URL`, `DB_*`, `JWT_*`, `PORT`, dan `RUN_MIGRATIONS`
dibaca saat runtime dari `.env.production` dan tidak dimasukkan ke image.

## Perubahan dan penyimpangan pola

- `prisma` dipindahkan dari `devDependencies` ke `dependencies` agar CLI tersedia
  ketika migration berjalan di runtime; lockfile diperbarui.
- Builder API mengaktifkan `legacy-peer-deps` karena `prisma-markdown@4.0.1`
  meminta peer Prisma 7 sementara aplikasi memakai Prisma 6; ini hanya untuk
  menyelesaikan dependency dev saat build dan tidak mengubah runtime API.
- Endpoint `/api/health` yang sudah ada disesuaikan menjadi `{ "data": { "status": "ok" } }`.
- Node 22 dipakai karena Node 20 berakhir masa dukungnya pada April 2026.
- `npm ci` dipakai karena `--frozen-lockfile` bukan flag npm.
- API memakai runtime non-root `USER node`; healthcheck memakai `127.0.0.1`.
- Nginx mem-proxy `/api/`, mengulang security headers pada location yang memakai
  `add_header`, dan memberi `index.html` cache `no-cache`.
- `app.set('trust proxy', 1)` disarankan bila aplikasi perlu mempercayai header
  proxy; kode aplikasi tidak diubah untuk itu.

## Hasil verifikasi

Docker tersedia dan verifikasi lokal berikut berhasil pada 22 November 2026:

```text
docker build -t svms-test-api-image ./svms-api  → berhasil; image 608MB
docker build -t svms-test-web-image ./svms-web  → berhasil; image 74.1MB
docker compose config -q                         → berhasil (dengan env file uji sementara)
```

Smoke test memakai network `svms-test-mysql-net`, volume
`svms-test-mysql-data`, serta container `svms-test-mysql`, `svms-test-api`, dan
`svms-test-web`. Hasil ringkas:

- MySQL `mysql:8` hidup dan tabel `_prisma_migrations` terbentuk, membuktikan
  `prisma migrate deploy` berjalan.
- API menjawab `{"data":{"status":"ok"}}` pada `/api/health`.
- `docker exec svms-test-api id` menghasilkan `uid=1000(node)`, bukan root.
- Web `/` mengembalikan `index.html`; `/venues` mengembalikan SPA `index.html`.
- `/api/health` melalui Nginx web mengembalikan status 200 dan payload health.
- Security headers terverifikasi pada root, asset hashed
  (`/assets/index-CWFFlrq_.js`), dan `/api/health` melalui Nginx.
- Header `index.html` memiliki `Cache-Control: no-cache`; asset memiliki
  `Cache-Control: public, immutable` dan expiry satu tahun.

Semua container, network, volume, dan image yang diawali `svms-test-` sudah
dihapus setelah pengujian.

## Asumsi dan batasan

- Network NPM dan MySQL external sudah tersedia di VPS dan nama network MySQL
  diberikan melalui `MYSQL_NETWORK`.
- CI/CD GHCR belum dibuat; Compose hanya menyediakan image name dan local build.
- Docker tersedia di environment pengerjaan; hasil perintah aktual dicatat setelah
  build dan smoke test selesai.

## Troubleshooting

| Gejala | Solusi |
|---|---|
| `502` dari `/api` | Cek `docker compose logs svms-web svms-api`, nama service `svms-api`, dan network internal. |
| API restart terus karena migration gagal | Cek `DATABASE_URL`, `DB_*`, hak user migration, dan `docker compose logs svms-api`. |
| `Can't reach database server` | Pastikan API dan MySQL berada di external network yang sama dan host memakai nama container MySQL. |
| `exec format error` atau `/bin/sh^M` | Konversi script ke LF; `.gitattributes` memaksa `*.sh` LF. |
| Nama network MySQL salah | Jalankan perintah `docker inspect` di atas dan perbarui `MYSQL_NETWORK`. |
