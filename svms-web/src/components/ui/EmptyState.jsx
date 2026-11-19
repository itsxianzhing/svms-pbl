import { Inbox } from 'lucide-react';
export const EmptyState = ({ title = 'Belum ada data', description, action }) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-14 text-center surface-shadow">
    <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"><Inbox /></span>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="mx-auto mb-5 max-w-sm text-sm text-slate-600">{description || 'Belum ada data untuk ditampilkan saat ini.'}</p>
    {action}
  </div>
);
