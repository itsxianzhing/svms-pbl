import {motion, type MotionValue, useTransform} from 'motion/react';
import {BarChart3, TrendingUp} from 'lucide-react';
import {ILLUSTRATIVE_COURTS, WEEKLY_REVENUE_SERIES} from '../../../constants/svmsData';

interface MockupProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

const MAX_REVENUE = 5280000;

export function DashboardMockup({progress, reducedMotion}: MockupProps) {
  // Whole dashboard moves gently forward toward viewer
  const containerScale = useTransform(progress, [0, 0.55, 0.85], [0.95, 0.99, 1]);
  const containerZ = useTransform(progress, [0, 0.6, 0.85], [-30, 12, 0]);

  // Summary KPI cards appear from separate layer
  const kpiY = useTransform(progress, [0.06, 0.34], [18, 0]);
  const kpiOpacity = useTransform(progress, [0.06, 0.34], [0.25, 1]);

  // Progressive bar chart growth (7 days)
  const bar0 = useTransform(progress, [0.2, 0.5], [0.1, 1]);
  const bar1 = useTransform(progress, [0.24, 0.54], [0.1, 1]);
  const bar2 = useTransform(progress, [0.28, 0.58], [0.1, 1]);
  const bar3 = useTransform(progress, [0.32, 0.62], [0.1, 1]);
  const bar4 = useTransform(progress, [0.36, 0.66], [0.1, 1]);
  const bar5 = useTransform(progress, [0.4, 0.7], [0.1, 1]);
  const bar6 = useTransform(progress, [0.44, 0.74], [0.1, 1]);
  const barScales = [bar0, bar1, bar2, bar3, bar4, bar5, bar6];

  // Popular court progress bars animate horizontally
  const courtBarScale = useTransform(progress, [0.48, 0.82], [0.08, 1]);

  return (
    <div style={{perspective: '1200px'}} className="relative w-full">
      <motion.div
        style={
          reducedMotion
            ? undefined
            : {
                scale: containerScale,
                z: containerZ,
                transformStyle: 'preserve-3d',
              }
        }
        className="rounded-2xl border border-slate-200/90 dark:border-slate-700/70 bg-white dark:bg-[#182235] p-4 sm:p-5 shadow-[0_20px_48px_-18px_rgba(15,23,42,0.14)] dark:shadow-[0_20px_48px_-18px_rgba(0,0,0,0.5)]"
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
                Ringkasan Performa Venue
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Contoh tampilan metrik · Data Ilustratif
              </p>
            </div>
          </div>
          <span className="font-mono text-[11px] font-medium text-indigo-600 dark:text-indigo-400 tabular-nums">
            Minggu Berjalan
          </span>
        </div>

        {/* Summary KPI Strip */}
        <motion.div
          style={reducedMotion ? undefined : {y: kpiY, opacity: kpiOpacity}}
          className="mt-3.5 grid grid-cols-3 gap-2.5"
        >
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-[#F6F7FB] dark:bg-[#1E293B] p-3">
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Total Booking</p>
            <p className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-[#F8FAFC] sm:text-base tabular-nums">
              166 sesi
            </p>
          </div>
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-[#F6F7FB] dark:bg-[#1E293B] p-3">
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Ringkasan Pendapatan</p>
            <p className="mt-1 font-mono text-sm font-bold text-indigo-700 dark:text-indigo-300 sm:text-base tabular-nums">
              Rp 25,6 jt
            </p>
          </div>
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-[#F6F7FB] dark:bg-[#1E293B] p-3">
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Lapangan Aktif</p>
            <p className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-[#F8FAFC] sm:text-base tabular-nums">
              4 unit
            </p>
          </div>
        </motion.div>

        {/* Weekly Revenue Bar Chart + Popular Courts */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-12">
          <div className="sm:col-span-7 rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-[#F6F7FB] dark:bg-[#1E293B] p-3.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Tren Booking Harian (Ilustratif)
              </span>
              <TrendingUp className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            </div>

            <div className="mt-3 flex h-28 items-end justify-between gap-2 pt-2">
              {WEEKLY_REVENUE_SERIES.map((item, idx) => {
                const heightPct = Math.round((item.value / MAX_REVENUE) * 100);
                const isPeak = idx >= 4;
                return (
                  <div
                    key={item.day}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                  >
                    <div className="flex min-h-0 w-full flex-1 items-end">
                      <motion.div
                        style={{
                          height: `${heightPct}%`,
                          scaleY: reducedMotion ? 1 : barScales[idx],
                        }}
                        className={`w-full origin-bottom rounded-t-md ${
                          isPeak
                            ? 'bg-gradient-to-t from-indigo-600 to-violet-500 dark:from-indigo-500 dark:to-violet-400'
                            : 'bg-indigo-300/80 dark:bg-indigo-400/35'
                        }`}
                      />
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular Courts */}
          <div className="sm:col-span-5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-[#F6F7FB] dark:bg-[#1E293B] p-3.5">
            <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
              Lapangan Terpopuler
            </p>
            <div className="mt-3 space-y-2.5">
              {ILLUSTRATIVE_COURTS.slice(0, 3).map((court) => (
                <div key={court.id}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                      {court.name}
                    </span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-[#F8FAFC] tabular-nums">
                      {court.bookingsCount}x
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <motion.div
                      style={{
                        width: `${court.share}%`,
                        scaleX: reducedMotion ? 1 : courtBarScale,
                      }}
                      className="h-full origin-left rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-500 dark:to-violet-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
