import {motion, type MotionValue, useTransform} from 'motion/react';
import type {ViewportTier} from './transitionConfig';

interface ConvergencePathsProps {
  progress: MotionValue<number>;
  tier: ViewportTier;
  reducedMotion: boolean;
}

const DESKTOP_STREAMS = [
  {
    id: 'stream-double-booking',
    xStart: 114,
    d: 'M 114 6 C 114 112, 355 122, 500 186',
    drawStart: 0.14,
    drawEnd: 0.48,
    gradId: 'svms-stream-grad-outer-l',
  },
  {
    id: 'stream-repetitive-admin',
    xStart: 307,
    d: 'M 307 6 C 307 92, 422 128, 500 186',
    drawStart: 0.18,
    drawEnd: 0.5,
    gradId: 'svms-stream-grad-inner-l',
  },
  {
    id: 'stream-manual-payment',
    xStart: 500,
    d: 'M 500 6 L 500 186',
    drawStart: 0.2,
    drawEnd: 0.52,
    gradId: 'svms-stream-grad-center',
  },
  {
    id: 'stream-scattered-data',
    xStart: 693,
    d: 'M 693 6 C 693 92, 578 128, 500 186',
    drawStart: 0.18,
    drawEnd: 0.5,
    gradId: 'svms-stream-grad-inner-r',
  },
  {
    id: 'stream-no-data',
    xStart: 886,
    d: 'M 886 6 C 886 112, 645 122, 500 186',
    drawStart: 0.14,
    drawEnd: 0.48,
    gradId: 'svms-stream-grad-outer-r',
  },
] as const;

const MOBILE_STREAMS = [
  {id: 'm-0', d: 'M 56 4 C 56 54, 132 68, 180 102', start: 0.12, end: 0.48},
  {id: 'm-1', d: 'M 118 4 C 118 48, 152 68, 180 102', start: 0.16, end: 0.5},
  {id: 'm-2', d: 'M 180 4 L 180 102', start: 0.18, end: 0.52},
  {id: 'm-3', d: 'M 242 4 C 242 48, 208 68, 180 102', start: 0.16, end: 0.5},
  {id: 'm-4', d: 'M 304 4 C 304 54, 228 68, 180 102', start: 0.12, end: 0.48},
] as const;

export function ConvergencePaths({
  progress,
  tier,
  reducedMotion,
}: ConvergencePathsProps) {
  const isMobile = tier === 'mobile';
  const showFragments = tier === 'desktop';

  // Phase 1 (0-20%): geometric fragments and entry nodes appear cleanly
  const fragmentOpacity = useTransform(progress, [0, 0.12, 0.24], [0, 0.9, 1]);
  const fragmentY = useTransform(progress, [0, 0.24], [-6, 0]);

  if (isMobile) {
    return (
      <g>
        <defs>
          <linearGradient
            id="svms-mobile-stream-grad"
            x1="180"
            y1="4"
            x2="180"
            y2="104"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#E11D48" stopOpacity="0.85" />
            <stop offset="48%" stopColor="#7C3AED" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="1" />
          </linearGradient>
        </defs>

        {MOBILE_STREAMS.map((stream) => (
          <MobileStreamPath
            key={stream.id}
            d={stream.d}
            start={stream.start}
            end={stream.end}
            progress={progress}
            reducedMotion={reducedMotion}
          />
        ))}
      </g>
    );
  }

  return (
    <g>
      <defs>
        {DESKTOP_STREAMS.map((stream) => (
          <linearGradient
            key={stream.gradId}
            id={stream.gradId}
            x1={stream.xStart}
            y1="6"
            x2="500"
            y2="186"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#E11D48" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#7C3AED" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="1" />
          </linearGradient>
        ))}
      </defs>

      {/* Subtle Phase 1 detached geometric fragments at stream origins (desktop) */}
      {showFragments &&
        DESKTOP_STREAMS.map((stream, idx) => (
          <motion.g
            key={`${stream.id}-frag`}
            style={
              reducedMotion
                ? {opacity: 0.75}
                : {opacity: fragmentOpacity, y: fragmentY}
            }
          >
            <circle
              cx={stream.xStart}
              cy={8}
              r={3.2}
              className="fill-rose-500/80 dark:fill-rose-400/80"
            />
            <rect
              x={stream.xStart - (idx % 2 === 0 ? 12 : -8)}
              y={16}
              width={4}
              height={4}
              rx={1}
              className="fill-rose-400/55 dark:fill-rose-400/45"
            />
          </motion.g>
        ))}

      {/* 5 Flowing Convergence Streams */}
      {DESKTOP_STREAMS.map((stream) => (
        <DesktopStreamPath
          key={stream.id}
          d={stream.d}
          gradId={stream.gradId}
          drawStart={stream.drawStart}
          drawEnd={stream.drawEnd}
          progress={progress}
          reducedMotion={reducedMotion}
        />
      ))}
    </g>
  );
}

function DesktopStreamPath({
  d,
  gradId,
  drawStart,
  drawEnd,
  progress,
  reducedMotion,
}: {
  d: string;
  gradId: string;
  drawStart: number;
  drawEnd: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const pathLength = useTransform(progress, [drawStart, drawEnd], [0, 1]);
  const strokeOpacity = useTransform(
    progress,
    [drawStart - 0.03, drawStart + 0.05],
    [0, 1]
  );

  return (
    <>
      {/* Faint structural guide track */}
      <path
        d={d}
        fill="none"
        strokeWidth="1.25"
        strokeDasharray="4 6"
        className="stroke-slate-300/60 dark:stroke-slate-700/55"
      />
      {/* Progressive gradient stream */}
      <motion.path
        d={d}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="2.25"
        strokeLinecap="round"
        style={
          reducedMotion
            ? {opacity: 1}
            : {pathLength, opacity: strokeOpacity}
        }
      />
    </>
  );
}

function MobileStreamPath({
  d,
  start,
  end,
  progress,
  reducedMotion,
}: {
  d: string;
  start: number;
  end: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const pathLength = useTransform(progress, [start, end], [0, 1]);
  const opacity = useTransform(progress, [start - 0.03, start + 0.05], [0, 1]);

  return (
    <>
      <path
        d={d}
        fill="none"
        strokeWidth="1.2"
        strokeDasharray="3 5"
        className="stroke-slate-300/55 dark:stroke-slate-700/55"
      />
      <motion.path
        d={d}
        fill="none"
        stroke="url(#svms-mobile-stream-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        style={reducedMotion ? {opacity: 1} : {pathLength, opacity}}
      />
    </>
  );
}
