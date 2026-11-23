import {motion, type MotionValue, useTransform} from 'motion/react';
import {CheckCircle2, Clock, ReceiptText} from 'lucide-react';
import {ILLUSTRATIVE_BOOKINGS} from '../../../constants/svmsData';

interface MockupProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export function StatusPaymentMockup({progress, reducedMotion}: MockupProps) {
  const rows = ILLUSTRATIVE_BOOKINGS.slice(0, 4);

  // Staggered row entrances
  const row0Opacity = useTransform(progress, [0.05, 0.25], [0.2, 1]);
  const row0Y = useTransform(progress, [0.05, 0.25], [16, 0]);

  const row1Opacity = useTransform(progress, [0.14, 0.34], [0.2, 1]);
  const row1Y = useTransform(progress, [0.14, 0.34], [18, 0]);

  const row2Opacity = useTransform(progress, [0.22, 0.42], [0.2, 1]);
  const row2Y = useTransform(progress, [0.22, 0.42], [20, 0]);

  const row3Opacity = useTransform(progress, [0.3, 0.5], [0.2, 1]);
  const row3Y = useTransform(progress, [0.3, 0.5], [22, 0]);

  const rowOpacities = [row0Opacity, row1Opacity, row2Opacity, row3Opacity];
  const rowYs = [row0Y, row1Y, row2Y, row3Y];

  // Status transition highlight on row 2 (BK-2402) + summary panel emergence
  const transitionOpacity = useTransform(progress, [0.46, 0.7], [0, 1]);
  const summaryY = useTransform(progress, [0.54, 0.78], [18, 0]);
  const summaryOpacity = useTransform(progress, [0.54, 0.78], [0, 1]);

  return (
    <div style={{perspective: '1200px'}} className="relative w-full">
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-700/70 bg-white dark:bg-[#182235] p-4 sm:p-5 shadow-[0_20px_48px_-18px_rgba(15,23,42,0.14)] dark:shadow-[0_20px_48px_-18px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
              <ReceiptText className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
                Daftar Status Booking &amp; Informasi Pembayaran
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pelacakan administrasi harian · Data Ilustratif
              </p>
            </div>
          </div>
          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
            4 catatan
          </span>
        </div>

        {/* Staggered Status Rows */}
        <div className="mt-4 space-y-2.5">
          {rows.map((booking, idx) => {
            const isPendingRow = booking.status === 'Menunggu';
            const isCompleted = booking.status === 'Selesai';

            return (
              <motion.div
                key={booking.id}
                style={
                  reducedMotion
                    ? undefined
                    : {opacity: rowOpacities[idx], y: rowYs[idx]}
                }
                className="relative flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/85 dark:border-slate-700/60 bg-[#F6F7FB] dark:bg-[#1E293B] px-3.5 py-2.5 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 tabular-nums">
                      {booking.id}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">
                      ·
                    </span>
                    <span className="truncate font-semibold text-slate-900 dark:text-[#F8FAFC]">
                      {booking.customer}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {booking.court} · {booking.timeSlot}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-slate-900 dark:text-[#F8FAFC] tabular-nums">
                      {formatRupiah(booking.amount)}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {booking.paymentInfo}
                    </p>
                  </div>

                  {/* Status Label paired with explicit icon */}
                  <div className="relative">
                    <span
                      className={`inline-flex min-w-[112px] items-center justify-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                        isPendingRow
                          ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                          : isCompleted
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            : 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                      }`}
                    >
                      {isPendingRow ? (
                        <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                      ) : (
                        <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
                      )}
                      {booking.status}
                    </span>

                    {isPendingRow && !reducedMotion && (
                      <motion.span
                        style={{opacity: transitionOpacity}}
                        className="absolute inset-0 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-emerald-200 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/90 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300"
                      >
                        <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
                        Terkonfirmasi
                      </motion.span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Summary Ledger Footer */}
        <motion.div
          style={
            reducedMotion
              ? undefined
              : {y: summaryY, opacity: summaryOpacity}
          }
          className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-200/80 dark:border-indigo-500/30 bg-indigo-50/70 dark:bg-indigo-500/15 px-3.5 py-2.5 text-xs"
        >
          <span className="font-medium text-slate-700 dark:text-slate-200">
            Status Pembayaran Terpantau: Lunas, DP 50%, &amp; Menunggu Verifikasi
          </span>
          <span className="font-mono text-[11px] font-bold text-indigo-700 dark:text-indigo-300 tabular-nums">
            Catatan Rapi
          </span>
        </motion.div>
      </div>
    </div>
  );
}
