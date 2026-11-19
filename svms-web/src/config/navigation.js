import { LayoutDashboard, Building2, CalendarDays, Search } from 'lucide-react';
import { ROLES } from './constants';
export const navigation = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, roles: [ROLES.ADMIN] },
  { label: 'Kelola venue', path: '/admin/venues', icon: Building2, roles: [ROLES.ADMIN] },
  { label: 'Semua booking', path: '/admin/bookings', icon: CalendarDays, roles: [ROLES.ADMIN] },
  { label: 'Cari venue', path: '/venues', icon: Search, roles: [ROLES.CUSTOMER] },
  { label: 'Booking saya', path: '/my-bookings', icon: CalendarDays, roles: [ROLES.CUSTOMER] },
];
