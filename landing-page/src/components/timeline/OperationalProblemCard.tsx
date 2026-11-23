import {motion, type MotionValue, useTransform} from 'motion/react';
import {AlertTriangle} from 'lucide-react';

interface OperationalProblemCardProps {
  title: string;
  description: string;
  index: number;
  progress: MotionValue<number>;
  handoffProgress?: MotionValue<number>;
  reducedMotion: boolean;
}

export function OperationalProblemCard({
  title,
  description,
  index,
  progress,
  handoffProgress,
  reducedMotion,
}: OperationalProblemCardProps) {
  const start = index * 0.12;
  const end = Math.min(start + 0.42, 0.96);

  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const scale = useTransform(progress, [start, end], [0.94, 1]);
  const y = useTransform(progress, [start, end], [24, 0]);
  const rotateX = useTransform(progress, [start, end], [10, 0]);

  // Phase 1 (0–22% of transition): subtle staggered warning emphasis + detached fragments
  const fragStart = index * 0.025;
  const fragPeak = fragStart + 0.14;
  const fragSettle = fragStart + 0.28;

  const badgeGlowOpacity = useTransform(
    handoffProgress ?? progress,
    handoffProgress ? [fragStart, fragPeak, fragSettle] : [0, 1],
    handoffProgress ? [0, 1, 0.35] : [0, 0]
  );
  const badgeScale = useTransform(
    handoffProgress ?? progress,
    handoffProgress ? [fragStart, fragPeak, fragSettle] : [0, 1],
    handoffProgress ? [1, 1.08, 1] : [1, 1]
  );
  const fragmentOpacity = useTransform(
    handoffProgress ?? progress,
    handoffProgress ? [fragStart, fragPeak] : [0, 1],
    handoffProgress ? [0, 1] : [0, 0]
  );
  const fragmentY = useTransform(
    handoffProgress ?? progress,
    handoffProgress ? [fragStart, fragSettle] : [0, 1],
    handoffProgress ? [-4, 6] : [0, 0]
  );

  return (
    <div style={{perspective: '900px'}} className="relative h-full">
      <motion.div
        data-cursor-card="true"
        style={
          reducedMotion
            ? undefined
            : {
                opacity,
                scale,
                y,
                rotateX,
                transformStyle: 'preserve-3d',
              }
        }
        className="relative flex h-full flex-col justify-between rounded-2xl border border-rose-200/80 bg-white dark:border-rose-500/25 dark:bg-[#182235] p-4 sm:p-5 shadow-[0_10px_24px_-14px_rgba(225,29,72,0.12)] dark:shadow-none transition-shadow duration-200 hover:-translate-y-0.5 hover:border-rose-300 dark:hover:border-rose-400/45 hover:shadow-[0_14px_30px_-12px_rgba(225,29,72,0.18)] will-change-transform"
      >
        <div>
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
            <motion.div
              style={reducedMotion || !handoffProgress ? undefined : {scale: badgeScale}}
              className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
            >
              {!reducedMotion && handoffProgress && (
                <motion.span
                  aria-hidden="true"
                  style={{opacity: badgeGlowOpacity}}
                  className="pointer-events-none absolute -inset-1 rounded-xl border border-rose-400/60 bg-rose-500/10 dark:border-rose-400/50 dark:bg-rose-400/10"
                />
              )}
              <AlertTriangle className="relative h-3.5 w-3.5" aria-hidden="true" />
            </motion.div>
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
              {title}
            </h3>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>
      </motion.div>

      {/* Subtle geometric fragments emerging beneath each card in Phase 1 */}
      {!reducedMotion && handoffProgress && (
        <motion.div
          aria-hidden="true"
          style={{opacity: fragmentOpacity, y: fragmentY}}
          className="pointer-events-none hidden lg:flex flex-col items-center gap-1 pt-1.5"
        >
          <span className="h-2 w-px bg-rose-400/70 dark:bg-rose-400/60" />
          <span className="h-1.5 w-1.5 rotate-45 border border-rose-400/80 bg-rose-100 dark:bg-rose-500/30" />
        </motion.div>
      )}
    </div>
  );
}
