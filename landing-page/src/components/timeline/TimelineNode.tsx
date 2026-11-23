import {motion, type MotionValue, useTransform} from 'motion/react';

interface TimelineNodeProps {
  step: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  reducedMotion: boolean;
}

export function TimelineNode({
  step,
  progress,
  start,
  end,
  reducedMotion,
}: TimelineNodeProps) {
  const mid = start + (end - start) * 0.55;

  const activeOpacity = useTransform(progress, [start, mid], [0, 1]);
  const nodeScale = useTransform(progress, [start, mid, end], [0.88, 1.12, 1]);
  const ringScale = useTransform(progress, [start, mid, end], [0.8, 1.45, 1.18]);
  const ringOpacity = useTransform(progress, [start, mid, end], [0, 0.55, 0.2]);

  return (
    <div className="relative flex h-10 w-10 items-center justify-center">
      {/* Subtle activation halo ring */}
      <motion.span
        aria-hidden="true"
        style={
          reducedMotion
            ? {opacity: 0.2, scale: 1.15}
            : {scale: ringScale, opacity: ringOpacity}
        }
        className="pointer-events-none absolute inset-0 rounded-full border-2 border-indigo-500/60 bg-indigo-500/10"
      />

      {/* Base inactive node */}
      <motion.div
        style={reducedMotion ? undefined : {scale: nodeScale}}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-300 bg-white dark:border-slate-700 dark:bg-[#182235] font-mono text-xs font-bold text-slate-400 shadow-xs tabular-nums"
      >
        <span>{step}</span>

        {/* Active indigo/violet overlay */}
        <motion.div
          aria-hidden="true"
          style={reducedMotion ? {opacity: 1} : {opacity: activeOpacity}}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm"
        >
          <span>{step}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
