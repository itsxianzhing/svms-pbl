import { http } from '@/lib/http';
export const bookingsApi = {
  create: (b) => http.post('/bookings', { body: b }),
  my: (p) => http.get('/bookings/my', { params: p }),
  all: (p) => http.get('/bookings', { params: p }),
  get: (id) => http.get(`/bookings/${id}`),
  pay: (id, b) => http.post(`/bookings/${id}/pay`, { body: b }),
  cancel: (id) => http.post(`/bookings/${id}/cancel`),
};
