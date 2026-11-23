import { useFetch } from '@/hooks/useFetch';
import { adminApi } from '../api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { rupiah } from '@/lib/format';
import { BarChart3, CalendarCheck, Clock3, WalletCards } from 'lucide-react';
export function DashboardPage() {
  const { data } = useFetch(adminApi.summary, []);
  if (!data) return <p>Memuat dashboard...</p>;
  const topCourts = data.topCourts || [];
  const highestRevenue = Math.max(0, ...topCourts.map((court) => Number(court.totalRevenue ?? 0)));
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Ringkasan performa bisnis Anda." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ['Total pendapatan', rupiah(data.totalRevenue), WalletCards, 'bg-indigo-50 text-indigo-600'],
          ['Total booking', data.totalBookings, CalendarCheck, 'bg-sky-50 text-sky-600'],
          ['Booking hari ini', data.todayBookings, BarChart3, 'bg-violet-50 text-violet-600'],
          ['Menunggu pembayaran', data.pendingBookings, Clock3, 'bg-amber-50 text-amber-600'],
        ].map(([label, value, Icon, tone]) => (
          <Card key={label}><span className={`mb-4 flex size-10 items-center justify-center rounded-xl ${tone}`}><Icon size={19} /></span><p className="text-xs font-medium text-slate-500">{label}</p><b className="mt-1 block text-2xl tabular-nums tracking-tight">{value}</b>
          </Card>
        ))}
      </div>
      <Card className="mt-5">
         <h2 className="font-semibold">Performa lapangan</h2>
         {topCourts.map((c) => {
           const revenue = Number(c.totalRevenue ?? 0);
           const percentage = highestRevenue > 0 ? Math.min(100, Math.max(0, (revenue / highestRevenue) * 100)) : 0;
           return <div className="mt-5" key={c.courtId}><div className="flex justify-between gap-3 text-sm"><span className="min-w-0 truncate font-medium">{c.courtName} <span className="font-normal text-slate-500">· {c.venueName}</span></span><span className="shrink-0 tabular-nums text-slate-500">{c.totalBookings} booking</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-indigo-600 transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${percentage}%` }} /></div><p className="mt-1 text-xs text-slate-500">{rupiah(revenue)}</p></div>;
         })}
      </Card>
    </>
  );
}
