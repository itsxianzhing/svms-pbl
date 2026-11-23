import {motion, type MotionValue, useTransform} from 'motion/react';
import type {ViewportTier} from './transitionConfig';

interface SVMSHubRevealProps {
  progress: MotionValue<number>;
  tier: ViewportTier;
  reducedMotion: boolean;
}

export function SVMSHubReveal({
  progress,
  tier,
  reducedMotion,
}: SVMSHubRevealProps) {
  const isMobile = tier === 'mobile';

  // Preserved message emerges subtly as streams form above the hub
  const labelOpacity = useTransform(progress, [0.16, 0.42], [0.25, 1]);
  const labelY = useTransform(progress, [0.16, 0.42], [-8, 0]);

  // Phase 3 (48-75%): SVMS Hub appears, scales gently forward, and settles into position
  const hubScale = useTransform(progress, [0.46, 0.64, 0.78], [0.78, 1.05, 1]);
  const hubOpacity = useTransform(progress, [0.44, 0.62], [0, 1]);
  const ringScale = useTransform(progress, [0.5, 0.76], [0.72, 1.18]);
  const ringOpacity = useTransform(progress, [0.48, 0.64, 0.82], [0, 0.5, 0.15]);

  return (
    <>
      {/* Preserved Transition Message integrated cleanly above the convergence point */}
      <motion.div
        style={
          reducedMotion
            ? undefined
            : {opacity: labelOpacity, y: labelY}
        }
        className="pointer-events-none absolute top-[21%] sm:top-[27%] left-1/2 -translate-x-1/2 z-10 w-max max-w-[90%]"
      >
        <span className="inline-block rounded-lg bg-[#F6F7FB]/92 dark:bg-[#0B1020]/92 px-3 py-1 text-center text-xs font-medium text-slate-600 dark:text-slate-300 backdrop-blur-xs">
          Beralih ke sistem operasional terpusat
        </span>
      </motion.div>

      {/* Central SVMS Hub anchored precisely over (500, 186) / (180, 102) */}
      <div className="pointer-events-none absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
        <motion.div
          style={
            reducedMotion
              ? undefined
              : {scale: hubScale, opacity: hubOpacity}
          }
          className="relative flex items-center justify-center will-change-transform"
        >
          {/* Controlled radial indigo pulse ring */}
          {!reducedMotion && (
            <motion.span
              aria-hidden="true"
              style={{scale: ringScale, opacity: ringOpacity}}
              className={`absolute rounded-2xl border border-indigo-400/60 bg-indigo-500/15 ${
                isMobile ? '-inset-2' : '-inset-2.5'
              }`}
            />
          )}

          {/* Hub Core housing the SVMS court-grid mark */}
          <div
            className={`relative flex items-center gap-2.5 rounded-2xl border border-indigo-300/80 dark:border-indigo-400/45 bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 text-white shadow-[0_14px_34px_-10px_rgba(79,70,229,0.45)] ${
              isMobile ? 'px-3.5 py-2' : 'px-4 py-2.5'
            }`}
          >
            <svg
              width={isMobile ? '22' : '26'}
              height={isMobile ? '22' : '26'}
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="shrink-0"
            >
              <rect width="32" height="32" rx="8" fill="url(#svms-hub-mark-grad)" />
              <rect
                x="7.5"
                y="8.5"
                width="17"
                height="15"
                rx="2.5"
                stroke="#FFFFFF"
                strokeWidth="1.75"
              />
              <line
                x1="16"
                y1="8.5"
                x2="16"
                y2="23.5"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <line
                x1="7.5"
                y1="16"
                x2="24.5"
                y2="16"
                stroke="#E0E7FF"
                strokeWidth="1.5"
              />
              <defs>
                <linearGradient
                  id="svms-hub-mark-grad"
                  x1="0"
                  y1="0"
                  x2="32"
                  y2="32"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4F46E5" />
                  <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>

            <div className="text-left leading-tight">
              <p className="font-display text-xs font-bold tracking-tight text-white sm:text-sm whitespace-nowrap">
                SVMS Hub
              </p>
              <p className="text-[10px] font-medium text-indigo-200 whitespace-nowrap">
                Sistem Terpusat
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
