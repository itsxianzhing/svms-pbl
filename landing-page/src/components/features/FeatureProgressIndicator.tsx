import {motion, type MotionValue, useTransform} from 'motion/react';
import {SVMS_FEATURES} from '../../constants/svmsData';

interface FeatureProgressIndicatorProps {
  activeIndex: number;
  progress: MotionValue<number>;
  onSelectFeature: (index: number) => void;
  reducedMotion: boolean;
}

const SHORT_LABELS = [
  'Online Booking',
  'Jadwal',
  'Venue & Court',
  'Dashboard',
  'Status & Bayar',
  'Pelanggan',
];

export function FeatureProgressIndicator({
  activeIndex,
  progress,
  onSelectFeature,
  reducedMotion,
}: FeatureProgressIndicatorProps) {
  const barScaleX = useTransform(progress, [0, 1], [0.06, 1]);

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 dark:border-slate-700/70 bg-white/95 dark:bg-[#182235]/95 px-4 py-3 shadow-xs dark:shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Segmented Feature Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {SVMS_FEATURES.map((feature, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => onSelectFeature(idx)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E293B] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span
                  className={`font-mono text-[11px] tabular-nums ${
                    isActive ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  0{idx + 1}
                </span>
                <span className="hidden xl:inline">{SHORT_LABELS[idx]}</span>
              </button>
            );
          })}
        </div>

        {/* Continuous Scroll Progress Indicator */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300 tabular-nums whitespace-nowrap">
            0{activeIndex + 1} / 0{SVMS_FEATURES.length}
          </span>
          <div
            aria-hidden="true"
            className="h-1.5 w-24 sm:w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
          >
            <motion.div
              style={{scaleX: reducedMotion ? 1 : barScaleX}}
              className="h-full origin-left rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
