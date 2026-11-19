import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
export const GuestRoute = () => {
  const { user, isLoading } = useAuth();
  return isLoading ? null : user ? (
    <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/venues'} />
  ) : (
    <Outlet />
  );
};
