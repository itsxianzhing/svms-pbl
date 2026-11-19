import { seed } from './seed';
import {
  LOCK_MINUTES,
  MAX_BOOKING_HOURS,
  OPEN_HOUR,
  CLOSE_HOUR,
  PAYMENT_METHODS,
} from '@/config/constants';
import { ApiError } from '@/lib/http';
let db = structuredClone(seed);
let id = 4;
const wait = () => new Promise((r) => setTimeout(r, 300 + Math.random() * 300));
const fail = (s, m, e) => {
  throw new ApiError(s, m, e);
};
const expire = () =>
  db.bookings.forEach((b) => {
    if (
      b.status === 'PENDING' &&
      new Date(b.createdAt).getTime() + LOCK_MINUTES * 60000 < Date.now()
    ) {
      b.status = 'CANCELLED';
      b.expiresAt = null;
    }
  });
const user = (token) => {
  const u = db.users.find((x) => x.id === token?.replace('mock-', ''));
  if (!u) fail(401, 'Sesi tidak valid');
  return u;
};
const admin = (u) => u.role === 'ADMIN' || fail(403, 'Akses ditolak');
const venue = (v) => {
  const courts = db.courts.filter((c) => c.venueId === v.id),
    active = courts.filter((c) => c.isActive);
  return {
    ...v,
    courtCount: courts.length,
    minPricePerHour: active.length ? Math.min(...active.map((c) => c.pricePerHour)) : null,
  };
};
const booking = (b) => {
  const c = db.courts.find((x) => x.id === b.courtId),
    v = db.venues.find((x) => x.id === c.venueId),
    u = db.users.find((x) => x.id === b.userId);
  return {
    ...b,
    court: { id: c.id, name: c.name, pricePerHour: c.pricePerHour },
    venue: { id: v.id, name: v.name, type: v.type, city: v.city },
    user: { id: u.id, name: u.name, email: u.email },
  };
};
const required = (b, fields) => {
  const e = {};
  fields.forEach((f) => {
    if (!b?.[f] && b?.[f] !== false) e[f] = 'Wajib diisi';
  });
  if (Object.keys(e).length) fail(422, 'Data belum lengkap', e);
};
export async function mockRequest(method, path, { params = {}, body = {}, token } = {}) {
  await wait();
  expire();
  if (method === 'POST' && path === '/auth/login') {
    const u = db.users.find((x) => x.email === body.email && x.password === body.password);
    if (!u) fail(401, 'Email atau password salah');
    return { token: `mock-${u.id}`, user: (({ password, ...x }) => x)(u) };
  }
  if (method === 'POST' && path === '/auth/register') {
    required(body, ['name', 'email', 'password']);
    if (db.users.some((u) => u.email === body.email))
      fail(422, 'Email sudah digunakan', { email: 'Email sudah digunakan' });
    if (body.password.length < 6)
      fail(422, 'Password terlalu pendek', { password: 'Minimal 6 karakter' });
    const u = {
      id: `u${++id}`,
      name: body.name,
      email: body.email,
      password: body.password,
      role: 'CUSTOMER',
    };
    db.users.push(u);
    return { token: `mock-${u.id}`, user: (({ password, ...x }) => x)(u) };
  }
  const u = user(token);
  if (method === 'GET' && path === '/auth/me') return (({ password, ...x }) => x)(u);
  if (method === 'GET' && path === '/venues/filters')
    return {
      types: [...new Set(db.venues.map((v) => v.type))].sort(),
      cities: [...new Set(db.venues.map((v) => v.city))].sort(),
    };
  if (method === 'GET' && path === '/venues') {
    let r = db.venues
      .filter(
        (v) =>
          !params.search ||
          `${v.name} ${v.address} ${v.city}`.toLowerCase().includes(params.search.toLowerCase())
      )
      .filter((v) => !params.type || v.type === params.type)
      .filter((v) => !params.city || v.city === params.city);
    return r.map(venue).sort((a, b) => a.name.localeCompare(b.name));
  }
  if (method === 'POST' && path === '/venues') {
    admin(u);
    required(body, ['name', 'type', 'address', 'city']);
    const v = { id: `v${++id}`, ...body };
    db.venues.push(v);
    return venue(v);
  }
  const vm = path.match(/^\/venues\/([^/]+)$/);
  if (vm) {
    const v = db.venues.find((x) => x.id === vm[1]);
    if (!v) fail(404, 'Venue tidak ditemukan');
    if (method === 'GET')
      return { ...venue(v), courts: db.courts.filter((c) => c.venueId === v.id) };
    admin(u);
    if (method === 'PUT') {
      required(body, ['name', 'type', 'address', 'city']);
      Object.assign(v, body);
      return venue(v);
    }
    if (method === 'DELETE') {
      const cs = db.courts.filter((c) => c.venueId === v.id);
      if (db.bookings.some((b) => cs.some((c) => c.id === b.courtId)))
        fail(409, 'Venue masih memiliki booking');
      db.courts = db.courts.filter((c) => c.venueId !== v.id);
      db.venues = db.venues.filter((x) => x !== v);
      return {};
    }
  }
  const ccreate = path.match(/^\/venues\/([^/]+)\/courts$/);
  if (ccreate && method === 'POST') {
    admin(u);
    if (!db.venues.some((v) => v.id === ccreate[1])) fail(404, 'Venue tidak ditemukan');
    required(body, ['name', 'pricePerHour']);
    if (Number(body.pricePerHour) <= 0)
      fail(422, 'Harga tidak valid', { pricePerHour: 'Harga harus lebih dari 0' });
    const c = {
      id: `c${++id}`,
      venueId: ccreate[1],
      name: body.name,
      pricePerHour: Number(body.pricePerHour),
      isActive: !!body.isActive,
    };
    db.courts.push(c);
    return c;
  }
  const cm = path.match(/^\/courts\/([^/]+)(\/bookings)?$/);
  if (cm) {
    const c = db.courts.find((x) => x.id === cm[1]);
    if (!c) fail(404, 'Court tidak ditemukan');
    if (cm[2] && method === 'GET') {
      return db.bookings
        .filter(
          (b) =>
            b.courtId === c.id &&
            b.status !== 'CANCELLED' &&
            new Date(b.startTime) < new Date(params.to) &&
            new Date(b.endTime) > new Date(params.from)
        )
        .map((b) => ({ startTime: b.startTime, endTime: b.endTime }));
    }
    admin(u);
    if (method === 'PUT') {
      required(body, ['name', 'pricePerHour']);
      if (Number(body.pricePerHour) <= 0)
        fail(422, 'Harga tidak valid', { pricePerHour: 'Harga harus lebih dari 0' });
      Object.assign(c, {
        ...body,
        pricePerHour: Number(body.pricePerHour),
        isActive: !!body.isActive,
      });
      return c;
    }
    if (method === 'DELETE') {
      if (db.bookings.some((b) => b.courtId === c.id))
        fail(409, 'Court sudah memiliki booking, nonaktifkan saja');
      db.courts = db.courts.filter((x) => x !== c);
      return {};
    }
  }
  if (method === 'POST' && path === '/bookings') {
    if (u.role !== 'CUSTOMER') fail(403, 'Akses ditolak');
    required(body, ['courtId', 'startTime', 'endTime']);
    const c = db.courts.find((x) => x.id === body.courtId);
    if (!c || !c.isActive) fail(422, 'Court tidak tersedia', { courtId: 'Court tidak tersedia' });
    const s = new Date(body.startTime),
      e = new Date(body.endTime),
      hours = (e - s) / 3600000;
    if (
      !(s < e) ||
      s <= new Date() ||
      s.getMinutes() ||
      e.getMinutes() ||
      hours % 1 ||
      hours > MAX_BOOKING_HOURS ||
      s.getHours() < OPEN_HOUR ||
      e.getHours() > CLOSE_HOUR
    )
      fail(422, 'Jadwal tidak valid');
    if (
      db.bookings.some(
        (b) =>
          b.courtId === c.id &&
          b.status !== 'CANCELLED' &&
          new Date(b.startTime) < e &&
          new Date(b.endTime) > s
      )
    )
      fail(409, 'Slot sudah dipesan');
    const b = {
      id: `b${++id}`,
      courtId: c.id,
      userId: u.id,
      status: 'PENDING',
      startTime: s.toISOString(),
      endTime: e.toISOString(),
      totalPrice: c.pricePerHour * hours,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + LOCK_MINUTES * 60000).toISOString(),
    };
    db.bookings.push(b);
    return booking(b);
  }
  if (method === 'GET' && path === '/bookings/my')
    return db.bookings
      .filter((b) => b.userId === u.id && (!params.status || b.status === params.status))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(booking);
  if (method === 'GET' && path === '/bookings') {
    admin(u);
    return db.bookings
      .filter((b) => !params.status || b.status === params.status)
      .filter(
        (b) =>
          !params.search ||
          `${booking(b).user.name} ${booking(b).user.email}`
            .toLowerCase()
            .includes(params.search.toLowerCase())
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(booking);
  }
  const bm = path.match(/^\/bookings\/([^/]+)(\/(pay|cancel))?$/);
  if (bm) {
    const b = db.bookings.find((x) => x.id === bm[1]);
    if (!b) fail(404, 'Booking tidak ditemukan');
    if (b.userId !== u.id && u.role !== 'ADMIN') fail(403, 'Akses ditolak');
    if (!bm[2] && method === 'GET') return booking(b);
    if (bm[3] === 'pay' && method === 'POST') {
      if (
        b.userId !== u.id ||
        b.status !== 'PENDING' ||
        !PAYMENT_METHODS.some((x) => x[0] === body.method)
      )
        fail(409, 'Pembayaran tidak dapat diproses');
      b.status = 'CONFIRMED';
      b.expiresAt = null;
      return booking(b);
    }
    if (bm[3] === 'cancel' && method === 'POST') {
      if (!['PENDING', 'CONFIRMED'].includes(b.status) || new Date(b.endTime) < new Date())
        fail(409, 'Booking tidak dapat dibatalkan');
      b.status = 'CANCELLED';
      b.expiresAt = null;
      return booking(b);
    }
  }
  if (method === 'GET' && path === '/dashboard/summary') {
    admin(u);
    const bs = db.bookings,
      confirmed = bs.filter((b) => b.status === 'CONFIRMED');
    const rows = confirmed.reduce((a, b) => {
      const x = booking(b),
        k = b.courtId;
      a[k] ??= {
        courtId: k,
        courtName: x.court.name,
        venueName: x.venue.name,
        bookingCount: 0,
        revenue: 0,
      };
      a[k].bookingCount++;
      a[k].revenue += b.totalPrice;
      return a;
    }, {});
    return {
      totalRevenue: confirmed.reduce((n, b) => n + b.totalPrice, 0),
      totalBookings: bs.length,
      todayBookings: bs.filter(
        (b) => new Date(b.startTime).toDateString() === new Date().toDateString()
      ).length,
      pendingBookings: bs.filter((b) => b.status === 'PENDING').length,
      confirmedBookings: confirmed.length,
      cancelledBookings: bs.filter((b) => b.status === 'CANCELLED').length,
      topCourts: Object.values(rows)
        .sort((a, b) => b.bookingCount - a.bookingCount)
        .slice(0, 5),
    };
  }
  fail(404, 'Endpoint tidak ditemukan');
}
