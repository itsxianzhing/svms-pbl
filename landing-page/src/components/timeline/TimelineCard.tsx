import {motion, type MotionValue, useTransform} from 'motion/react';
import {
  MessageCircleQuestion,
  MessageSquareText,
  FileSpreadsheet,
  CalendarX2,
  Receipt,
  ClipboardPenLine,
} from 'lucide-react';

interface TimelineCardProps {
  step: string;
  title: string;
  detail: string;
  index: number;
  side: 'left' | 'right';
  progress: MotionValue<number>;
  start: number;
  end: number;
  reducedMotion: boolean;
}

const STEP_ICONS = [
  MessageCircleQuestion,
  MessageSquareText,
  FileSpreadsheet,
  CalendarX2,
  Receipt,
  ClipboardPenLine,
];

export function TimelineCard({
  step,
  title,
  detail,
  index,
  side,
  progress,
  start,
  end,
  reducedMotion,
}: TimelineCardProps) {
  const Icon = STEP_ICONS[index % STEP_ICONS.length];

  // Scroll-synchronized 3D entrance transforms (desktop & tablet/mobile)
  const opacity = useTransform(progress, [start, end], [0.18, 1]);
  const scale = useTransform(progress, [start, end], [0.92, 1]);
  const y = useTransform(progress, [start, end], [28, 0]);
  const z = useTransform(progress, [start, end], [-48, 0]);
  const rotateX = useTransform(progress, [start, end], [10, 0]);
  const rotateY = useTransform(
    progress,
    [start, end],
    [side === 'left' ? 12 : -12, 0]
  );
  const highlightOpacity = useTransform(
    progress,
    [start, start + (end - start) * 0.65, end],
    [0, 1, 0.6]
  );

  return (
    <div style={{perspective: '1000px'}} className="w-full">
      <motion.article
        data-cursor-card="true"
        style={
          reducedMotion
            ? undefined
            : {
                opacity,
                scale,
                y,
                z,
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
        }
        className="group relative rounded-2xl border border-slate-200/90 bg-white dark:border-slate-700/70 dark:bg-[#182235] p-5 shadow-[0_12px_30px_-14px_rgba(15,23,42,0.12)] dark:shadow-none transition-shadow duration-200 hover:border-indigo-200 dark:hover:border-indigo-400/50 hover:shadow-[0_18px_40px_-14px_rgba(79,70,229,0.16)] will-change-transform"
      >
        {/* Subtle active indigo top-border accent when revealed */}
        <motion.div
          aria-hidden="true"
          style={reducedMotion ? {opacity: 0.7} : {opacity: highlightOpacity}}
          className="pointer-events-none absolute inset-x-5 top-0 h-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <span className="font-mono text-[11px] font-semibold tracking-wide text-indigo-600 dark:text-indigo-400 uppercase tabular-nums">
                Langkah {step}
              </span>
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-[#F8FAFC] sm:text-base">
                {title}
              </h3>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
          {detail}
        </p>
      </motion.article>
    </div>
  );
}
