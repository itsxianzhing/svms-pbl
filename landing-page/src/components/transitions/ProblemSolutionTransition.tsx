import type {RefObject} from 'react';
import {motion, type MotionValue, useTransform} from 'motion/react';
import {ConvergencePaths} from './ConvergencePaths';
import {AnimatedConnection} from './AnimatedConnection';
import {SVMSHubReveal} from './SVMSHubReveal';
import {useScrollTransitionContext} from './ScrollTransitionManager';

interface ProblemSolutionTransitionProps {
  transitionRef: RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
}

export function ProblemSolutionTransition({
  transitionRef,
  progress,
}: ProblemSolutionTransitionProps) {
  const {tier, reducedMotion} = useScrollTransitionContext();
  const isMobile = tier === 'mobile';

  // Gradual atmospheric shift from light problem canvas toward deep navy solution panel
  const atmosphereOpacity = useTransform(progress, [0.35, 0.95], [0, 1]);

  return (
    <div
      ref={transitionRef}
      aria-label="Transisi dari operasional manual yang terfragmentasi ke sistem terpusat SVMS"
      className="relative mx-auto w-full select-none overflow-x-clip"
    >
      {/* Subtle atmospheric indigo gradient wash bridging light/dark canvas into deep navy Solution */}
      <motion.div
        aria-hidden="true"
        style={reducedMotion ? {opacity: 0.75} : {opacity: atmosphereOpacity}}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-b from-transparent via-indigo-500/[0.06] to-indigo-950/[0.14] dark:via-indigo-500/[0.08] dark:to-indigo-950/50"
      />

      {/* Synchronized SVG Convergence Canvas */}
      <div
        className={`relative mx-auto w-full ${
          isMobile ? 'aspect-[360/176] max-w-md' : 'aspect-[1000/320]'
        }`}
      >
        <svg
          viewBox={isMobile ? '0 0 360 176' : '0 0 1000 320'}
          fill="none"
          aria-hidden="true"
          className="block h-full w-full overflow-visible"
        >
          <ConvergencePaths
            progress={progress}
            tier={tier}
            reducedMotion={reducedMotion}
          />
          <AnimatedConnection
            progress={progress}
            tier={tier}
            reducedMotion={reducedMotion}
          />
        </svg>

        {/* Central SVMS Hub & preserved transition message */}
        <SVMSHubReveal
          progress={progress}
          tier={tier}
          reducedMotion={reducedMotion}
        />
      </div>
    </div>
  );
}
