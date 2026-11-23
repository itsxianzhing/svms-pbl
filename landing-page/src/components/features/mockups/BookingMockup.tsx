import {motion, type MotionValue, useTransform} from 'motion/react';
import {CalendarCheck2, CheckCircle2, Clock, MapPin} from 'lucide-react';

interface MockupProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

const SLOTS = [
  {time: '17:00', status: 'Tersedia'},
  {time: '18:00', status: 'Terisi'},
  {time: '19:00', status: 'Dipilih'},
  {time: '20:00', status: 'Tersedia'},
  {time: '21:00', status: 'Tersedia'},
  {time: '22:00', status: 'Tersedia'},
] as const;

export function BookingMockup({progress, reducedMotion}: MockupProps) {
  // Panel enters from side with subtle 3D rotation and settles front-facing
  const panelRotateY = useTransform(progress, [0, 0.35, 0.78], [-12, -4, 0]);
  const panelRotateX = useTransform(progress, [0, 0.35, 0.78], [5, 2, 0]);
  const panelX = useTransform(progress, [0, 0.32], [28, 0]);

  // Progressive slot appearance
  const slot0Opacity = useTransform(progress, [0.06, 0.22], [0.25, 1]);
  const slot1Opacity = useTransform(progress, [0.12, 0.28], [0.25, 1]);
  const slot2Opacity = useTransform(progress, [0.18, 0.34], [0.25, 1]);
  const slot3Opacity = useTransform(progress, [0.24, 0.4], [0.25, 1]);
  const slot4Opacity = useTransform(progress, [0.28, 0.44], [0.25, 1]);
  const slot5Opacity = useTransform(progress, [0.32, 0.48], [0.25, 1]);
  const slotOpacities = [
    slot0Opacity,
    slot1Opacity,
    slot2Opacity,
    slot3Opacity,
    slot4Opacity,
    slot5Opacity,
  ];

  // Selected slot highlight (19:00)
  const selectedOverlayOpacity = useTransform(progress, [0.34, 0.52], [0, 1]);
  const selectedScale = useTransform(progress, [0.34, 0.48, 0.62], [0.97, 1.04, 1]);

  // Confirmation card emerges from interface in Z-space
  const confirmOpacity = useTransform(progress, [0.52, 0.74], [0, 1]);
  const confirmY = useTransform(progress, [0.52, 0.74], [24, 0]);
  const confirmScale = useTransform(progress, [0.52, 0.74], [0.94, 1]);

  return (
    <div style={{perspective: '1200px'}} className="relative w-full">
      <motion.div
        style={
          reducedMotion
            ? undefined
            : {
                rotateY: panelRotateY,
                rotateX: panelRotateX,
                x: panelX,
                transformStyle: 'preserve-3d',
              }
        }
        className="rounded-2xl border border-slate-200/90 dark:border-slate-700/70 bg-white dark:bg-[#182235] p-4 sm:p-5 shadow-[0_20px_48px_-18px_rgba(15,23,42,0.14)] dark:shadow-[0_20px_48px_-18px_rgba(0,0,0,0.5)]"
      >
        {/* Venue Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Simulasi Alur Booking Pelanggan · Data Ilustratif
            </p>
            <h4 className="mt-0.5 font-display text-sm font-bold text-slate-900 dark:text-[#F8FAFC] sm:text-base">
              GOR Nusantara Arena
            </h4>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
            <span>Court A · Badminton</span>
          </div>
        </div>

        {/* Date & Rate Row */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#F6F7FB] dark:bg-[#1E293B] px-3.5 py-2.5 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <CalendarCheck2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
            <span className="font-medium">Hari Ini · Sesi 1 Jam</span>
          </div>
          <span className="font-mono font-semibold text-slate-900 dark:text-[#F8FAFC] tabular-nums">
            Rp 90.000 / jam
          </span>
        </div>

        {/* Time Slots Grid */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-200">Pilih Slot Jam Tersedia</span>
            <span className="inline-flex items-center gap-1 text-[11px]">
              <Clock className="h-3 w-3" aria-hidden="true" />
              WIB
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-2 sm:gap-2.5">
            {SLOTS.map((slot, idx) => {
              const isTarget = slot.time === '19:00';
              const isBooked = slot.status === 'Terisi';

              return (
                <motion.div
                  key={slot.time}
                  style={
                    reducedMotion
                      ? undefined
                      : {
                          opacity: slotOpacities[idx],
                          scale: isTarget ? selectedScale : 1,
                        }
                  }
                  className={`relative overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    isBooked
                      ? 'border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-[#111827]/70 text-slate-400 dark:text-slate-500'
                      : 'border-slate-200 dark:border-slate-700/70 bg-white dark:bg-[#1E293B] text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {isTarget && (
                    <motion.div
                      aria-hidden="true"
                      style={
                        reducedMotion
                          ? {opacity: 1}
                          : {opacity: selectedOverlayOpacity}
                      }
                      className="absolute inset-0 z-10 bg-indigo-600"
                    />
                  )}
                  <div className="relative z-0 flex items-center justify-between gap-1">
                    <span
                      className={`font-mono text-xs font-bold tabular-nums ${
                        isTarget && reducedMotion
                          ? 'text-white'
                          : isTarget
                            ? 'text-slate-900 dark:text-[#F8FAFC]'
                            : ''
                      }`}
                    >
                      {slot.time}
                    </span>
                  </div>
                  <div className="relative z-0 mt-0.5 flex items-center justify-between">
                    <span
                      className={`text-[10px] ${
                        isBooked
                          ? 'text-slate-400 dark:text-slate-500'
                          : isTarget && reducedMotion
                            ? 'text-indigo-100'
                            : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {isBooked ? 'Sudah terisi' : isTarget ? '19:00 – 20:00' : 'Tersedia'}
                    </span>
                  </div>
                  {isTarget && (
                    <motion.div
                      aria-hidden="true"
                      style={
                        reducedMotion
                          ? {opacity: 1}
                          : {opacity: selectedOverlayOpacity}
                      }
                      className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between px-3 py-2.5 text-white"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-xs font-bold tabular-nums">
                          {slot.time}
                        </span>
                        <span className="text-[10px] font-semibold text-indigo-100">
                          Dipilih
                        </span>
                      </div>
                      <span className="text-[10px] text-indigo-100">19:00 – 20:00</span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Emerging Booking Confirmation Card */}
        <motion.div
          style={
            reducedMotion
              ? undefined
              : {
                  opacity: confirmOpacity,
                  y: confirmY,
                  scale: confirmScale,
                  transform: 'translateZ(24px)',
                }
          }
          className="mt-4 rounded-xl border border-indigo-200 dark:border-indigo-500/35 bg-gradient-to-r from-indigo-50/90 to-violet-50/80 dark:from-indigo-500/15 dark:to-violet-500/15 p-3.5 shadow-sm dark:shadow-none"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
                  Pengajuan Booking Dicatat ke Sistem
                </p>
                <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                  Court A · Badminton · Hari Ini, 19:00 – 20:00 WIB
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Estimasi Tarif</p>
              <p className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 tabular-nums">
                Rp 90.000
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
