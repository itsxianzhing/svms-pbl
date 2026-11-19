import { http } from '@/lib/http';
export const adminApi = { summary: () => http.get('/dashboard/summary') };
