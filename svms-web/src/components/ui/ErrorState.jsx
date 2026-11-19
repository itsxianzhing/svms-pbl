import { Button } from './Button';
import { CircleAlert } from 'lucide-react';
export const ErrorState = ({ error, refetch }) => (
  <div className="rounded-2xl border border-rose-100 bg-white px-5 py-14 text-center surface-shadow">
    <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-600"><CircleAlert /></span>
    <h3 className="text-lg font-semibold text-slate-900">Gagal memuat data</h3>
    <p className="mt-1 text-sm text-slate-600">{error?.message || 'Terjadi kendala. Silakan coba lagi.'}</p>
    <Button className="mt-3" onClick={refetch}>
      Coba lagi
    </Button>
  </div>
);
