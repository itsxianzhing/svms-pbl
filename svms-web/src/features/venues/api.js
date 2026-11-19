import { http } from '@/lib/http';
export const venuesApi = {
  list: (p) => http.get('/venues', { params: p }),
  filters: () => http.get('/venues/filters'),
  get: (id) => http.get(`/venues/${id}`),
  create: (b) => http.post('/venues', { body: b }),
  update: (id, b) => http.put(`/venues/${id}`, { body: b }),
  remove: (id) => http.delete(`/venues/${id}`),
};
