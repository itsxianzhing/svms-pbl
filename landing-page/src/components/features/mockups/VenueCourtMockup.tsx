import {motion, type MotionValue, useTransform} from 'motion/react';
import {Building2, Clock, CheckCircle2, PauseCircle} from 'lucide-react';
import {ILLUSTRATIVE_COURTS} from '../../../constants/svmsData';

interface MockupProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

export function VenueCourtMockup({progress, reducedMotion}: MockupProps) {
  // Venue bar reveals early
  const headerOpacity = useTransform(progress, [0.05, 0.28], [0.35, 1]);
  const headerY = useTransform(progress, [0.05, 0.28], [12, 0]);

  // Layered 3D court cards separate in depth then organize into a clean 2x2 grid
  const card0Z = useTransform(progress, [0.1, 0.45, 0.8], [-20, 26, 0]);
  const card1Z = useTransform(progress, [0.15, 0.5, 0.8], [-35, 18, 0]);
  const card2Z = useTransform(progress, [0.2, 0.55, 0.8], [-45, 14, 0]);
  const card3Z = useTransform(progress, [0.25, 0.6, 0.8], [-55, 10, 0]);

  const card0Y = useTransform(progress, [0.08, 0.5, 0.8], [24, -6, 0]);
  const card1Y = useTransform(progress, [0.12, 0.55, 0.8], [32, -4, 0]);
  const card2Y = useTransform(progress, [0.18, 0.6, 0.8], [38, 4, 0]);
  const card3Y = useTransform(progress, [0.22, 0.65, 0.8], [44, 6, 0]);

  const cardRotateX = useTransform(progress, [0.08, 0.48, 0.82], [12, 6, 0]);
  const infoOpacity = useTransform(progress, [0.32, 0.6], [0.2, 1]);

  const zValues = [card0Z, card1Z, card2Z, card3Z];
  const yValues = [card0Y, card1Y, card2Y, card3Y];

  return (
    <div style={{perspective: '1200px'}} className="relative w-full">
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-700/70 bg-white dark:bg-[#182235] p-4 sm:p-5 shadow-[0_20px_48px_-18px_rgba(15,23,42,0.14)] dark:shadow-[0_20px_48px_-18px_rgba(0,0,0,0.5)]">
        {/* Venue Profile Bar */}
        <motion.div
          style={reducedMotion ? undefined : {opacity: headerOpacity, y: headerY}}
          className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3.5"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
              <Building2 className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
                Profil Venue &amp; Daftar Lapangan
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                GOR Nusantara Arena · 4 unit terdaftar · Data Ilustratif
              </p>
            </div>
          </div>

          <span className="font-mono text-[11px] font-medium text-indigo-700 dark:text-indigo-300 tabular-nums">
            06:00 – 24:00 WIB
          </span>
        </motion.div>

        {/* 2x2 Court Cards Grid with Z-depth Separation */}
        <div
          style={{transformStyle: 'preserve-3d'}}
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {ILLUSTRATIVE_COURTS.map((court, idx) => (
            <motion.div
              key={court.id}
              style={
                reducedMotion
                  ? undefined
                  : {
                      z: zValues[idx],
                      y: yValues[idx],
                      rotateX: cardRotateX,
                      transformStyle: 'preserve-3d',
                    }
              }
              className="rounded-xl border border-slate-200/90 dark:border-slate-700/60 bg-[#F6F7FB] dark:bg-[#1E293B] p-3.5 shadow-xs dark:shadow-none"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-semibold tracking-wide text-indigo-600 dark:text-indigo-400 uppercase">
                    {court.category}
                  </span>
                  <h5 className="mt-0.5 font-display text-xs font-bold text-slate-900 dark:text-[#F8FAFC] sm:text-sm">
                    {court.name}
                  </h5>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                    court.available
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {court.available ? (
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <PauseCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {court.available ? 'Aktif' : 'Perawatan'}
                </span>
              </div>

              <motion.div
                style={reducedMotion ? undefined : {opacity: infoOpacity}}
                className="mt-3 flex items-center justify-between border-t border-slate-200/70 dark:border-slate-700/70 pt-2.5 text-[11px]"
              >
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                  {court.rate}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {court.hours}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
