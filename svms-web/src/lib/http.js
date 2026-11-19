import { env } from '@/config/env';
import { TOKEN_KEY } from '@/config/constants';
import { mockRequest } from '@/mocks/mockApi';
export class ApiError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
let unauthorizedHandler;
export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};
const request = async (method, path, { params = {}, body, signal } = {}) => {
  const token = localStorage.getItem(TOKEN_KEY);
  try {
    if (env.useMock) return await mockRequest(method, path, { params, body, token, signal });
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    );
    const response = await fetch(`${env.apiUrl}${path}${query.size ? `?${query}` : ''}`, {
      method,
      signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401 && !path.startsWith('/auth/') && unauthorizedHandler)
        unauthorizedHandler();
      throw new ApiError(response.status, json.message || 'Terjadi kesalahan', json.errors);
    }
    return json.data;
  } catch (error) {
    if (error instanceof ApiError || error.name === 'AbortError') throw error;
    throw new ApiError(0, 'Tidak dapat terhubung ke server');
  }
};
export const http = {
  get: (p, o) => request('GET', p, o),
  post: (p, o) => request('POST', p, o),
  put: (p, o) => request('PUT', p, o),
  delete: (p, o) => request('DELETE', p, o),
};
