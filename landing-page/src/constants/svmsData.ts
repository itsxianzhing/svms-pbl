export const PROTOTYPE_URL = 'https://svms-pbl-web.itsxianzhing.tech';

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  {id: 'beranda', label: 'Beranda', href: '#beranda'},
  {id: 'solusi', label: 'Solusi', href: '#solusi'},
  {id: 'fitur', label: 'Fitur', href: '#fitur'},
  {id: 'paket', label: 'Paket', href: '#paket'},
  {id: 'faq', label: 'FAQ', href: '#faq'},
];

export const MANUAL_WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Pertanyaan Pelanggan',
    detail: 'Calon penyewa menanyakan jam kosong lewat chat.',
  },
  {
    step: '02',
    title: 'WhatsApp',
    detail: 'Admin membalas satu per satu secara berulang.',
  },
  {
    step: '03',
    title: 'Cek Excel / Jadwal Kertas',
    detail: 'Harus membuka file terpisah atau buku catatan fisik.',
  },
  {
    step: '04',
    title: 'Konfirmasi Ketersediaan',
    detail: 'Berisiko bentrok jika ada dua admin atau chat tertumpuk.',
  },
  {
    step: '05',
    title: 'Verifikasi Pembayaran',
    detail: 'Mengecek mutasi dan mencocokkan bukti transfer manual.',
  },
  {
    step: '06',
    title: 'Catat Manual',
    detail: 'Menyalin ulang data booking dan nominal ke rekap harian.',
  },
];

export const OPERATIONAL_PROBLEMS = [
  {
    id: 'double-booking',
    title: 'Double Booking',
    description:
      'Dua pelanggan dapat meminta lapangan dan jam yang sama karena jadwal masih dikelola secara manual dan tidak tersinkronisasi.',
  },
  {
    id: 'repetitive-admin',
    title: 'Administrasi Berulang',
    description:
      'Admin menghabiskan terlalu banyak waktu hanya untuk membalas pesan ketersediaan jadwal dan mencatat ulang setiap booking.',
  },
  {
    id: 'manual-payment',
    title: 'Pengecekan Pembayaran Manual',
    description:
      'Memeriksa status pembayaran dan mencocokkan informasi transaksi membutuhkan ketelitian dan pekerjaan manual tambahan.',
  },
  {
    id: 'scattered-data',
    title: 'Data Operasional Tersebar',
    description:
      'Catatan booking, jadwal harian, dan ringkasan pendapatan sulit dipantau karena tersimpan di chat, kertas, dan spreadsheet terpisah.',
  },
  {
    id: 'no-data-decisions',
    title: 'Keputusan Tanpa Data',
    description:
      'Pemilik venue kesulitan melihat lapangan mana yang paling diminati dan bagaimana performa bisnis secara objektif.',
  },
];

export interface FeatureItem {
  id: string;
  title: string;
  capability: string;
  ownerBenefit: string;
  featured?: boolean;
  iconKey: 'calendar-check' | 'clock' | 'building' | 'bar-chart' | 'receipt' | 'users';
}

