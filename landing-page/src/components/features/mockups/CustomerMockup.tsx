import {motion, type MotionValue, useTransform} from 'motion/react';
import {Users, History, MapPin} from 'lucide-react';
import {ILLUSTRATIVE_CUSTOMERS} from '../../../constants/svmsData';

interface MockupProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

export function CustomerMockup({progress, reducedMotion}: MockupProps) {
  // Layered customer cards slide and rotate subtly into position
  const card0X = useTransform(progress, [0.04, 0.35], [-18, 0]);
  const card1X = useTransform(progress, [0.1, 0.42], [18, 0]);
  const card2X = useTransform(progress, [0.16, 0.48], [-14, 0]);
  const card3X = useTransform(progress, [0.22, 0.54], [14, 0]);

  const card0RotateY = useTransform(progress, [0.04, 0.4], [8, 0]);
  const card1RotateY = useTransform(progress, [0.1, 0.46], [-8, 0]);
  const card2RotateY = useTransform(progress, [0.16, 0.52], [6, 0]);
  const card3RotateY = useTransform(progress, [0.22, 0.58], [-6, 0]);

  const cardOpacities = [
    useTransform(progress, [0.04, 0.28], [0.25, 1]),
    useTransform(progress, [0.1, 0.34], [0.25, 1]),
    useTransform(progress, [0.16, 0.4], [0.25, 1]),
    useTransform(progress, [0.22, 0.46], [0.25, 1]),
  ];

  // Detail customer history panel reveals progressively
  const detailOpacity = useTransform(progress, [0.46, 0.76], [0, 1]);
  const detailY = useTransform(progress, [0.46, 0.76], [18, 0]);

  const xOffsets = [card0X, card1X, card2X, card3X];
  const rotateYs = [card0RotateY, card1RotateY, card2RotateY, card3RotateY];

  return (
    <div style={{perspective: '1200px'}} className="relative w-full">
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-700/70 bg-white dark:bg-[#182235] p-4 sm:p-5 shadow-[0_20px_48px_-18px_rgba(15,23,42,0.14)] dark:shadow-[0_20px_48px_-18px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
              <Users className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
                Direktori Pelanggan &amp; Riwayat Booking
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Catatan penyewa terstruktur · Data Ilustratif
              </p>
            </div>
          </div>
          <span className="font-mono text-[11px] font-medium text-slate-500 dark:text-slate-400 tabular-nums">
            4 profil aktif
          </span>
        </div>

        {/* Layered Customer Profile Grid */}
        <div
          style={{transformStyle: 'preserve-3d'}}
          className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2"
        >
          {ILLUSTRATIVE_CUSTOMERS.map((cust, idx) => {
            const isFeatured = idx === 0;
            return (
              <motion.div
                key={cust.id}
                style={
                  reducedMotion
                    ? undefined
                    : {
                        x: xOffsets[idx],
                        rotateY: rotateYs[idx],
                        opacity: cardOpacities[idx],
                        transformStyle: 'preserve-3d',
                      }
                }
                className={`rounded-xl border p-3 ${
                  isFeatured
                    ? 'border-indigo-200 dark:border-indigo-500/35 bg-indigo-50/50 dark:bg-indigo-500/15'
                    : 'border-slate-200/85 dark:border-slate-700/60 bg-[#F6F7FB] dark:bg-[#1E293B]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-display text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
                      {cust.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      {cust.phone}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 tabular-nums">
                    {cust.totalBookings}x
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between border-t border-slate-200/70 dark:border-slate-700/70 pt-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
                    <span className="truncate">{cust.favoriteCourt}</span>
                  </span>
                  <span className="shrink-0 text-slate-500 dark:text-slate-400">{cust.lastVisit}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Customer Booking History Panel */}
        <motion.div
          style={
            reducedMotion
              ? undefined
              : {opacity: detailOpacity, y: detailY}
          }
          className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-[#F6F7FB] dark:bg-[#1E293B] p-3.5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
              <span className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
                Riwayat Catatan: Komunitas Smash Pagi
              </span>
            </div>
            <span className="font-mono text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 tabular-nums">
              12 booking tercatat
            </span>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <span>Terakhir: Court A · 18:00 – 20:00 (Terkonfirmasi)</span>
            <span>Lapangan rutin: Court A · Badminton</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
