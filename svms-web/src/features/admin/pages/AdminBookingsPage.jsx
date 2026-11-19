import { Link } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { bookingsApi } from '@/features/bookings/api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { rupiah, dateTime } from '@/lib/format';
export function AdminBookingsPage() {
  const { data } = useFetch(() => bookingsApi.all({}), []);
  return (
    <>
      <PageHeader title="Semua booking" />
      {!data ? (
        <p>Memuat booking...</p>
      ) : (
        data.map((b) => (
          <Link key={b.id} to={`/bookings/${b.id}`}>
            <Card className="mb-2">
              #{b.id} · {b.user.name} · {b.venue.name} · {dateTime(b.startTime)} ·{' '}
              {rupiah(b.totalPrice)} · {b.status}
            </Card>
          </Link>
        ))
      )}
    </>
  );
}
