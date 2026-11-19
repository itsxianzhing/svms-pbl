import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { http, setUnauthorizedHandler } from '@/lib/http';
import { TOKEN_KEY } from '@/config/constants';
import { useToast } from './ToastContext';
const C = createContext();
export const useAuth = () => useContext(C);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null),
    [isLoading, setLoading] = useState(true);
  const { show } = useToast();
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);
  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      show('Sesi berakhir, silakan login lagi', 'error');
    });
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    http
      .get('/auth/me')
      .then(setUser)
      .catch(logout)
      .finally(() => setLoading(false));
  }, [logout, show]);
  const auth = async (action, data) => {
    const r = await http.post(`/auth/${action}`, { body: data });
    localStorage.setItem(TOKEN_KEY, r.token);
    setUser(r.user);
    return r.user;
  };
  return (
    <C.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login: (d) => auth('login', d),
        register: (d) => auth('register', d),
        logout,
      }}
    >
      {children}
    </C.Provider>
  );
}
