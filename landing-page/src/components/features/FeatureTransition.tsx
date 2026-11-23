import {useRef} from 'react';
import {motion, useScroll, useSpring, useTransform} from 'motion/react';
import {ArrowDown, Layers} from 'lucide-react';
import {SECTION_SPRING} from '../transitions/transitionConfig';
import {useScrollTransitionContext} from '../transitions/ScrollTransitionManager';

export function FeatureTransition() {
  const ref = useRef<HTMLDivElement | null>(null);
  const {tier, reducedMotion} = useScrollTransitionContext();
  const isMobile = tier === 'mobile';

  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start 92%', 'end 40%'],
  });
  const smooth = useSpring(scrollYProgress, SECTION_SPRING);

  const backPlateScale = useTransform(smooth, [0, 1], [0.94, 1.03]);
  const backPlateY = useTransform(smooth, [0, 1], [14, -6]);
  const frontCardY = useTransform(smooth, [0, 1], [16, 0]);
  const frontCardOpacity = useTransform(smooth, [0, 0.5], [0.45, 1]);

  return (
    <div
      ref={ref}
      style={{perspective: isMobile || reducedMotion ? undefined : '1200px'}}
      className="relative mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8"
    >
      {/* Subtle 3D layered foundation separating gently on scroll */}
      <motion.div
        aria-hidden="true"
        style={
          reducedMotion
            ? undefined
            : {scale: backPlateScale, y: backPlateY}
        }
        className="pointer-events-none mx-4 -mb-3 h-4 rounded-t-2xl border border-b-0 border-indigo-200/70 dark:border-indigo-500/25 bg-indigo-50/70 dark:bg-indigo-950/60 will-change-transform"
      />

      <motion.div
        style={
          reducedMotion
            ? undefined
            : {y: frontCardY, opacity: frontCardOpacity}
        }
        className="relative flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200/90 dark:border-slate-700/70 bg-white dark:bg-[#182235] px-6 py-4 text-center shadow-xs dark:shadow-none sm:flex-row sm:text-left will-change-transform"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
            <Layers className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC] sm:text-sm">
              Keenam modul bekerja dalam satu alur data yang saling terhubung
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lanjutkan gulir untuk melihat bagaimana lapisan operasional SVMS tersusun.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap shrink-0">
          <span>Arsitektur Operasional</span>
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
      </motion.div>
    </div>
  );
}
