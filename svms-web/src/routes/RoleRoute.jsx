import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
export const RoleRoute = ({ roles }) => {
  const { user } = useAuth();
  return roles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/venues'} />
  );
};
