import {useEffect, useRef, useState} from 'react';
import {
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import {HOW_IT_WORKS_STEPS} from '../../constants/svmsData';
import {useScrollTransitionContext} from '../transitions/ScrollTransitionManager';
import {WorkflowCard, type WorkflowStageTransform} from './WorkflowCard';
import {WorkflowProgressIndicator} from './WorkflowProgressIndicator';
import type {WorkflowStageKind} from './WorkflowVisual';

const STAGE_KINDS: WorkflowStageKind[] = [
  'venue-setup',
  'customer-booking',
  'operations-manage',
  'business-analytics',
];

// Scroll keyframes: [entry, S1_in, S1_hold, S2_in, S2_hold, S3_in, S3_hold, S4_in, S4_hold, unified, end]
const SCROLL_STOPS = [
  0.0, 0.13, 0.21, 0.35, 0.43, 0.57, 0.65, 0.78, 0.85, 0.96, 1.0,
];

interface KeyframeSeries {
  x: number[];
  y: number[];
  z: number[];
  scale: number[];
  rotateX: number[];
  rotateY: number[];
  opacity: number[];
  zIndex: number[];
}

const CARD_KEYFRAMES: KeyframeSeries[] = [
  // Card 01: Enters from lower viewport -> settles center -> slides left & recedes in Z -> fans out for unified finale
  {
    x: [-16, 0, 0, -290, -290, -345, -345, -380, -380, -336, -336],
    y: [56, 0, 0, 10, 10, 18, 18, 22, 22, 12, 12],
    z: [-36, 24, 24, -135, -135, -225, -225, -285, -285, -40, -40],
    scale: [0.92, 1.02, 1.02, 0.82, 0.82, 0.74, 0.74, 0.68, 0.68, 0.54, 0.54],
    rotateX: [10, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
    rotateY: [7, 0, 0, 14, 14, 16, 16, 18, 18, 6, 6],
    opacity: [0.76, 1, 1, 0.54, 0.54, 0.34, 0.34, 0.24, 0.24, 0.95, 0.95],
    zIndex: [40, 40, 40, 30, 30, 20, 20, 10, 10, 25, 25],
  },
  // Card 02: Stacked right -> slides laterally forward -> recedes back in depth -> fans out for unified finale
  {
    x: [220, 275, 275, 0, 0, -290, -290, -345, -345, -112, -112],
    y: [20, 10, 10, 0, 0, 10, 10, 18, 18, -6, -6],
    z: [-140, -125, -125, 24, 24, -135, -135, -215, -215, 10, 10],
    scale: [0.82, 0.83, 0.83, 1.02, 1.02, 0.82, 0.82, 0.75, 0.75, 0.56, 0.56],
    rotateX: [4, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0],
    rotateY: [-13, -13, -13, 0, 0, 13, 13, 16, 16, 2, 2],
    opacity: [0.56, 0.58, 0.58, 1, 1, 0.54, 0.54, 0.36, 0.36, 1, 1],
    zIndex: [30, 30, 30, 40, 40, 30, 30, 20, 20, 35, 35],
  },
  // Card 03: Deep right -> advances with perspective pitch settle -> shifts left as layer separates -> unified finale
  {
    x: [295, 340, 340, 285, 285, 0, 0, -285, -285, 112, 112],
    y: [14, 18, 18, 10, 10, 0, 0, 10, 10, -6, -6],
    z: [-215, -210, -210, -125, -125, 24, 24, -125, -125, 10, 10],
    scale: [0.76, 0.75, 0.75, 0.83, 0.83, 1.02, 1.02, 0.83, 0.83, 0.56, 0.56],
    rotateX: [2, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0],
    rotateY: [-15, -16, -16, -13, -13, 0, 0, 13, 13, -2, -2],
    opacity: [0.4, 0.36, 0.36, 0.56, 0.56, 1, 1, 0.58, 0.58, 1, 1],
    zIndex: [20, 20, 20, 30, 30, 40, 40, 30, 30, 35, 35],
  },
  // Card 04: Background anchor -> separates forward into foreground overview -> fans out right in unified finale
  {
    x: [345, 385, 385, 345, 345, 285, 285, 0, 0, 336, 336],
    y: [10, 22, 22, 18, 18, 12, 12, 0, 0, 12, 12],
    z: [-280, -280, -280, -215, -215, -125, -125, 28, 28, -40, -40],
    scale: [0.7, 0.69, 0.69, 0.75, 0.75, 0.83, 0.83, 1.03, 1.03, 0.54, 0.54],
    rotateX: [0, 0, 0, 0, 0, -4, -4, 0, 0, 0, 0],
    rotateY: [-17, -18, -18, -16, -16, -13, -13, 0, 0, -6, -6],
    opacity: [0.24, 0.22, 0.22, 0.36, 0.36, 0.58, 0.58, 1, 1, 0.95, 0.95],
    zIndex: [10, 10, 10, 20, 20, 30, 30, 40, 40, 25, 25],
  },
];

function useStageCardTransform(
  progress: MotionValue<number>,
  index: number
): WorkflowStageTransform {
  const kf = CARD_KEYFRAMES[index];
  const x = useTransform(progress, SCROLL_STOPS, kf.x);
  const y = useTransform(progress, SCROLL_STOPS, kf.y);
  const z = useTransform(progress, SCROLL_STOPS, kf.z);
  const scale = useTransform(progress, SCROLL_STOPS, kf.scale);
  const rotateX = useTransform(progress, SCROLL_STOPS, kf.rotateX);
  const rotateY = useTransform(progress, SCROLL_STOPS, kf.rotateY);
  const opacity = useTransform(progress, SCROLL_STOPS, kf.opacity);
  const rawZIndex = useTransform(progress, SCROLL_STOPS, kf.zIndex);
  const zIndex = useTransform(rawZIndex, (v) => Math.round(v));

  return {x, y, z, scale, rotateX, rotateY, opacity, zIndex};
}

export function WorkflowScrollExperience() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const {tier, reducedMotion} = useScrollTransitionContext();
  const [activeStage, setActiveStage] = useState(0);
  const activeStageRef = useRef(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const coarseMedia = window.matchMedia('(pointer: coarse)');
    const syncPointer = () => setIsTouchDevice(coarseMedia.matches);
    syncPointer();
    coarseMedia.addEventListener('change', syncPointer);
    return () => coarseMedia.removeEventListener('change', syncPointer);
  }, []);

  const {scrollYProgress} = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 26,
    mass: 0.45,
  });

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    let next = 0;
    if (latest >= 0.71) next = 3;
    else if (latest >= 0.49) next = 2;
    else if (latest >= 0.27) next = 1;
    else next = 0;

    if (next !== activeStageRef.current) {
      activeStageRef.current = next;
      setActiveStage(next);
    }
  });

  const t0 = useStageCardTransform(smoothProgress, 0);
  const t1 = useStageCardTransform(smoothProgress, 1);
  const t2 = useStageCardTransform(smoothProgress, 2);
  const t3 = useStageCardTransform(smoothProgress, 3);
  const stageTransforms = [t0, t1, t2, t3];

  const handleSelectStage = (index: number) => {
    setActiveStage(index);
    activeStageRef.current = index;

    if (!trackRef.current || tier !== 'desktop' || reducedMotion) {
      return;
    }
    const rect = trackRef.current.getBoundingClientRect();
    const trackTop = rect.top + window.scrollY;
    const scrollableDistance = trackRef.current.offsetHeight - window.innerHeight;
    if (scrollableDistance <= 0) return;

    const targetFractions = [0.17, 0.39, 0.61, 0.81];
    const targetY = trackTop + scrollableDistance * (targetFractions[index] ?? 0.17);
    window.scrollTo({
      top: targetY,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  const interactiveTilt = tier === 'desktop' && !isTouchDevice && !reducedMotion;

  return (
    <div className="mt-10">
      {/* Desktop Scroll-Driven 3D Stage (>= lg and motion enabled) */}
      {!reducedMotion && (
        <div ref={trackRef} className="hidden lg:block relative h-[320vh]">
          <div className="sticky top-16 flex min-h-[calc(100vh-4rem)] flex-col justify-center py-4">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
              <WorkflowProgressIndicator
                activeStage={activeStage}
                progress={smoothProgress}
                onSelectStage={handleSelectStage}
                reducedMotion={reducedMotion}
              />

              {/* 3D Perspective Stage */}
              <div
                style={{
                  perspective: '1600px',
                  transformStyle: 'preserve-3d',
                }}
                className="relative mt-6 flex h-[470px] xl:h-[500px] w-full items-center justify-center"
              >
                {/* Ambient workspace ground reflection */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-16 bottom-2 h-24 rounded-full bg-indigo-500/8 dark:bg-indigo-400/10 blur-3xl"
                />

                {HOW_IT_WORKS_STEPS.map((step, idx) => (
                  <WorkflowCard
                    key={step.number}
                    step={step}
                    kind={STAGE_KINDS[idx]}
                    index={idx}
                    isActive={activeStage === idx}
                    stageTransform={stageTransforms[idx]}
                    scrollProgress={smoothProgress}
                    interactiveTilt={interactiveTilt}
                    reducedMotion={reducedMotion}
                    onSelect={() => handleSelectStage(idx)}
                    variant="stage3d"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reduced-Motion Desktop Static Fallback */}
      {reducedMotion && (
        <div className="hidden lg:block mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <WorkflowProgressIndicator
            activeStage={activeStage}
            onSelectStage={(idx) => setActiveStage(idx)}
            reducedMotion
          />
          <div className="mt-6 grid grid-cols-2 gap-6 items-stretch">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <WorkflowCard
                key={step.number}
                step={step}
                kind={STAGE_KINDS[idx]}
                index={idx}
                isActive={activeStage === idx}
                interactiveTilt={false}
                reducedMotion
                onSelect={() => setActiveStage(idx)}
                variant="tablet"
              />
            ))}
          </div>
        </div>
      )}

      {/* Tablet Simplified 2-Column Perspective Layout (sm to lg) */}
      <div className="hidden sm:block lg:hidden mx-auto max-w-4xl px-4 sm:px-6">
        <WorkflowProgressIndicator
          activeStage={activeStage}
          onSelectStage={(idx) => setActiveStage(idx)}
          reducedMotion={reducedMotion}
        />
        <div className="mt-6 grid grid-cols-2 gap-5 items-stretch">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <WorkflowCard
              key={step.number}
              step={step}
              kind={STAGE_KINDS[idx]}
              index={idx}
              isActive={activeStage === idx}
              interactiveTilt={false}
              reducedMotion={reducedMotion}
              onSelect={() => setActiveStage(idx)}
              variant="tablet"
            />
          ))}
        </div>
      </div>

      {/* Mobile Vertical Sequential Layout (< sm) */}
      <div className="sm:hidden mx-auto max-w-xl px-4 space-y-4">
        {HOW_IT_WORKS_STEPS.map((step, idx) => (
          <WorkflowCard
            key={step.number}
            step={step}
            kind={STAGE_KINDS[idx]}
            index={idx}
            isActive
            interactiveTilt={false}
            reducedMotion={reducedMotion}
            variant="mobile"
          />
        ))}
      </div>
    </div>
  );
}
