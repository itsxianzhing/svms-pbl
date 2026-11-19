import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';
import { RoleRoute } from './RoleRoute';
import { AuthLayout } from '@/layouts/AuthLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { VenueListPage } from '@/features/venues/pages/VenueListPage';
import { VenueDetailPage } from '@/features/venues/pages/VenueDetailPage';
import { MyBookingsPage } from '@/features/bookings/pages/MyBookingsPage';
import { BookingDetailPage } from '@/features/bookings/pages/BookingDetailPage';
import { DashboardPage } from '@/features/admin/pages/DashboardPage';
import { AdminVenuesPage } from '@/features/admin/pages/AdminVenuesPage';
import { AdminVenueDetailPage } from '@/features/admin/pages/AdminVenueDetailPage';
import { AdminBookingsPage } from '@/features/admin/pages/AdminBookingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { useAuth } from '@/context/AuthContext';
const Home = () => {
  const { user } = useAuth();
  return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/venues'} />;
};
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route element={<RoleRoute roles={['CUSTOMER']} />}>
            <Route path="/venues" element={<VenueListPage />} />
            <Route path="/venues/:venueId" element={<VenueDetailPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
          </Route>
          <Route element={<RoleRoute roles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/venues" element={<AdminVenuesPage />} />
            <Route path="/admin/venues/:venueId" element={<AdminVenueDetailPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          </Route>
          <Route path="/bookings/:bookingId" element={<BookingDetailPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
