import { http } from '@/lib/http';
export const courtsApi = {
  create: (id, b) => http.post(`/venues/${id}/courts`, { body: b }),
  update: (id, b) => http.put(`/courts/${id}`, { body: b }),
  remove: (id) => http.delete(`/courts/${id}`),
  bookings: (id, p) => http.get(`/courts/${id}/bookings`, { params: p }),
};
