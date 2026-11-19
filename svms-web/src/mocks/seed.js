const now = Date.now();
const iso = (h) => new Date(now + h * 3600000).toISOString();
export const seed = {
  users: [
    {
      id: 'u1',
      name: 'Administrator SVMS',
      email: 'admin@svms.test',
      password: 'admin123',
      role: 'ADMIN',
    },
    {
      id: 'u2',
      name: 'Dina Pemain',
      email: 'customer@svms.test',
      password: 'customer123',
      role: 'CUSTOMER',
    },
  ],
  venues: [
    {
      id: 'v1',
      name: 'GOR Nusantara',
      type: 'Badminton',
      address: 'Jl. Merdeka No. 10',
      city: 'Bandung',
      description: 'Lapangan badminton nyaman untuk semua pemain.',
    },
    {
      id: 'v2',
      name: 'Arena Senayan',
      type: 'Futsal',
      address: 'Jl. Stadion Raya 8',
      city: 'Jakarta',
      description: 'Arena futsal modern di pusat kota.',
    },
    {
      id: 'v3',
      name: 'Court Bali',
      type: 'Basket',
      address: 'Jl. Sunset Road 22',
      city: 'Denpasar',
      description: 'Lapangan basket indoor.',
    },
  ],
  courts: [],
  bookings: [],
};
seed.venues.forEach((v, vi) => {
  for (let i = 1; i <= 3; i++)
    seed.courts.push({
      id: `c${vi + 1}${i}`,
      venueId: v.id,
      name: `Lapangan ${i}`,
      pricePerHour: (vi + 1) * 50000 + i * 10000,
      isActive: !(vi === 2 && i === 3),
    });
});
seed.bookings = [
  {
    id: 'b1',
    courtId: 'c11',
    userId: 'u2',
    status: 'CONFIRMED',
    startTime: iso(24),
    endTime: iso(26),
    totalPrice: 120000,
    createdAt: iso(-2),
    expiresAt: null,
  },
  {
    id: 'b2',
    courtId: 'c12',
    userId: 'u2',
    status: 'PENDING',
    startTime: iso(48),
    endTime: iso(50),
    totalPrice: 140000,
    createdAt: iso(-0.1),
    expiresAt: new Date(now + 14 * 60000).toISOString(),
  },
  {
    id: 'b3',
    courtId: 'c21',
    userId: 'u2',
    status: 'CANCELLED',
    startTime: iso(72),
    endTime: iso(73),
    totalPrice: 110000,
    createdAt: iso(-48),
    expiresAt: null,
  },
];
