import { http } from '@/lib/http';
export const authApi = {
  login: (b) => http.post('/auth/login', { body: b }),
  register: (b) => http.post('/auth/register', { body: b }),
};
