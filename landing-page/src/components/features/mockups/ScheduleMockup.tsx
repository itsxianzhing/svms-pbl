import {motion, type MotionValue, useTransform} from 'motion/react';
import {Calendar, CheckCircle2, Clock} from 'lucide-react';

interface MockupProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

const COURTS = ['Court A', 'Court B', 'Futsal 1'];
const HOURS = ['16:00', '18:00', '19:00', '20:00'];

export function ScheduleMockup({progress, reducedMotion}: MockupProps) {
  // Subtle 3D rotation of calendar board settling into position
  const boardRotateX = useTransform(progress, [0, 0.45, 0.85], [10, 4, 0]);
  const boardRotateY = useTransform(progress, [0, 0.45, 0.85], [8, 2, 0]);

  const headerX = useTransform(progress, [0.02, 0.25], [-20, 0]);
  const headerOpacity = useTransform(progress, [0.02, 0.25], [0.3, 1]);

  // Staggered booking blocks
  const block1Opacity = useTransform(progress, [0.16, 0.34], [0, 1]);
  const block1Y = useTransform(progress, [0.16, 0.34], [14, 0]);

  const block2Opacity = useTransform(progress, [0.26, 0.44], [0, 1]);
  const block2Y = useTransform(progress, [0.26, 0.44], [14, 0]);

  const block3Opacity = useTransform(progress, [0.34, 0.52], [0, 1]);
  const block3Y = useTransform(progress, [0.34, 0.52], [14, 0]);

  const block4Opacity = useTransform(progress, [0.42, 0.6], [0, 1]);
  const block4Y = useTransform(progress, [0.42, 0.6], [14, 0]);

  // Highlighted selected booking detail bar
  const detailOpacity = useTransform(progress, [0.56, 0.78], [0, 1]);
  const detailY = useTransform(progress, [0.56, 0.78], [16, 0]);

  return (
    <div style={{perspective: '1200px'}} className="relative w-full">
      <motion.div
        style={
          reducedMotion
            ? undefined
            : {
                rotateX: boardRotateX,
                rotateY: boardRotateY,
                transformStyle: 'preserve-3d',
              }
        }
        className="rounded-2xl border border-slate-200/90 dark:border-slate-700/70 bg-white dark:bg-[#182235] p-4 sm:p-5 shadow-[0_20px_48px_-18px_rgba(15,23,42,0.14)] dark:shadow-[0_20px_48px_-18px_rgba(0,0,0,0.5)]"
      >
        {/* Calendar Header */}
        <motion.div
          style={reducedMotion ? undefined : {x: headerX, opacity: headerOpacity}}
          className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3.5"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
              <Calendar className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
                Kalender Jadwal Operasional
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sinkronisasi lintas lapangan · Data Ilustratif
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-xs bg-emerald-600 dark:bg-emerald-400" aria-hidden="true" />
              Terkonfirmasi
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-xs bg-amber-500 dark:bg-amber-400" aria-hidden="true" />
              Menunggu
            </span>
          </div>
        </motion.div>

        {/* Court Columns Matrix */}
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-700/70 bg-[#F6F7FB] dark:bg-[#111827]">
          <div className="grid grid-cols-12 border-b border-slate-200/80 dark:border-slate-700/70 bg-white/80 dark:bg-[#1E293B] px-3 py-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <div className="col-span-3">Jam</div>
            {COURTS.map((court) => (
              <div key={court} className="col-span-3 text-center">
                {court}
              </div>
            ))}
          </div>

          <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="grid grid-cols-12 items-center gap-1.5 px-3 py-2.5 text-[11px]"
              >
                <div className="col-span-3 font-mono font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                  {hour}
                </div>

                {/* Court A Column */}
                <div className="col-span-3">
                  {hour === '18:00' ? (
                    <motion.div
                      style={
                        reducedMotion
                          ? undefined
                          : {opacity: block2Opacity, y: block2Y}
                      }
                      className="rounded-lg border border-indigo-300 dark:border-indigo-400/50 bg-indigo-600 px-2 py-1.5 text-white shadow-xs"
                    >
                      <p className="truncate font-semibold">Smash Pagi</p>
                      <p className="text-[10px] text-indigo-100">Terkonfirmasi</p>
                    </motion.div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-700/70 bg-white/60 dark:bg-[#182235]/60 px-2 py-1.5 text-center text-[10px] text-slate-400 dark:text-slate-500">
                      Kosong
                    </div>
                  )}
                </div>

                {/* Court B Column */}
                <div className="col-span-3">
                  {hour === '16:00' ? (
                    <motion.div
                      style={
                        reducedMotion
                          ? undefined
                          : {opacity: block1Opacity, y: block1Y}
                      }
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-2 py-1.5 text-slate-800 dark:text-slate-200 shadow-xs dark:shadow-none"
                    >
                      <p className="truncate font-semibold">Bagas &amp; Tim</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Selesai</p>
                    </motion.div>
                  ) : hour === '20:00' ? (
                    <motion.div
                      style={
                        reducedMotion
                          ? undefined
                          : {opacity: block4Opacity, y: block4Y}
                      }
                      className="rounded-lg border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/15 px-2 py-1.5 text-emerald-900 dark:text-emerald-200"
                    >
                      <p className="truncate font-semibold">Padel Senja</p>
                      <p className="text-[10px] text-emerald-700 dark:text-emerald-300">Terkonfirmasi</p>
                    </motion.div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-700/70 bg-white/60 dark:bg-[#182235]/60 px-2 py-1.5 text-center text-[10px] text-slate-400 dark:text-slate-500">
                      Kosong
                    </div>
                  )}
                </div>

                {/* Futsal 1 Column */}
                <div className="col-span-3">
                  {hour === '19:00' ? (
                    <motion.div
                      style={
                        reducedMotion
                          ? undefined
                          : {opacity: block3Opacity, y: block3Y}
                      }
                      className="rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/15 px-2 py-1.5 text-amber-900 dark:text-amber-200"
                    >
                      <p className="truncate font-semibold">Raka Pratama</p>
                      <p className="text-[10px] text-amber-700 dark:text-amber-300">Menunggu</p>
                    </motion.div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-700/70 bg-white/60 dark:bg-[#182235]/60 px-2 py-1.5 text-center text-[10px] text-slate-400 dark:text-slate-500">
                      Kosong
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Booking Highlight Strip */}
        <motion.div
          style={
            reducedMotion
              ? undefined
              : {
                  opacity: detailOpacity,
                  y: detailY,
                  transform: 'translateZ(20px)',
                }
          }
          className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-indigo-200 dark:border-indigo-500/35 bg-indigo-50/70 dark:bg-indigo-500/15 px-3.5 py-2.5 text-xs"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
            <span className="font-semibold text-slate-900 dark:text-[#F8FAFC]">
              BK-2401 · Komunitas Smash Pagi
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-mono tabular-nums">
            <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <span>Court A · 18:00 – 20:00 · Terkonfirmasi</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
