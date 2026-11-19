import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { bookingsApi } from '../api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge } from '@/components/ui/Badge';
import { DataRow } from '@/components/ui/DataRow';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { rupiah, dateTime, duration } from '@/lib/format';
import { STATUS_META, PAYMENT_METHODS, ROLES } from '@/config/constants';
import { useAuth } from '@/context/AuthContext';
import { useCountdown } from '@/hooks/useCountdown';
import { useToast } from '@/context/ToastContext';
import { QrCode, Landmark, Wallet } from 'lucide-react';
export function BookingDetailPage() {
  const { bookingId } = useParams(), go = useNavigate(), { user } = useAuth(), { show } = useToast();
  const { data: b, refetch } = useFetch(() => bookingsApi.get(bookingId), [bookingId]);
  const [method, setMethod] = useState('QRIS'), [confirm, setConfirm] = useState(false), [loading, setLoading] = useState(false);
  const count = useCountdown(b?.expiresAt); if (!b) return <p>Memuat booking...</p>;
  const pay = async () => { setLoading(true); try { await bookingsApi.pay(b.id, { method }); show('Pembayaran diterima, booking terkonfirmasi'); refetch(); } catch (e) { show(e.message, 'error'); refetch(); } finally { setLoading(false); } };
  const cancel = async () => { setLoading(true); try { await bookingsApi.cancel(b.id); show('Booking dibatalkan'); refetch(); } catch (e) { show(e.message, 'error'); } finally { setLoading(false); setConfirm(false); } };
  return <><Button variant="ghost" onClick={() => go(user.role === ROLES.ADMIN ? '/admin/bookings' : '/my-bookings')}>← Kembali</Button><Card className="mt-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-medium text-slate-500">Booking</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">#{b.id}</h1></div><Badge className={STATUS_META[b.status].className}>{STATUS_META[b.status].label}</Badge></div><dl className="mt-6 grid gap-4 sm:grid-cols-2"><DataRow label="Venue">{b.venue.name}</DataRow><DataRow label="Court">{b.court.name}</DataRow><DataRow label="Jadwal">{dateTime(b.startTime)}</DataRow><DataRow label="Durasi">{duration(b.startTime, b.endTime)}</DataRow><DataRow label="Dibuat">{dateTime(b.createdAt)}</DataRow><DataRow label="Total"><span className="text-lg tabular-nums">{rupiah(b.totalPrice)}</span></DataRow>{user.role === ROLES.ADMIN && <DataRow label="Pemesan">{b.user.name} ({b.user.email})</DataRow>}</dl>{b.status === 'PENDING' && <div className="mt-6 rounded-2xl bg-amber-50 p-5"><div className="flex items-end justify-between gap-3"><div><p className="text-sm font-medium text-amber-800">Sisa waktu pembayaran</p><b className="mt-1 block text-4xl tabular-nums tracking-tight text-amber-900">{count.text}</b></div><span className="text-xs text-amber-700">Simulasi pembayaran</span></div><ProgressBar value={count.expired ? 0 : 60} className="mt-4 bg-amber-100" />{count.expired ? <p className="mt-3 text-sm text-rose-700">Waktu pembayaran habis, slot dilepas</p> : user.id === b.user.id && <div><p className="mt-5 text-xs font-medium text-amber-800">Metode pembayaran</p>{PAYMENT_METHODS.map(([v, l], i) => <label className={`mt-2 flex min-h-12 items-center gap-3 rounded-xl border bg-white px-3 text-sm ${method === v ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-amber-100'}`} key={v}><input className="size-4 accent-indigo-600" type="radio" checked={method === v} onChange={() => setMethod(v)} />{i === 0 ? <QrCode size={18} /> : i === 1 ? <Landmark size={18} /> : <Wallet size={18} />}{l}</label>)}<Button isLoading={loading} onClick={pay} className="mt-4 w-full sm:w-auto">Bayar sekarang</Button></div>}</div>}{b.status === 'CONFIRMED' && <p className="mt-6 rounded-xl bg-sky-50 p-4 text-sm text-sky-800">Pembayaran diterima, booking terkonfirmasi.</p>}{b.status === 'CANCELLED' && <p className="mt-6 text-sm text-rose-700">Booking dibatalkan.</p>}{b.status !== 'CANCELLED' && new Date(b.endTime) > new Date() && <Button variant="ghost" className="mt-5 text-rose-600 hover:bg-rose-50" onClick={() => setConfirm(true)}>Batalkan booking</Button>}</Card><ConfirmDialog open={confirm} onClose={() => setConfirm(false)} onConfirm={cancel} isLoading={loading} title="Batalkan booking" message={`Batalkan booking di ${b.venue.name}?`} /></>;
}
