import {motion, type MotionValue, useTransform} from 'motion/react';
import {MessageSquareWarning} from 'lucide-react';

interface TimelineProgressProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

export function TimelineProgress({progress, reducedMotion}: TimelineProgressProps) {
  const barScaleX = useTransform(progress, [0, 1], [reducedMotion ? 1 : 0.04, 1]);

  return (
    <div className="flex flex-col gap-3 pb-5 border-b border-slate-200/80 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
        <MessageSquareWarning className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
        <span>Alur Kerja Manual yang Terfragmentasi</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
          6 langkah berulang untuk setiap booking
        </span>
        <div
          aria-hidden="true"
          className="h-1.5 w-24 sm:w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        >
          <motion.div
            style={{scaleX: reducedMotion ? 1 : barScaleX}}
            className="h-full origin-left rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
          />
        </div>
      </div>
    </div>
  );
}
