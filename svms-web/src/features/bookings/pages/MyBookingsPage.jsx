import { Link, useSearchParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { bookingsApi } from '../api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { rupiah, dateTime } from '@/lib/format';
import { STATUS_META } from '@/config/constants';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Badge } from '@/components/ui/Badge';
export function MyBookingsPage() {
  const [q, setQ] = useSearchParams(),
    status = q.get('status') || '';
  const { data } = useFetch(() => bookingsApi.my({ status }), [status]);
  return (
    <>
      <PageHeader title="Booking saya" subtitle="Lihat status dan pembayaran booking Anda." />
      <div className="mb-6 overflow-x-auto"><SegmentedControl options={[['', 'Semua'], ...Object.entries(STATUS_META).map(([k, v]) => [k, v.label])]} value={status} onChange={(key) => setQ(key ? { status: key } : {})} /></div>
      {!data ? (
        <p>Memuat booking...</p>
      ) : !data.length ? (
        <EmptyState
          title="Belum ada booking"
          action={
            <Link to="/venues">
              <Button>Cari venue</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {data.map((b) => (
            <Link key={b.id} to={`/bookings/${b.id}`}>
              <Card className="flex min-w-0 flex-col gap-4 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 sm:flex-row sm:items-center sm:justify-between motion-reduce:transition-none">
                <div className="min-w-0"><b className="block truncate">
                    {b.venue.name} · {b.court.name}
                  </b>
                  <p className="text-sm text-slate-500">{dateTime(b.startTime)}</p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end"><Badge className={STATUS_META[b.status].className}>{STATUS_META[b.status].label}</Badge><p className="font-semibold tabular-nums">{rupiah(b.totalPrice)}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
