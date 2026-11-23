import {motion, type MotionValue, useTransform} from 'motion/react';
import type {ViewportTier} from './transitionConfig';

interface AnimatedConnectionProps {
  progress: MotionValue<number>;
  tier: ViewportTier;
  reducedMotion: boolean;
}

const PULSE_PATHS_DESKTOP = [
  'M 114 6 C 114 112, 355 122, 500 186',
  'M 307 6 C 307 92, 422 128, 500 186',
  'M 500 6 L 500 186',
  'M 693 6 C 693 92, 578 128, 500 186',
  'M 886 6 C 886 112, 645 122, 500 186',
] as const;

export function AnimatedConnection({
  progress,
  tier,
  reducedMotion,
}: AnimatedConnectionProps) {
  const isMobile = tier === 'mobile';

  // Phase 3 (48-75%): traveling connection pulses converge at the hub
  const pulseOffset = useTransform(progress, [0.42, 0.74], [0.14, -1.0]);
  const pulseOpacity = useTransform(progress, [0.42, 0.52, 0.72, 0.8], [0, 0.95, 0.85, 0]);
  const junctionScale = useTransform(progress, [0.48, 0.65, 0.8], [0.5, 1.35, 1]);
  const junctionOpacity = useTransform(progress, [0.46, 0.62, 0.85], [0, 0.45, 0.15]);

  // Phase 4 (68-98%): unified downward trunk extends from SVMS hub into the Solution panel
  const trunkLength = useTransform(progress, [0.64, 0.94], [0, 1]);
  const trunkOpacity = useTransform(progress, [0.62, 0.74], [0, 1]);
  const wedgeOpacity = useTransform(progress, [0.82, 0.98], [0, 1]);
  const wedgeScale = useTransform(progress, [0.82, 0.98], [0.65, 1]);

  if (isMobile) {
    return (
      <g>
        <defs>
          <linearGradient
            id="svms-mobile-trunk-grad"
            x1="180"
            y1="102"
            x2="180"
            y2="176"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
        </defs>

        {/* Static faint track */}
        <path
          d="M 180 102 L 180 176"
          fill="none"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          className="stroke-indigo-300/60 dark:stroke-indigo-500/35"
        />

        {/* Downward trunk connecting Hub to Solution Panel */}
        <motion.path
          d="M 180 102 L 180 176"
          fill="none"
          stroke="url(#svms-mobile-trunk-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={
            reducedMotion
              ? {opacity: 1}
              : {pathLength: trunkLength, opacity: trunkOpacity}
          }
        />

        {/* Entry anchor dot into Solution Panel */}
        <motion.circle
          cx={180}
          cy={172}
          r={4}
          className="fill-indigo-500 dark:fill-indigo-400"
          style={
            reducedMotion
              ? {opacity: 1}
              : {opacity: wedgeOpacity, scale: wedgeScale, transformOrigin: '180px 172px'}
          }
        />
      </g>
    );
  }

  return (
    <g>
      <defs>
        <linearGradient
          id="svms-trunk-grad"
          x1="500"
          y1="186"
          x2="500"
          y2="320"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="65%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>
        <linearGradient
          id="svms-flare-grad"
          x1="500"
          y1="274"
          x2="500"
          y2="320"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0.92" />
        </linearGradient>
      </defs>

      {/* Traveling synchronized energy pulses along converging paths (desktop) */}
      {!reducedMotion &&
        tier === 'desktop' &&
        PULSE_PATHS_DESKTOP.map((d, idx) => (
          <motion.path
            key={`pulse-${idx}`}
            d={d}
            fill="none"
            stroke="#A5B4FC"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="0.14 1.0"
            style={{
              strokeDashoffset: pulseOffset,
              opacity: pulseOpacity,
            }}
          />
        ))}

      {/* Subtle junction ripple behind the hub center */}
      <motion.circle
        cx={500}
        cy={186}
        r={46}
        fill="none"
        strokeWidth="1.25"
        className="stroke-indigo-500/50 dark:stroke-indigo-400/50"
        style={
          reducedMotion
            ? {opacity: 0.25, scale: 1}
            : {
                opacity: junctionOpacity,
                scale: junctionScale,
                transformOrigin: '500px 186px',
              }
        }
      />

      {/* Downward unified stem track */}
      <path
        d="M 500 186 L 500 320"
        fill="none"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        className="stroke-indigo-300/60 dark:stroke-indigo-500/35"
      />

      {/* Downward unified stem extending into the dark Solution panel */}
      <motion.path
        d="M 500 186 L 500 320"
        fill="none"
        stroke="url(#svms-trunk-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        style={
          reducedMotion
            ? {opacity: 1}
            : {pathLength: trunkLength, opacity: trunkOpacity}
        }
      />

      {/* Geometric expanding ribbon anchoring the stem into the dark Solution mask */}
      <motion.path
        d="M 500 282 L 412 320 L 588 320 Z"
        fill="url(#svms-flare-grad)"
        style={
          reducedMotion
            ? {opacity: 0.85, scale: 1, transformOrigin: '500px 282px'}
            : {
                opacity: wedgeOpacity,
                scale: wedgeScale,
                transformOrigin: '500px 282px',
              }
        }
      />

      <motion.circle
        cx={500}
        cy={312}
        r={4.5}
        className="fill-indigo-400"
        style={
          reducedMotion
            ? {opacity: 1}
            : {
                opacity: wedgeOpacity,
                scale: wedgeScale,
                transformOrigin: '500px 312px',
              }
        }
      />
    </g>
  );
}