export const SVMS_FEATURES: FeatureItem[] = [
  {
    id: 'online-booking',
    title: 'Online Booking Management',
    capability:
      'Pelanggan dapat menelusuri venue, memilih lapangan, menentukan jadwal yang tersedia, dan mengirimkan pengajuan booking langsung melalui platform.',
    ownerBenefit:
      'Mengurangi komunikasi berulang di WhatsApp dan menciptakan alur pemesanan yang jauh lebih rapi sejak awal.',
    featured: true,
    iconKey: 'calendar-check',
  },
  {
    id: 'schedule-management',
    title: 'Booking Schedule Management',
    capability:
      'Kelola seluruh catatan jadwal pemakaian lapangan dan pantau perubahan status booking dalam satu tampilan kalender operasional.',
    ownerBenefit:
      'Visibilitas harian yang jelas atas aktivitas venue sekaligus menekan risiko bentrok jadwal akibat pencatatan manual.',
    iconKey: 'clock',
  },
  {
    id: 'venue-court',
    title: 'Venue & Court Management',
    capability:
      'Atur profil venue, daftar lapangan atau meja, tarif sewa per sesi, serta jam operasional ketersediaan dari satu tempat.',
    ownerBenefit:
      'Mengelola operasional seluruh unit lapangan secara terstruktur melalui satu dashboard terpusat.',
    iconKey: 'building',
  },
  {
    id: 'business-dashboard',
    title: 'Business Dashboard',
    capability:
      'Menampilkan ringkasan operasional, jumlah booking, ringkasan pendapatan, serta daftar lapangan yang paling sering dipesan.',
    ownerBenefit:
      'Membantu pemilik memahami performa bisnis berdasarkan data terstruktur, bukan sekadar perkiraan.',
    featured: true,
    iconKey: 'bar-chart',
  },
  {
    id: 'status-payment',
    title: 'Booking Status & Payment Information',
    capability:
      'Pantau status setiap booking beserta informasi pembayaran terkait secara jelas dalam daftar transaksi.',
    ownerBenefit:
      'Memudahkan admin melacak administrasi booking yang sudah selesai, terkonfirmasi, maupun yang masih menunggu proses.',
    iconKey: 'receipt',
  },
  {
    id: 'customer-management',
    title: 'Customer Management',
    capability:
      'Menyimpan dan mengelompokkan data pelanggan bersama riwayat catatan booking yang pernah dilakukan.',
    ownerBenefit:
      'Data pelanggan dan catatan operasional tersimpan rapi sehingga mudah ditelusuri kapan saja dibutuhkan.',
    iconKey: 'users',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    number: '01',
    title: 'Atur Venue',
    description:
      'Pemilik mengatur informasi venue, daftar lapangan, tarif sewa, serta jam operasional yang tersedia di dalam sistem.',
    outcome: 'Struktur lapangan dan harga siap digunakan',
  },
  {
    number: '02',
    title: 'Customer Melakukan Booking',
    description:
      'Pelanggan memilih venue, menentukan lapangan yang diinginkan, lalu memilih slot jadwal yang tersedia dan mengajukan booking.',
    outcome: 'Alur booking tercatat otomatis tanpa chat berulang',
  },
  {
    number: '03',
    title: 'Kelola Operasional',
    description:
      'Pemilik atau admin memantau daftar booking, jadwal lapangan harian, serta status pembayaran langsung melalui dashboard SVMS.',
    outcome: 'Operasional harian terpantau dalam satu layar',
  },
  {
    number: '04',
    title: 'Pantau Performa Bisnis',
    description:
      'Pemilik menggunakan ringkasan dashboard untuk membaca tren jumlah booking, pendapatan, dan tingkat pemakaian tiap lapangan.',
    outcome: 'Evaluasi bisnis berbasis catatan yang jelas',
  },
];

export interface IllustrativeBooking {
  id: string;
  customer: string;
  court: string;
  sport: 'Badminton' | 'Futsal' | 'Padel' | 'Billiard';
  date: string;
  timeSlot: string;
  status: 'Terkonfirmasi' | 'Menunggu' | 'Selesai';
  paymentInfo: 'Lunas' | 'Menunggu Verifikasi' | 'DP 50%';
  amount: number;
}

export const ILLUSTRATIVE_BOOKINGS: IllustrativeBooking[] = [
  {
    id: 'BK-2401',
    customer: 'Komunitas Smash Pagi',
    court: 'Court A · Badminton',
    sport: 'Badminton',
    date: 'Hari Ini',
    timeSlot: '18:00 – 20:00',
    status: 'Terkonfirmasi',
    paymentInfo: 'Lunas',
    amount: 180000,
  },
  {
    id: 'BK-2402',
    customer: 'Raka Pratama',
    court: 'Lapangan Futsal 1',
    sport: 'Futsal',
    date: 'Hari Ini',
    timeSlot: '19:00 – 21:00',
    status: 'Menunggu',
    paymentInfo: 'Menunggu Verifikasi',
    amount: 340000,
  },
  {
    id: 'BK-2403',
    customer: 'Klub Padel Senja',
    court: 'Padel Court 2',
    sport: 'Padel',
    date: 'Hari Ini',
    timeSlot: '20:00 – 21:30',
    status: 'Terkonfirmasi',
    paymentInfo: 'DP 50%',
    amount: 450000,
  },
  {
    id: 'BK-2404',
    customer: 'Bagas & Tim Kantor',
    court: 'Court B · Badminton',
    sport: 'Badminton',
    date: 'Hari Ini',
    timeSlot: '16:00 – 18:00',
    status: 'Selesai',
    paymentInfo: 'Lunas',
    amount: 160000,
  },
  {
    id: 'BK-2405',
    customer: 'Dimas Wijaya',
    court: 'Meja VIP 03 · Billiard',
    sport: 'Billiard',
    date: 'Hari Ini',
    timeSlot: '21:00 – 23:00',
    status: 'Terkonfirmasi',
    paymentInfo: 'Lunas',
    amount: 150000,
  },
];

