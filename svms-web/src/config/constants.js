export const ROLES = { ADMIN: 'ADMIN', CUSTOMER: 'CUSTOMER' };
export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
};
export const STATUS_META = {
  PENDING: { label: 'Menunggu pembayaran', className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20' },
  CONFIRMED: { label: 'Terkonfirmasi', className: 'bg-sky-50 text-sky-700 ring-1 ring-sky-600/20' },
  CANCELLED: { label: 'Dibatalkan', className: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20' },
};
export const VENUE_TYPE_STYLE = {
  Futsal: { gradient: 'from-indigo-600 via-indigo-600 to-violet-600', icon: '⚽' },
  Badminton: { gradient: 'from-sky-600 via-indigo-600 to-violet-600', icon: '🏸' },
  Basket: { gradient: 'from-rose-600 via-indigo-600 to-violet-600', icon: '🏀' },
  Tenis: { gradient: 'from-amber-500 via-indigo-600 to-violet-600', icon: '🎾' },
};
export function venueTypeStyle(type, name = '') {
  if (VENUE_TYPE_STYLE[type]) return VENUE_TYPE_STYLE[type];
  const styles = Object.values(VENUE_TYPE_STYLE);
  const hash = [...name].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return styles[hash % styles.length];
}
export const LOCK_MINUTES = 15,
  OPEN_HOUR = 8,
  CLOSE_HOUR = 22,
  MAX_BOOKING_HOURS = 4;
export const PAYMENT_METHODS = [
  ['QRIS', 'QRIS'],
  ['VIRTUAL_ACCOUNT', 'Virtual Account'],
  ['E_WALLET', 'E-Wallet'],
];
export const TOKEN_KEY = 'svms_token';
export const DEMO_ACCOUNTS = {
  ADMIN: { email: 'admin@svms.test', password: 'admin123' },
  CUSTOMER: { email: 'customer@svms.test', password: 'customer123' },
};
