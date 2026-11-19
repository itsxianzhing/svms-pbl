import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { venuesApi } from '../api';
import { courtsApi } from '@/features/courts/api';
import { bookingsApi } from '@/features/bookings/api';
import { useFetch } from '@/hooks/useFetch';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { ErrorState } from '@/components/ui/ErrorState';
import { rupiah } from '@/lib/format';
import { CLOSE_HOUR, MAX_BOOKING_HOURS, OPEN_HOUR } from '@/config/constants';
import { useToast } from '@/context/ToastContext';
import { MapPin, Check } from 'lucide-react';
export function VenueDetailPage() {
  const { venueId } = useParams(),
    go = useNavigate(),
    { show } = useToast();
  const { data: v, error, refetch } = useFetch(() => venuesApi.get(venueId), [venueId]);
  const [court, setCourt] = useState(),
    [date, setDate] = useState(new Date().toISOString().slice(0, 10)),
    [slots, setSlots] = useState([]),
    [busy, setBusy] = useState([]),
    [saving, setSaving] = useState(false);
  useEffect(() => {
    if (v && !court) setCourt(v.courts.find((c) => c.isActive)?.id);
  }, [v, court]);
  const range = useMemo(() => {
    const s = new Date(`${date}T00:00:00`);
    const e = new Date(s);
    e.setDate(e.getDate() + 1);
    return { from: s.toISOString(), to: e.toISOString() };
  }, [date]);
  useEffect(() => {
    setSlots([]);
    if (court) courtsApi.bookings(court, range).then(setBusy);
  }, [court, date, range]);
  if (error) return <ErrorState error={error} refetch={refetch} />;
  if (!v) return <p>Memuat venue...</p>;
  const active = v.courts.find((c) => c.id === court);
  const occupied = (h) =>
    busy.some((b) => new Date(b.startTime).getHours() <= h && new Date(b.endTime).getHours() > h);
  const toggle = (h) => {
    if (occupied(h)) return;
    setSlots((x) => {
      if (x.includes(h)) return x.filter((s) => s !== h);
      if (!x.length || h === x[0] - 1 || h === x.at(-1) + 1) {
        const n = [...x, h].sort((a, b) => a - b);
        return n.length <= MAX_BOOKING_HOURS ? n : x;
      }
      return [h];
    });
  };
  const submit = async () => {
    const start = new Date(`${date}T${String(slots[0]).padStart(2, '0')}:00:00`),
      end = new Date(start);
    end.setHours(end.getHours() + slots.length);
    setSaving(true);
    try {
      const b = await bookingsApi.create({
        courtId: court,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
      show('Booking dibuat');
      go(`/bookings/${b.id}`);
    } catch (e) {
      show(e.status === 409 ? 'Slot baru saja dipesan orang lain' : e.message, 'error');
      setSlots([]);
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <PageHeader title={v.name} subtitle={<span className="flex items-center gap-1"><MapPin size={14} />{v.type} · {v.address}, {v.city}</span>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <p className="mb-5 text-sm text-slate-600">{v.description}</p>
          <h2 className="font-semibold">Pilih lapangan</h2>
          <div className="mt-3 space-y-2">
            {v.courts.map((c) => (
              <button
                key={c.id}
                disabled={!c.isActive}
                onClick={() => setCourt(c.id)}
                 className={`flex min-h-16 w-full items-center justify-between rounded-xl border p-4 text-left transition motion-reduce:transition-none ${court === c.id ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-indigo-200'} disabled:opacity-50`}
              >
                <span>
                  {c.name}
                  {!c.isActive && ' · Tidak tersedia'}
                </span>
                 <span className="flex items-center gap-2"><b className="tabular-nums">{rupiah(c.pricePerHour)}/jam</b>{court === c.id && <Check className="text-indigo-600" size={18} />}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <label className="text-xs font-medium text-slate-500">
            Tanggal
            <input
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={date}
              onChange={(e) => setDate(e.target.value)}
               className="mt-1 block h-11 w-full rounded-xl border border-slate-200 px-3 text-base text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:text-sm"
            />
          </label>
          <h2 className="mt-5 font-semibold">Pilih jam</h2>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => OPEN_HOUR + i).map((h) => (
              <button
                key={h}
                disabled={occupied(h)}
                onClick={() => toggle(h)}
                 className={`min-h-11 rounded-xl border text-sm tabular-nums transition motion-reduce:transition-none ${occupied(h) ? 'cursor-not-allowed bg-slate-50 text-slate-400 line-through' : slots.includes(h) ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm' : 'bg-white hover:border-indigo-300'}`}
              >
                {String(h).padStart(2, '0')}:00
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Tersedia · Dipilih · Terisi. Maksimal {MAX_BOOKING_HOURS} jam.
          </p>
          {slots.length > 0 && (
            <div className="sticky bottom-0 z-10 mt-5 border-t bg-white pt-4 text-sm pb-[env(safe-area-inset-bottom)] lg:static lg:bg-transparent lg:pb-0">
              <p>
                {active?.name}, {date}
              </p>
              <p>
                {String(slots[0]).padStart(2, '0')}:00–{String(slots.at(-1) + 1).padStart(2, '0')}
                :00 · {slots.length} jam
              </p>
              <b>{rupiah(active.pricePerHour * slots.length)}</b>
            </div>
          )}
          <Button
            disabled={!slots.length}
            isLoading={saving}
            onClick={submit}
            className="mt-4 w-full"
          >
            Pesan sekarang
          </Button>
          <p className="mt-2 text-xs text-slate-500">Slot dikunci 15 menit setelah dipesan.</p>
        </Card>
      </div>
    </>
  );
}
