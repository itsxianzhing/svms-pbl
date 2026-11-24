**# SVMS: Sports Venue Management System**



\> Prototype sistem booking lapangan olahraga untuk **\*\*Program Pelatihan Vokasi Nasional\*\***.

\> Menggantikan pencatatan manual lewat WhatsApp dan buku jadwal dengan booking online yang mencegah jadwal dobel, pembayaran yang terkonfirmasi otomatis, dan dashboard data untuk pemilik venue.



Pendekatan: **\*\*Design Thinking\*\*** (Empathize → Define → Ideate → Prototype → Test).



\---



**## Live Demo

- **Landing Page:** https://svms.itsxianzhing.tech/
- **Live Prototype / Dashboard:** https://dashboard-svms.itsxianzhing.tech/

---

## Daftar Isi**



1\. [Tentang Proyek]\(#1-tentang-proyek)

2\. [Status Proyek]\(#2-status-proyek)

3\. [Fitur dan Aturan Bisnis]\(#3-fitur-dan-aturan-bisnis)

4\. [Tech Stack]\(#4-tech-stack)

5\. [Arsitektur]\(#5-arsitektur)

6\. [Struktur Repository]\(#6-struktur-repository)

7\. [Database]\(#7-database)

8\. [API]\(#8-api)

9\. [Menjalankan di Lokal]\(#9-menjalankan-di-lokal)

10\. [Environment Variables]\(#10-environment-variables)

11\. [Docker]\(#11-docker)

12\. [Deployment ke VPS]\(#12-deployment-ke-vps)

13\. [CI/CD]\(#13-cicd)

14\. [Skenario Demo]\(#14-skenario-demo)

15\. [Keamanan dan Keterbatasan]\(#15-keamanan-dan-keterbatasan)

16\. [Roadmap]\(#16-roadmap)

17\. [Troubleshooting]\(#17-troubleshooting)



\---



**## 1. Tentang Proyek**



**### Masalah**



**\*\*Pak Budi\*\*** (42 th) memiliki GOR badminton dengan 4 lapangan. Pesanan masuk lewat WhatsApp dan dicatat di buku jadwal. Ia takut salah catat sampai jadwal dobel, dan tidak punya data jam atau lapangan mana yang paling laku. **\*\*Dina\*\*** (24 th), pemain, harus chat dan menunggu balasan hanya untuk tahu slot kosong.



Temuan masalah: booking manual, double booking, cek pembayaran manual, pekerjaan admin berulang, dan keputusan bisnis tanpa data.



**### Pertanyaan yang dijawab prototype ini**



\| How Might We | Jawaban di SVMS |

\|---|---|

\| Bagaimana memastikan satu lapangan tidak pernah dipesan dua kali? | Cek bentrok jadwal di server. Percobaan kedua ditolak (HTTP 409) dan slot terisi tampil di UI. |

\| Bagaimana pembayaran terkonfirmasi tanpa dicek manual? | Booking \`PENDING\` dikunci 15 menit. Setelah pembayaran (simulasi) langsung \`CONFIRMED\`, tanpa konfirmasi manual admin. |

\| Bagaimana pemilik membaca performa bisnis sekali lihat? | Dashboard admin: pendapatan, jumlah booking, dan lapangan paling laku. |



Pengguna utama adalah **\*\*pemilik venue (ADMIN)\*\***. Pemain (CUSTOMER) adalah pengguna sekunder.



\---



**## 2. Status Proyek**



\| Komponen | Status | Catatan |

\|---|---|---|

\| Backend (Express + Prisma + MySQL) | ✅ Sudah dibuat | Masih ada perbaikan yang direncanakan |

\| Frontend (React + Tailwind) | ✅ Sudah dibuat | Mendukung mode mock; polesan desain dan responsive sedang dikerjakan |

\| Dockerisasi frontend dan backend | 🔜 Direncanakan | Lihat [bagian 11]\(#11-docker) |

\| Deployment VPS | 🔜 Direncanakan | Lihat [bagian 12]\(#12-deployment-ke-vps) |

\| CI/CD | 🔜 Direncanakan | Lihat [bagian 13]\(#13-cicd) |



Fitur yang **\*\*sengaja belum ada\*\*** (di luar scope prototype): guest checkout, ulasan, check-in, payment gateway sungguhan, upload foto, pagination, notifikasi. Semuanya masuk [roadmap]\(#16-roadmap).



\---



**## 3. Fitur dan Aturan Bisnis**



**### Customer**



\- Register, login, logout

\- Cari venue (search + filter jenis olahraga dan kota)

\- Lihat detail venue dan daftar lapangan

\- Pilih tanggal dan jam (slot per jam), lalu buat booking

\- Bayar booking (simulasi) dalam batas waktu 15 menit

\- Lihat riwayat dan membatalkan booking



**### Admin (pemilik venue)**



\- Dashboard ringkasan: total pendapatan, total booking, booking hari ini, booking menunggu pembayaran, lapangan paling laku, komposisi status

\- CRUD venue

\- CRUD lapangan (court)

\- Melihat semua booking (filter status dan pencarian pemesan) dan membatalkan booking



**### Aturan bisnis**



1\. **\*\*Slot yang sama tidak bisa dipesan dua kali.\*\*** Booking baru ditolak (409) jika bentrok dengan booking \`PENDING\` yang belum kedaluwarsa atau \`CONFIRMED\` pada court yang sama.

2\. **\*\*Temporary lock 15 menit.\*\*** Booking baru berstatus \`PENDING\`. Jika tidak dibayar dalam 15 menit, otomatis \`CANCELLED\` dan slot tersedia lagi.

3\. **\*\*Konfirmasi hanya lewat pembayaran.\*\*** Tidak ada tombol konfirmasi manual.

4\. Booking dalam kelipatan jam penuh, maksimal 4 jam, pada jam operasional 08:00–22:00 WIB.

5\. Total harga dihitung di server (\`pricePerHour × jumlah jam\`), bukan dipercaya dari klien.

6\. Venue atau court yang sudah punya booking tidak bisa dihapus (nonaktifkan saja).



Siklus status booking:



\`\`\`

PENDING ──(bayar sukses)──► CONFIRMED

   │                            │

   └──(lock habis / batal)──────┴──► CANCELLED

\`\`\`



\---



**## 4. Tech Stack**



\| Lapisan | Teknologi |

\|---|---|

\| Frontend | React (JSX), Vite, Tailwind CSS v4, React Router, lucide-react |

\| Backend | Node.js, Express, Prisma ORM, **\*\*zod\*\*** (validasi), JWT, bcrypt |

\| Database | MySQL 8 |

\| Container | Docker, Docker Compose |

\| Reverse proxy | Nginx Proxy Manager |

\| Akses publik | Cloudflare Tunnel |

\| Hosting | VPS Hostinger |

\| CI/CD | 🔜 GitHub Actions (rencana) 🔧 |



\---



**## 5. Arsitektur**



**### 5.1 Arsitektur runtime (target deployment)**



\`\`\`

Pengguna (browser)

       │  HTTPS

       ▼

 Cloudflare (DNS + TLS)

       │  Cloudflare Tunnel (cloudflared, koneksi keluar dari VPS)

       ▼

┌──────────────────────── VPS Hostinger ─────────────────────────┐

│                                                                │

│   Nginx Proxy Manager  ──►  svms-web (nginx + React build)     │

│                                  │                             │

│                                  │  /api/\*  (proxy internal)   │

│                                  ▼                             │

│                             svms-api (Express)                 │

│                                  │                             │

│                                  ▼                             │

│              MySQL (container yang sudah ada, dipakai bersama) │

│              database \`svms\` + user khusus \`svms_user\`         │

└────────────────────────────────────────────────────────────────┘

\`\`\`



Hal penting dari desain ini:



\- Hanya **\*\*\`svms-web\`\*\*** yang dihubungkan ke reverse proxy. Backend tidak dibuka ke publik; frontend meneruskan \`/api/\*\` ke backend lewat jaringan Docker. Hasilnya tidak ada masalah CORS dan permukaan serangan lebih kecil.

\- **\*\*Cloudflare Tunnel\*\*** membuat koneksi keluar dari VPS, jadi tidak perlu membuka port 80/443 ke internet.

\- **\*\*Satu container MySQL dipakai bersama\*\*** banyak aplikasi, tetapi setiap aplikasi punya **\*\*database dan user MySQL sendiri\*\***. Aplikasi lain tidak bisa menyentuh data SVMS, dan sebaliknya.



**### 5.2 Arsitektur backend (layered)**



Backend memakai **\*\*layered architecture\*\***. Satu request mengalir dari atas ke bawah, dan tiap lapisan hanya berbicara dengan lapisan tepat di bawahnya.



\`\`\`

HTTP Request

    │

    ▼

 server.js ── menyalakan HTTP server (port, graceful shutdown)

    │

    ▼

 app.js ───── merangkai Express: middleware global, mount routes, error handler

    │

    ▼

 Routes ───── mendaftarkan path + method, memasang middleware (auth, role, validasi)

    │

    ▼

 Controller ─ membaca request, memanggil service, membentuk response HTTP

    │

    ▼

 Service ──── logika bisnis (cek bentrok, hitung harga, aturan status, kedaluwarsa lock)

    │

    ▼

 Repository ─ satu-satunya tempat yang bicara ke Prisma (query database)

    │

    ▼

 Prisma ───── MySQL

\`\`\`



Pendukung:



\- **\*\*DTO + zod:\*\*** skema validasi untuk body, query, dan params. Request yang tidak valid ditolak dengan 422 sebelum sampai ke controller.

\- **\*\*Error handler terpusat:\*\*** mengubah error domain (misal "slot sudah dipesan") menjadi status HTTP yang sesuai dan format \`{ message, errors }\`.



Contoh untuk modul \`user\` (modul lain mengikuti pola yang sama):



\`\`\`

userRoutes.js  →  userController.js  →  userServices.js  →  userRepositories.js  →  Prisma

                       ▲

                  userDto.js (zod)

\`\`\`



Aturan emas: **\*\*controller tidak menyentuh Prisma, repository tidak berisi logika bisnis.\*\***



\---



**## 6. Struktur Repository**



🔧 Sesuaikan dengan struktur aktual.



\`\`\`

svms/

├── svms-api/                    # Backend

│   ├── prisma/

│   │   ├── schema.prisma

│   │   ├── migrations/

│   │   └── seed.js

│   ├── src/

│   │   ├── server.js

│   │   ├── app.js

│   │   ├── config/              # env, konstanta (LOCK_MINUTES, jam operasional)

│   │   ├── routes/              # userRoutes.js, venueRoutes.js, ...

│   │   ├── controllers/         # userController.js, ...

│   │   ├── services/            # userServices.js, ...

│   │   ├── repositories/        # userRepositories.js, ...

│   │   ├── dtos/                # userDto.js (skema zod), ...

│   │   ├── middlewares/         # auth, role, validate, errorHandler

│   │   └── utils/

│   ├── Dockerfile               # 🔜

│   └── .env.example

│

├── svms-web/                    # Frontend (README sendiri yang lebih detail)

│   ├── src/

│   ├── docs/API-CONTRACT.md     # Kontrak API (acuan backend dan frontend)

│   ├── Dockerfile

│   ├── nginx/default.conf.template

│   └── docker-compose.yml

│

├── docker-compose.yml           # 🔜 gabungan api + web untuk VPS

└── README.md                    # dokumen ini

\`\`\`



Dokumentasi frontend yang lebih rinci (struktur \`src/\`, design system, mode mock) ada di [\`svms-web/README.md\`]\(./svms-web/README.md).



\---



**## 7. Database**



MySQL 8 dengan Prisma. Empat tabel:



\`\`\`mermaid

erDiagram

  VENUES ||--o{ COURTS : "punya"

  USERS ||--o{ BOOKINGS : "membuat"

  COURTS ||--o{ BOOKINGS : "dipesan lewat"

  USERS {

    int id PK

    string name

    string email UK

    string password

    enum role

    datetime created_at

  }

  VENUES {

    int id PK

    string name

    string type

    string address

    string city

    string description

    datetime created_at

  }

  COURTS {

    int id PK

    int venue_id FK

    string name

    decimal price_per_hour

    boolean is_active

  }

  BOOKINGS {

    int id PK

    int user_id FK

    int court_id FK

    datetime start_time

    datetime end_time

    decimal total_price

    enum status

    datetime created_at

  }

\`\`\`



\| Tabel | Fungsi |

\|---|---|

\| \`users\` | Akun. Role \`ADMIN\` atau \`CUSTOMER\`. Password disimpan sebagai hash bcrypt. |

\| \`venues\` | Tempat olahraga (nama, jenis, alamat, kota). |

\| \`courts\` | Lapangan milik venue, dengan harga per jam dan status aktif. |

\| \`bookings\` | Pesanan. Status \`PENDING\`, \`CONFIRMED\`, \`CANCELLED\`. |



Catatan desain:



\- **\*\*Tidak ada kolom \`locked_until\`.\*\*** Batas lock dihitung dari \`created_at + 15 menit\`. Booking \`PENDING\` yang lewat batas diubah menjadi \`CANCELLED\` oleh backend (dijalankan di awal operasi booking, atau lewat cron).

\- **\*\*Cek bentrok dilakukan di kode (service + transaksi)\*\***, bukan constraint database, karena MySQL tidak punya exclusion constraint seperti PostgreSQL. Kondisinya: \`existing.start < new\.end AND existing.end > new\.start\`.

\- Semua waktu disimpan **\*\*UTC\*\***. Jam operasional dan "booking hari ini" dihitung dalam **\*\*WIB\*\***.

\- \`Decimal\` Prisma dikonversi ke \`number\` sebelum dikirim sebagai JSON.

\- Index \`(court_id, start_time)\` pada \`bookings\` untuk mempercepat cek bentrok.



**### Migrasi**



\`\`\`bash

\# Development (membuat migration baru dan menerapkannya)

npx prisma migrate dev --name nama_perubahan



\# Production / container (hanya menerapkan migration yang sudah ada)

npx prisma migrate deploy



\# Seed data awal

npx prisma db seed

\`\`\`



\> \`migrate dev\` membutuhkan *\*shadow database\**, sehingga user MySQL development perlu izin \`CREATE\` database. Lihat [bagian 11.2]\(#112-database-container-mysql-bersama).



**### Data seed**



\| Akun | Email | Password |

\|---|---|---|

\| Admin | \`admin\@svms.test\` | \`admin123\` |

\| Customer | \`budi.customer\@svms.test\` | \`customer123\` |



Seed juga membuat beberapa venue, court, dan booking contoh agar dashboard tidak kosong. **\*\*Ganti atau hapus akun ini di production.\*\***



\---



**## 8. API**



Kontrak lengkap (bentuk data, aturan bisnis, contoh respons) ada di [\`svms-web/docs/API-CONTRACT.md\`]\(./svms-web/docs/API-CONTRACT.md). Itu adalah acuan bersama frontend dan backend.



**### Konvensi**



\- Base path: \`/api\`. Format JSON. Waktu ISO 8601 UTC.

\- Auth: \`Authorization: Bearer \<JWT>\`.

\- Sukses: \`{ "data": ... }\`. Error: \`{ "message": "...", "errors": { "field": "pesan" } }\`.

\- Status: \`401\` belum login, \`403\` tidak berhak, \`404\` tidak ada, \`409\` konflik aturan bisnis, \`422\` validasi gagal.



**### Endpoint**



\| Method | Path | Akses | Fungsi | Status |

\|---|---|---|---|---|

\| POST | \`/api/auth/register\` | publik | Daftar sebagai CUSTOMER | ☐ |

\| POST | \`/api/auth/login\` | publik | Login, menerima token | ☐ |

\| GET | \`/api/auth/me\` | login | Data user saat ini | ☐ |

\| GET | \`/api/venues\` | login | Daftar venue (\`search\`, \`type\`, \`city\`) | ☐ |

\| GET | \`/api/venues/filters\` | login | Opsi filter (jenis dan kota) | ☐ |

\| GET | \`/api/venues/:id\` | login | Detail venue + court | ☐ |

\| POST | \`/api/venues\` | ADMIN | Tambah venue | ☐ |

\| PUT | \`/api/venues/:id\` | ADMIN | Ubah venue | ☐ |

\| DELETE | \`/api/venues/:id\` | ADMIN | Hapus venue (409 jika ada booking) | ☐ |

\| POST | \`/api/venues/:venueId/courts\` | ADMIN | Tambah court | ☐ |

\| PUT | \`/api/courts/:id\` | ADMIN | Ubah court | ☐ |

\| DELETE | \`/api/courts/:id\` | ADMIN | Hapus court (409 jika ada booking) | ☐ |

\| GET | \`/api/courts/:id/bookings?from&to\` | login | Interval slot yang terisi | ☐ |

\| POST | \`/api/bookings\` | CUSTOMER | Buat booking (PENDING, 409 jika bentrok) | ☐ |

\| GET | \`/api/bookings/my\` | CUSTOMER | Booking milik sendiri | ☐ |

\| GET | \`/api/bookings\` | ADMIN | Semua booking (\`status\`, \`search\`) | ☐ |

\| GET | \`/api/bookings/:id\` | pemilik / ADMIN | Detail booking | ☐ |

\| POST | \`/api/bookings/:id/pay\` | pemilik | Bayar (simulasi) → CONFIRMED | ☐ |

\| POST | \`/api/bookings/:id/cancel\` | pemilik / ADMIN | Batalkan booking | ☐ |

\| GET | \`/api/dashboard/summary\` | ADMIN | Ringkasan untuk dashboard | ☐ |



\---



**## 9. Menjalankan di Lokal**



**### Prasyarat**



\- Node.js 22 LTS dan npm

\- MySQL 8 (lokal atau container)

\- Git



**### 9.1 Backend**



\`\`\`bash

cd svms-api

npm install

cp .env.example .env          # isi DATABASE_URL, JWT_SECRET, dst.

npx prisma migrate dev        # buat tabel

npx prisma db seed            # data awal

npm run dev                   # 🔧 sesuaikan nama script

\`\`\`



Backend berjalan di \`http\://localhost:3000\` 🔧 dengan semua rute di bawah \`/api\`.



**### 9.2 Frontend (dengan backend)**



\`\`\`bash

cd svms-web

npm install

cp .env.example .env          # VITE_USE_MOCK=false

npm run dev

\`\`\`



Vite mem-proxy \`/api\` ke \`VITE_DEV_PROXY_TARGET\` (default \`http\://localhost:3000\`), jadi tidak ada masalah CORS saat development.



**### 9.3 Frontend tanpa backend (mode mock)**



\`\`\`bash

cd svms-web

\# di .env: VITE_USE_MOCK=true

npm run dev

\`\`\`



Seluruh endpoint disimulasikan di memori, berguna untuk demo atau membandingkan perilaku backend dengan kontrak.



\---



**## 10. Environment Variables**



**### Backend (\`svms-api/.env\`) 🔧**



\| Variabel | Contoh | Keterangan |

\|---|---|---|

\| \`NODE_ENV\` | \`development\` | \`production\` di server |

\| \`PORT\` | \`3000\` | Port HTTP |

\| \`DATABASE_URL\` | \`mysql://svms_user:password\@localhost:3306/svms\` | Koneksi Prisma |

\| \`SHADOW_DATABASE_URL\` | \`mysql://root:password\@localhost:3306/svms_shadow\` | Hanya untuk \`migrate dev\` |

\| \`JWT_SECRET\` | *\*(string acak panjang)\** | **\*\*Wajib beda\*\*** antara dev dan production |

\| \`JWT_EXPIRES_IN\` | \`1d\` | Masa berlaku token |



**### Frontend (\`svms-web/.env\`)**



\| Variabel | Default | Keterangan |

\|---|---|---|

\| \`VITE_API_URL\` | \`/api\` | Base URL API |

\| \`VITE_USE_MOCK\` | \`false\` | \`true\` = pakai data mock |

\| \`VITE_SHOW_DEMO_ACCOUNTS\` | \`true\` | Tampilkan tombol akun demo di halaman login (matikan di production) |

\| \`VITE_DEV_PROXY_TARGET\` | \`http\://localhost:3000\` | Target proxy saat dev |



\`.env\` tidak pernah di-commit. Hanya \`.env.example\` yang masuk repository.



\---



**## 11. Docker**



\> Konfigurasi Docker sudah dibuat, tetapi belum di-deploy ke VPS. Detail operasional ada di [\`docs/DOCKER.md\`]\(docs/DOCKER.md).



**### 11.1 Gambaran**



Frontend dan backend masing-masing satu container. Database memakai **\*\*container MySQL yang sudah berjalan\*\***, tidak membuat container MySQL baru.



\`\`\`text

Cloudflare Tunnel → Nginx Proxy Manager (proxy-network) → svms-web :80

                                                        │ /api/\*

                                                        ▼

                                               svms-api :3000

                                      (svms-internal + mysql-network)

                                                        │

                                             MySQL container existing

\`\`\`



**### 11.2 Database: container MySQL bersama**



Satu container MySQL melayani banyak aplikasi. Untuk SVMS, buat **\*\*database dan user sendiri\*\*** supaya terisolasi:



\`\`\`sql

\-- Jalankan sebagai root di container MySQL

CREATE DATABASE svms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;



CREATE USER 'svms_user'@'%' IDENTIFIED BY 'GANTI_DENGAN_PASSWORD_KUAT';

GRANT ALL PRIVILEGES ON svms.\* TO 'svms_user'@'%';

FLUSH PRIVILEGES;

\`\`\`



Untuk development lokal, \`prisma migrate dev\` butuh shadow database. Buat terpisah:



\`\`\`sql

CREATE DATABASE svms_shadow;

GRANT ALL PRIVILEGES ON svms_shadow.\* TO 'svms_user'@'%';

\`\`\`



lalu isi \`SHADOW_DATABASE_URL\` di \`.env\` lokal. Di production cukup \`prisma migrate deploy\`, yang tidak memakai shadow database.



\`DATABASE_URL\` di container memakai **\*\*nama container MySQL\*\*** sebagai host:



\`\`\`

mysql://svms_user:PASSWORD\@nama-container-mysql:3306/svms

\`\`\`



Container \`svms-api\` harus bergabung ke network yang sama dengan container MySQL

(\`mysql-network\` pada Compose, dibuat sebagai \`external\`).



**### 11.3 Backend dan frontend**



Dockerfile API memakai multi-stage Node 22, migration Prisma saat start, dan

runtime non-root. Dockerfile web membangun Vite lalu hanya menyimpan asset

static di Nginx. Reverse proxy \`/api/\*\` memakai hostname tetap \`svms-api:3000\`.



**### 11.4 Compose gabungan (root)**



\`\`\`yaml

services:

  svms-api:

    image: ghcr.io/itsxianzhing/svms-api:latest

    build: ./svms-api

    container_name: svms-api

    restart: unless-stopped

    env_file:

      - ./svms-api/.env.production

    networks:

      - svms-internal

      - mysql-network



  svms-web:

    image: ghcr.io/itsxianzhing/svms-web:latest

    build: ./svms-web

    container_name: svms-web

    restart: unless-stopped

    depends_on:

      svms-api:

        condition: service_healthy

    networks:

      - svms-internal

      - proxy-network



networks:

  svms-internal:

  mysql-network:

    external: true

    name: ${MYSQL_NETWORK:-mysql-network}

  proxy-network:

    external: true

\`\`\`



Tidak ada \`ports:\` di service mana pun. Akses publik hanya lewat Nginx Proxy Manager.



\---



**## 12. Deployment ke VPS**



Status: konfigurasi sudah dibuat, belum di-deploy. Ikuti panduan lengkap di [\`docs/DOCKER.md\`]\(docs/DOCKER.md).



**### 12.1 Persiapan server**



1\. Update sistem, buat user non-root, aktifkan firewall (hanya SSH yang terbuka; dengan Cloudflare Tunnel tidak perlu membuka 80/443).

2\. Pasang Docker dan Docker Compose plugin.

3\. Pastikan container MySQL dan Nginx Proxy Manager sudah berjalan, lalu catat nama network masing-masing.



**### 12.2 Siapkan database**



Buat database \`svms\` dan user \`svms_user\` seperti di [bagian 11.2]\(#112-database-container-mysql-bersama).



**### 12.3 Jalankan aplikasi**



\`\`\`bash

git clone \<url-repo> svms && cd svms        # 🔧

cp svms-api/.env.example svms-api/.env.production

\# isi DATABASE_URL/DB\_\* (host = nama container MySQL) dan JWT_SECRET kuat



docker compose pull && docker compose up -d

docker compose logs -f svms-api             # pastikan migration berhasil

\`\`\`



Jalankan seed **\*\*sekali saja\*\*** bila perlu data awal:



\`\`\`bash

docker compose exec svms-api npx prisma db seed

\`\`\`



**### 12.4 Nginx Proxy Manager**



Buat **\*\*Proxy Host\*\***:



\| Field | Nilai |

\|---|---|

\| Domain Names | 🔧 \`svms.domainmu.com\` |

\| Scheme | \`http\` |

\| Forward Hostname | \`svms-web\` |

\| Forward Port | \`80\` |

\| Websockets Support | tidak perlu |



TLS ditangani Cloudflare. Karena trafik dari tunnel ke NPM berupa HTTP lokal, tidak perlu sertifikat di NPM.



**### 12.5 Cloudflare Tunnel**



1\. Di Cloudflare Zero Trust, buat Tunnel dan pasang \`cloudflared\` di VPS (service atau container).

2\. Tambahkan **\*\*Public Hostname\*\***: \`svms.domainmu.com\` 🔧 → Service \`http\://nama-container-npm:80\` 🔧 (atau \`http\://localhost:80\` bila \`cloudflared\` berjalan di host).

3\. Pastikan record DNS dibuat otomatis oleh Cloudflare (CNAME ke tunnel).



Alur akhir: \`Browser → Cloudflare → Tunnel → NPM → svms-web → /api → svms-api → MySQL\`.



**### 12.6 Cek setelah deploy**



\- [ ] Halaman web terbuka lewat domain

\- [ ] Login memakai akun seed berhasil

\- [ ] Buat booking, bayar, dan statusnya \`CONFIRMED\`

\- [ ] Booking kedua di slot yang sama ditolak

\- [ ] \`docker compose logs\` bersih dari error

\- [ ] Port database tidak terbuka ke internet



\---



**## 13. CI/CD**



\> 🔜 Rencana. Belum diimplementasikan.



Alur yang direncanakan (GitHub Actions 🔧):



\`\`\`

Pull Request

   └─► CI: install → lint → build (frontend), install → lint → prisma validate (backend)



Merge / push ke main

   └─► Build image api & web

        └─► Push ke container registry (mis. GHCR)

             └─► SSH ke VPS

                  └─► docker compose pull && docker compose up -d

                       └─► (migration otomatis lewat prisma migrate deploy saat api start)

\`\`\`



Hal yang perlu disiapkan:



\- Secrets di repository: \`SSH_HOST\`, \`SSH_USER\`, \`SSH_KEY\`, kredensial registry. **\*\*Jangan\*\*** menaruh \`.env.production\` di repository.

\- Branch protection untuk \`main\` (wajib CI hijau sebelum merge).

\- Strategi rollback sederhana: tag image per commit sehingga bisa kembali ke versi sebelumnya.

\- Backup database sebelum migration yang destruktif.



\---



**## 14. Skenario Demo**



Skenario ini berasal dari fase **\*\*Test\*\*** pada materi pelatihan. Jalankan dengan dua browser (atau satu biasa dan satu incognito) agar bisa login sebagai dua user.



**\*\*A. Booking sampai bayar sukses\*\***

Customer login → pilih venue → pilih court, tanggal, dan slot → pesan → halaman detail menampilkan \`PENDING\` dengan countdown → bayar → status \`CONFIRMED\`.



**\*\*B. Countdown dibiarkan habis\*\***

Buat booking lalu biarkan hingga countdown 0 → status berubah \`CANCELLED\` dan slot muncul lagi sebagai tersedia.



**\*\*C. Dua booking di slot yang sama\*\***

Customer 1 membuat booking di slot tertentu. Customer 2 mencoba slot yang sama → ditolak dengan pesan jelas (409), slot picker diperbarui.



**\*\*D. Sisi pemilik venue\*\***

Login admin → booking tadi muncul di "Semua booking" → dashboard mencerminkan angkanya → tambah, ubah, dan hapus venue dan court.



**\*\*Indikator keberhasilan:\*\*** penguji menyelesaikan booking tanpa dibantu, tidak ada double booking pada semua percobaan, status mudah dipahami, dan pemilik bisa membaca dashboard.



\---



**## 15. Keamanan dan Keterbatasan**



Ini prototype untuk pembelajaran. Hal yang perlu diketahui:



\- **\*\*Pembayaran disimulasikan.\*\*** Tidak ada payment gateway. Metode pembayaran hanya divalidasi dan tidak disimpan.

\- **\*\*Token JWT disimpan di \`localStorage\`\*\*** pada frontend. Cukup untuk prototype, tetapi rentan terhadap XSS. Untuk produksi, pertimbangkan cookie \`httpOnly\`.

\- **\*\*Cek bentrok berbasis aplikasi.\*\*** Dua request yang benar-benar bersamaan berpotensi lolos bersamaan. Transaksi dan penguncian baris (\`SELECT ... FOR UPDATE\`) mengurangi risiko, tetapi tidak sekuat constraint database.

\- **\*\*Jam operasional tetap\*\*** (08:00–22:00 WIB) dan zona waktu diasumsikan WIB.

\- Tidak ada pagination, rate limiting, atau audit log.

\- **\*\*Praktik yang wajib diikuti saat deploy:\*\*** password database kuat dan unik per aplikasi, \`JWT_SECRET\` acak panjang, matikan akun demo, \`.env\` tidak masuk git, port MySQL tidak dibuka ke publik, dan backup database berkala.



\---



**## 16. Roadmap**



**\*\*Perbaikan backend yang direncanakan\*\*** 🔧 (isi sesuai catatanmu)



\- [ ] ...

\- [ ] ...



**\*\*Setelah prototype (menuju MVP SVMS penuh)\*\***



\- Multi-tenant berbasis Business (Business, Membership, role per bisnis)

\- Guest checkout

\- Payment gateway sungguhan (QRIS, Virtual Account, e-wallet) dengan webhook

\- Check-in dan ulasan pelanggan

\- Subscription dan free trial, notifikasi, analytics lanjutan

\- Pindah ke PostgreSQL agar double booking dijaga constraint database

\- Asisten AI di WhatsApp, CRM dan loyalty, dynamic pricing, multi-branch



\---



**## 17. Troubleshooting**



\| Gejala | Kemungkinan penyebab dan solusi |

\|---|---|

\| \`prisma migrate dev\` gagal soal shadow database | User MySQL tidak punya izin \`CREATE\`. Buat \`svms_shadow\` dan isi \`SHADOW_DATABASE_URL\`, atau beri izin yang sesuai pada user development. |

\| \`Can't reach database server\` di container | Container api belum satu network dengan container MySQL, atau host di \`DATABASE_URL\` bukan nama container. |

\| Frontend 502 / Bad Gateway di \`/api\` | \`svms-api\` belum berjalan, hostname/network salah, atau API gagal migration. Cek \`docker compose logs svms-web svms-api\`. |

\| Login selalu kembali ke halaman login | Token tidak terkirim atau kedaluwarsa. Cek respons \`/api/auth/me\` dan \`JWT_SECRET\` yang konsisten antar restart. |

\| CORS error di dev | Pastikan frontend memakai proxy Vite (\`VITE_API_URL=/api\`), bukan memanggil \`localhost:3000\` langsung. |

\| Harga atau total tampil sebagai string | \`Decimal\` Prisma belum dikonversi ke \`number\` di backend. |

\| Slot tidak kembali tersedia setelah lock habis | Booking \`PENDING\` kedaluwarsa belum di-set \`CANCELLED\` di database. Pastikan fungsi kedaluwarsa berjalan sebelum query booking. |

\| Jam booking bergeser beberapa jam | Campuran UTC dan zona lokal. Simpan UTC, konversi ke WIB hanya saat menampilkan atau menghitung "hari ini". |

\| Website tidak bisa diakses lewat domain | Periksa status tunnel di Cloudflare Zero Trust, Public Hostname, dan Proxy Host di Nginx Proxy Manager. |



\---



**## Kredit**



Dibuat sebagai proyek **\*\*Program Pelatihan Vokasi Nasional\*\***.

🔧 Nama: **\_\_\_ · Instruktur: \_\_\_** · Tahun: 2026