export const ILLUSTRATIVE_COURTS = [
  {
    id: 'c1',
    name: 'Court A · Badminton',
    category: 'Badminton',
    rate: 'Rp 90.000 / jam',
    hours: '07:00 – 23:00',
    bookingsCount: 46,
    share: 88,
    available: true,
  },
  {
    id: 'c2',
    name: 'Lapangan Futsal 1',
    category: 'Futsal',
    rate: 'Rp 170.000 / jam',
    hours: '08:00 – 23:00',
    bookingsCount: 38,
    share: 74,
    available: true,
  },
  {
    id: 'c3',
    name: 'Padel Court 2',
    category: 'Padel',
    rate: 'Rp 300.000 / jam',
    hours: '06:00 – 22:00',
    bookingsCount: 31,
    share: 63,
    available: true,
  },
  {
    id: 'c4',
    name: 'Meja VIP 03 · Billiard',
    category: 'Billiard',
    rate: 'Rp 75.000 / jam',
    hours: '11:00 – 24:00',
    bookingsCount: 24,
    share: 49,
    available: false,
  },
];

export const ILLUSTRATIVE_CUSTOMERS = [
  {
    id: 'CU-01',
    name: 'Komunitas Smash Pagi',
    phone: '0812-••••-4810',
    totalBookings: 12,
    favoriteCourt: 'Court A · Badminton',
    lastVisit: 'Hari ini',
  },
  {
    id: 'CU-02',
    name: 'Klub Padel Senja',
    phone: '0813-••••-9021',
    totalBookings: 8,
    favoriteCourt: 'Padel Court 2',
    lastVisit: 'Hari ini',
  },
  {
    id: 'CU-03',
    name: 'Raka Pratama',
    phone: '0856-••••-3319',
    totalBookings: 5,
    favoriteCourt: 'Lapangan Futsal 1',
    lastVisit: '2 hari lalu',
  },
  {
    id: 'CU-04',
    name: 'Bagas & Tim Kantor',
    phone: '0811-••••-7742',
    totalBookings: 9,
    favoriteCourt: 'Court B · Badminton',
    lastVisit: 'Hari ini',
  },
];

export const WEEKLY_REVENUE_SERIES = [
  {day: 'Sen', value: 2450000, bookings: 16},
  {day: 'Sel', value: 2890000, bookings: 19},
  {day: 'Rab', value: 2620000, bookings: 17},
  {day: 'Kam', value: 3340000, bookings: 22},
  {day: 'Jum', value: 4120000, bookings: 27},
  {day: 'Sab', value: 5280000, bookings: 34},
  {day: 'Min', value: 4960000, bookings: 31},
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Apa itu SVMS?',
    answer:
      'SVMS adalah platform untuk membantu pemilik dan pengelola venue olahraga mengelola booking, jadwal, venue, dan informasi operasional dalam satu sistem.',
  },
  {
    question: 'Siapa yang bisa menggunakan SVMS?',
    answer:
      'SVMS ditujukan untuk pemilik dan pengelola venue olahraga seperti badminton, futsal, padel, billiard, dan sports center.',
  },
  {
    question: 'Bagaimana cara melakukan booking demo?',
    answer:
      'Pengunjung dapat menekan tombol "Book a Demo" dan mengisi formulir permintaan demo. Setelah formulir dikirim, tim SVMS akan menghubungi pengunjung melalui email untuk menentukan jadwal demonstrasi.',
  },
  {
    question: 'Apakah saya bisa langsung menggunakan SVMS?',
    answer:
      'Saat ini pengunjung dapat mencoba prototype yang tersedia. Untuk mengenal sistem dan mendiskusikan penggunaan lebih lanjut, pengunjung dapat mengajukan Book a Demo.',
  },
  {
    question: 'Bagaimana cara kerja booking di SVMS?',
    answer:
      'Customer memilih venue, court, dan jadwal yang tersedia, kemudian mengajukan booking melalui platform. Sistem mengelola status booking sesuai alur yang tersedia.',
  },
  {
    question: 'Apakah SVMS sudah tersedia secara penuh?',
    answer:
      'SVMS masih dalam tahap Beta. Produk terus dikembangkan dan beberapa fitur maupun alur masih dapat mengalami perubahan.',
  },
  {
    question: 'Berapa lama masa Free Trial?',
    answer:
      'Free Trial berlaku selama 15 hari atau hingga mencapai 100 booking, mana yang tercapai lebih dahulu.',
  },
  {
    question: 'Apa yang terjadi setelah masa Free Trial berakhir?',
    answer:
      'Pengguna dapat menghubungi tim SVMS untuk membahas opsi penggunaan paket Business dan ketentuan layanan selanjutnya.',
  },
  {
    question: 'Apakah SVMS bisa digunakan untuk berbagai jenis lapangan?',
    answer:
      'SVMS dirancang untuk mendukung berbagai jenis venue olahraga, termasuk badminton, futsal, padel, dan billiard. Kesesuaian kebutuhan dapat dibahas saat demo.',
  },
];

export const VENUE_TYPE_OPTIONS = [
  'Badminton',
  'Futsal',
  'Padel',
  'Billiard',
  'Sports Center',
  'Lainnya',
] as const;
