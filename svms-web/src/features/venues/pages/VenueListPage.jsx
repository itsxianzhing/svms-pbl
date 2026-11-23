import { Link, useSearchParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { venuesApi } from '../api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { rupiah } from '@/lib/format';
import { MapPin, Layers } from 'lucide-react';
import { venueTypeStyle } from '@/config/constants';
export function VenueListPage() {
  const [q, setQ] = useSearchParams();
  const params = Object.fromEntries(q);
  const { data, loading, error, refetch } = useFetch(() => venuesApi.list(params), [q.toString()]);
  const { data: filters = [] } = useFetch(() => venuesApi.filters(), []);
  const change = (k, v) =>
    setQ((x) => {
      v ? x.set(k, v) : x.delete(k);
      return x;
    });
  return (
    <>
      <PageHeader title="Cari venue" subtitle="Temukan lapangan untuk permainan Anda." />
      <Card className="mb-6 grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        <Input
          label="Cari"
          value={params.search || ''}
          onChange={(e) => change('search', e.target.value)}
        />
        <Select
          label="Jenis"
          value={params.type || ''}
          onChange={(e) => change('type', e.target.value)}
        >
          <option value="">Semua jenis</option>
          {filters.types?.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
        <Select
          label="Kota"
          value={params.city || ''}
          onChange={(e) => change('city', e.target.value)}
        >
          <option value="">Semua kota</option>
          {filters.cities?.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
        <Button variant="secondary" className="w-full self-end sm:w-auto" onClick={() => setQ({})}>
          Reset
        </Button>
      </Card>
      {error ? (
        <ErrorState error={error} refetch={refetch} />
      ) : !data ? (
        <p>Memuat venue...</p>
      ) : data.length === 0 ? (
        <EmptyState
          title="Tidak ada venue yang cocok"
          action={<Button onClick={() => setQ({})}>Reset filter</Button>}
        />
      ) : (
        <>
           <p className="mb-4 text-sm text-slate-600">Menampilkan <span className="font-semibold text-slate-900">{data.length} venue</span></p>
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {data.map((v) => (
                <Link className="block min-w-0" key={v.id} to={`/venues/${v.id}`}>
                  <Card className="group h-full min-w-0 overflow-hidden p-0 transition duration-200 ease-out hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg motion-reduce:transition-none">
                    <div className={`relative flex h-20 items-center justify-center overflow-hidden bg-gradient-to-br sm:h-24 ${venueTypeStyle(v.type, v.name).gradient}`}><span className="absolute -right-3 -top-8 size-28 rounded-full border border-white/20" /><span className="text-4xl opacity-30 sm:text-5xl">{venueTypeStyle(v.type, v.name).icon}</span></div>
                    <div className="min-w-0 p-4 sm:p-5"><div className="flex min-w-0 items-start gap-2"><b className="min-w-0 flex-1 truncate text-base">{v.name}</b><span className="max-w-[45%] shrink-0 truncate rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{v.type}</span></div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-500"><p className="flex min-w-0 items-center gap-1.5"><MapPin className="shrink-0" size={15} /><span className="truncate">{v.city}</span></p><p className="flex min-w-0 items-center justify-end gap-1.5"><Layers className="shrink-0" size={15} /><span className="truncate">{v.courtCount} lapangan</span></p></div>
                    <p className="mt-4 truncate text-sm text-slate-500">Mulai <strong className="text-lg font-semibold tabular-nums text-slate-900">{v.minPricePerHour ? rupiah(v.minPricePerHour) : '—'}</strong> / jam</p>
                    </div>
                  </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
