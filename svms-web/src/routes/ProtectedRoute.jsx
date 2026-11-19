import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  return isLoading ? (
    <div className="grid min-h-dvh place-items-center">Memuat SVMS...</div>
  ) : isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};
