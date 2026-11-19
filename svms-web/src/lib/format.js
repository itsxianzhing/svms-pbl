export const rupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0);
export const dateTime = (value) =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value)
  );
export const dateOnly = (value) =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date(value));
export const time = (value) =>
  new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).format(
    new Date(value)
  );
export const duration = (start, end) =>
  `${Math.round((new Date(end) - new Date(start)) / 3600000)} jam`;
