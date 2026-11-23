import {motion, type MotionValue, useMotionValue, useTransform} from 'motion/react';
import {
  Check,
  Clock,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react';
import {
  ILLUSTRATIVE_BOOKINGS,
  ILLUSTRATIVE_COURTS,
  WEEKLY_REVENUE_SERIES,
} from '../../constants/svmsData';

export type WorkflowStageKind =
  | 'venue-setup'
  | 'customer-booking'
  | 'operations-manage'
  | 'business-analytics';

interface WorkflowVisualProps {
  kind: WorkflowStageKind;
  scrollProgress?: MotionValue<number>;
  pointerX?: MotionValue<number>;
  pointerY?: MotionValue<number>;
  isActive: boolean;
  reducedMotion: boolean;
}

const BOOKING_SLOTS = [
  {time: '16:00', state: 'Terisi' as const},
  {time: '17:00', state: 'Tersedia' as const},
  {time: '18:00', state: 'Dipilih' as const},
  {time: '19:00', state: 'Tersedia' as const},
];

const MAX_REVENUE = Math.max(...WEEKLY_REVENUE_SERIES.map((d) => d.value));

export function WorkflowVisual({
  kind,
  scrollProgress,
  pointerX,
  pointerY,
  isActive,
  reducedMotion,
}: WorkflowVisualProps) {
  // Subtle micro-parallax on supporting UI layers when pointer moves on active desktop card
  const fallbackParallax = {x: 0, y: 0};
  const layerShiftX = useParallaxTransform(pointerX, 6, reducedMotion);
  const layerShiftY = useParallaxTransform(pointerY, 4, reducedMotion);

  if (kind === 'venue-setup') {
    const courts = ILLUSTRATIVE_COURTS.slice(0, 2);
    return (
      <motion.div
        style={
          reducedMotion || !pointerX || !pointerY
            ? fallbackParallax
            : {x: layerShiftX, y: layerShiftY}
        }
        className="rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-[#F6F7FB] dark:bg-[#0F172A]/85 p-3.5 will-change-transform"
      >
        <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-semibold">
            <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            Konfigurasi Venue &amp; Tarif
          </span>
          <span>Ilustrasi</span>
        </div>

        <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {courts.map((court, idx) => (
            <motion.div
              key={court.id}
              initial={false}
              animate={
                reducedMotion
                  ? {opacity: 1, y: 0}
                  : {
                      opacity: isActive ? 1 : 0.72,
                      y: isActive ? 0 : idx === 0 ? 4 : 7,
                    }
              }
              transition={{
                duration: 0.4,
                delay: reducedMotion ? 0 : idx * 0.09,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-lg border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-[#1E293B] px-3 py-2"
            >
              <p className="truncate text-xs font-semibold text-slate-900 dark:text-[#F8FAFC]">
                {court.name}
              </p>
              <div className="mt-1 flex items-center justify-between gap-2 text-[11px] tabular-nums">
                <span className="font-medium text-indigo-600 dark:text-indigo-300">
                  {court.rate}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {court.hours}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (kind === 'customer-booking') {
    return (
      <motion.div
        style={
          reducedMotion || !pointerX || !pointerY
            ? fallbackParallax
            : {x: layerShiftX, y: layerShiftY}
        }
        className="rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-[#F6F7FB] dark:bg-[#0F172A]/85 p-3.5 will-change-transform"
      >
        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
            <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            Court A · Badminton
          </span>
          <span>Slot jadwal</span>
        </div>

        <div className="mt-2.5 grid grid-cols-4 gap-1.5">
          {BOOKING_SLOTS.map((slot, idx) => {
            const isChosen = slot.state === 'Dipilih';
            const isTaken = slot.state === 'Terisi';
            return (
              <motion.div
                key={slot.time}
                initial={false}
                animate={
                  reducedMotion
                    ? {opacity: 1, scale: 1}
                    : {
                        opacity: isActive ? 1 : 0.72,
                        scale: isActive && isChosen ? 1.03 : 1,
                      }
                }
                transition={{
                  duration: 0.35,
                  delay: reducedMotion ? 0 : idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`rounded-lg border px-2 py-1.5 text-center transition-colors duration-300 ${
                  isChosen
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-600 text-white shadow-xs'
                    : isTaken
                      ? 'border-slate-200/70 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 text-slate-400 dark:text-slate-500'
                      : 'border-slate-200/90 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-slate-700 dark:text-slate-200'
                }`}
              >
                <p className="font-mono text-[11px] font-bold tabular-nums">
                  {slot.time}
                </p>
                <p
                  className={`mt-0.5 text-[10px] ${
                    isChosen
                      ? 'text-indigo-100'
                      : isTaken
                        ? 'text-slate-400 dark:text-slate-500'
                        : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {slot.state}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg bg-indigo-50/90 dark:bg-indigo-500/15 px-2.5 py-1.5 text-[11px] font-medium text-indigo-700 dark:text-indigo-300">
          <span className="inline-flex items-center gap-1.5 truncate">
            <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">Booking diajukan · 18:00 – 19:00</span>
          </span>
          <span className="shrink-0 text-[10px] opacity-80">Ilustrasi</span>
        </div>
      </motion.div>
    );
  }

  if (kind === 'operations-manage') {
    const rows = ILLUSTRATIVE_BOOKINGS.slice(0, 3);
    return (
      <motion.div
        style={
          reducedMotion || !pointerX || !pointerY
            ? fallbackParallax
            : {x: layerShiftX, y: layerShiftY}
        }
        className="rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-[#F6F7FB] dark:bg-[#0F172A]/85 p-3.5 will-change-transform"
      >
        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            Jadwal &amp; Status Harian
          </span>
          <span>Ilustrasi</span>
        </div>

        <div className="mt-2 space-y-1.5">
          {rows.map((booking, idx) => {
            const isConfirmed = booking.status === 'Terkonfirmasi';
            return (
              <motion.div
                key={booking.id}
                initial={false}
                animate={
                  reducedMotion
                    ? {opacity: 1, x: 0}
                    : {
                        opacity: isActive ? 1 : 0.72,
                        x: isActive ? 0 : 4,
                      }
                }
                transition={{
                  duration: 0.36,
                  delay: reducedMotion ? 0 : idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center justify-between gap-2 rounded-lg border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-[#1E293B] px-2.5 py-1.5 text-[11px]"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-800 dark:text-slate-100">
                    {booking.court}
                  </p>
                  <p className="truncate text-[10px] text-slate-500 dark:text-slate-400 tabular-nums">
                    {booking.timeSlot} · {booking.paymentInfo}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                    isConfirmed
                      ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {booking.status}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Stage 04: Business Analytics
  return (
    <motion.div
      style={
        reducedMotion || !pointerX || !pointerY
          ? fallbackParallax
          : {x: layerShiftX, y: layerShiftY}
      }
      className="rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-[#F6F7FB] dark:bg-[#0F172A]/85 p-3.5 will-change-transform"
    >
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
          <TrendingUp className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          Ringkasan Performa Mingguan
        </span>
        <span className="text-slate-500 dark:text-slate-400">Ilustrasi</span>
      </div>

      {/* Layered KPI summary strip (derived directly from WEEKLY_REVENUE_SERIES & ILLUSTRATIVE_COURTS) */}
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        <motion.div
          initial={false}
          animate={reducedMotion ? {opacity: 1, y: 0} : {opacity: isActive ? 1 : 0.72, y: isActive ? 0 : 4}}
          transition={{duration: 0.35, delay: reducedMotion ? 0 : 0.04, ease: [0.16, 1, 0.3, 1]}}
          className="rounded-lg border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-[#1E293B] px-2 py-1.5"
        >
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Booking</p>
          <p className="font-display text-xs font-bold text-slate-900 dark:text-[#F8FAFC] tabular-nums">
            166 sesi
          </p>
        </motion.div>
        <motion.div
          initial={false}
          animate={reducedMotion ? {opacity: 1, y: 0} : {opacity: isActive ? 1 : 0.72, y: isActive ? 0 : 6}}
          transition={{duration: 0.35, delay: reducedMotion ? 0 : 0.1, ease: [0.16, 1, 0.3, 1]}}
          className="rounded-lg border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-[#1E293B] px-2 py-1.5"
        >
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Pendapatan</p>
          <p className="font-display text-xs font-bold text-slate-900 dark:text-[#F8FAFC] tabular-nums">
            Rp 25,6 jt
          </p>
        </motion.div>
        <motion.div
          initial={false}
          animate={reducedMotion ? {opacity: 1, y: 0} : {opacity: isActive ? 1 : 0.72, y: isActive ? 0 : 8}}
          transition={{duration: 0.35, delay: reducedMotion ? 0 : 0.16, ease: [0.16, 1, 0.3, 1]}}
          className="rounded-lg border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-[#1E293B] px-2 py-1.5"
        >
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Terpadat</p>
          <p className="font-display text-xs font-bold text-indigo-600 dark:text-indigo-300 tabular-nums">
            Court A · 88%
          </p>
        </motion.div>
      </div>

      {/* Progressive animated bar chart */}
      <div className="mt-2 flex h-14 items-end gap-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-[#1E293B] px-2.5 pt-2.5 pb-1.5">
        {WEEKLY_REVENUE_SERIES.map((item, idx) => {
          const heightRatio = Math.max(0.24, item.value / MAX_REVENUE);
          const isPeak = idx >= 4;
          return (
            <div key={item.day} className="flex flex-1 flex-col items-center gap-1 h-full justify-end">
              <div className="relative flex w-full flex-1 items-end">
                <AnalyticsBar
                  heightRatio={heightRatio}
                  index={idx}
                  isPeak={isPeak}
                  isActive={isActive}
                  scrollProgress={scrollProgress}
                  reducedMotion={reducedMotion}
                />
              </div>
              <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function AnalyticsBar({
  heightRatio,
  index,
  isPeak,
  isActive,
  scrollProgress,
  reducedMotion,
}: {
  heightRatio: number;
  index: number;
  isPeak: boolean;
  isActive: boolean;
  scrollProgress?: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const dummyProgress = useMotionValue(1);
  const start = 0.62 + index * 0.025;
  const end = Math.min(0.86, start + 0.14);
  const scrollScaleY = useTransform(
    scrollProgress ?? dummyProgress,
    [start, end],
    [0.18, 1]
  );

  if (scrollProgress && !reducedMotion) {
    return (
      <motion.div
        style={{
          height: `${Math.round(heightRatio * 100)}%`,
          scaleY: scrollScaleY,
        }}
        className={`w-full origin-bottom rounded-t-sm ${
          isPeak
            ? 'bg-indigo-600 dark:bg-indigo-400'
            : 'bg-indigo-200 dark:bg-indigo-500/35'
        }`}
      />
    );
  }

  return (
    <motion.div
      initial={false}
      animate={
        reducedMotion
          ? {scaleY: 1}
          : {scaleY: isActive ? 1 : 0.35}
      }
      transition={{
        duration: 0.45,
        delay: reducedMotion ? 0 : index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{height: `${Math.round(heightRatio * 100)}%`}}
      className={`w-full origin-bottom rounded-t-sm ${
        isPeak
          ? 'bg-indigo-600 dark:bg-indigo-400'
          : 'bg-indigo-200 dark:bg-indigo-500/35'
      }`}
    />
  );
}

function useParallaxTransform(
  axis: MotionValue<number> | undefined,
  maxOffset: number,
  reducedMotion: boolean
) {
  const zeroAxis = useMotionValue(0);
  return useTransform(
    axis ?? zeroAxis,
    [-1, 1],
    reducedMotion ? [0, 0] : [-maxOffset, maxOffset]
  );
}
