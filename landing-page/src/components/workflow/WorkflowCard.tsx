import {useRef, type MouseEvent} from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import {WorkflowVisual, type WorkflowStageKind} from './WorkflowVisual';

export interface WorkflowStepData {
  number: string;
  title: string;
  description: string;
  outcome: string;
}

export interface WorkflowStageTransform {
  x: MotionValue<number>;
  y: MotionValue<number>;
  z: MotionValue<number>;
  scale: MotionValue<number>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  opacity: MotionValue<number>;
  zIndex: MotionValue<number>;
}

interface WorkflowCardProps {
  id?: string;
  step: WorkflowStepData;
  kind: WorkflowStageKind;
  index: number;
  isActive: boolean;
  stageTransform?: WorkflowStageTransform;
  scrollProgress?: MotionValue<number>;
  interactiveTilt: boolean;
  reducedMotion: boolean;
  onSelect?: () => void;
  variant?: 'stage3d' | 'tablet' | 'mobile';
}

const TILT_SPRING = {stiffness: 220, damping: 24, mass: 0.4} as const;

export function WorkflowCard({
  id,
  step,
  kind,
  index,
  isActive,
  stageTransform,
  scrollProgress,
  interactiveTilt,
  reducedMotion,
  onSelect,
  variant = 'stage3d',
}: WorkflowCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(cardRef, {once: true, amount: 0.35});
  const isVisualActive = variant === 'stage3d' ? isActive : inView || isActive;

  const rawPointerX = useMotionValue(0);
  const rawPointerY = useMotionValue(0);
  const pointerX = useSpring(rawPointerX, TILT_SPRING);
  const pointerY = useSpring(rawPointerY, TILT_SPRING);

  const hoverRotateX = useTransform(pointerY, [-1, 1], [4.5, -4.5]);
  const hoverRotateY = useTransform(pointerX, [-1, 1], [-5.5, 5.5]);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!interactiveTilt || reducedMotion || !isActive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const normX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const normY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    rawPointerX.set(Math.max(-1, Math.min(1, normX)));
    rawPointerY.set(Math.max(-1, Math.min(1, normY)));
  };

  const handleMouseLeave = () => {
    rawPointerX.set(0);
    rawPointerY.set(0);
  };

  const cardSurface = (
    <motion.div
      ref={cardRef}
      id={id}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={!isActive && onSelect ? onSelect : undefined}
      role={!isActive && onSelect ? 'button' : undefined}
      tabIndex={!isActive && onSelect ? 0 : undefined}
      aria-label={!isActive && onSelect ? `Lihat tahap ${step.number}: ${step.title}` : undefined}
      onKeyDown={
        !isActive && onSelect
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect();
              }
            }
          : undefined
      }
      data-cursor-card="true"
      style={
        interactiveTilt && !reducedMotion && isActive
          ? {
              rotateX: hoverRotateX,
              rotateY: hoverRotateY,
              transformStyle: 'preserve-3d',
            }
          : undefined
      }
      className={`relative flex h-full flex-col justify-between rounded-2xl border p-5 sm:p-6 transition-[border-color,box-shadow,background-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
        !isActive && onSelect ? 'cursor-pointer' : ''
      } ${
        isActive
          ? 'border-indigo-400/75 dark:border-indigo-400/60 bg-white dark:bg-[#1E293B] shadow-[0_24px_54px_-18px_rgba(79,70,229,0.24)] dark:shadow-[0_24px_54px_-18px_rgba(0,0,0,0.65)]'
          : 'border-slate-200/90 dark:border-slate-700/75 bg-white/95 dark:bg-[#182235] shadow-[0_10px_28px_-14px_rgba(15,23,42,0.12)] dark:shadow-[0_12px_28px_-14px_rgba(0,0,0,0.45)] hover:border-indigo-300 dark:hover:border-indigo-500/45'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold tabular-nums transition-colors duration-300 ${
                isActive
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                  : 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300'
              }`}
            >
              {step.number}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Tahap {step.number}
            </span>
          </div>
          {isActive && variant === 'stage3d' && (
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
              Aktif
            </span>
          )}
        </div>

        <h3 className="mt-3.5 font-display text-lg font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC]">
          {step.title}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
          {step.description}
        </p>

        {/* Supporting miniature process UI visualization */}
        <div className="mt-4">
          <WorkflowVisual
            kind={kind}
            scrollProgress={scrollProgress}
            pointerX={interactiveTilt && isActive ? pointerX : undefined}
            pointerY={interactiveTilt && isActive ? pointerY : undefined}
            isActive={isVisualActive}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 dark:border-slate-700/70 pt-3">
        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
          {step.outcome}
        </p>
      </div>
    </motion.div>
  );

  // Desktop 3D scroll-driven stage card
  if (variant === 'stage3d' && stageTransform) {
    return (
      <motion.div
        style={{
          x: stageTransform.x,
          y: stageTransform.y,
          z: stageTransform.z,
          scale: stageTransform.scale,
          rotateX: stageTransform.rotateX,
          rotateY: stageTransform.rotateY,
          opacity: stageTransform.opacity,
          zIndex: stageTransform.zIndex,
          transformStyle: 'preserve-3d',
        }}
        className="absolute w-[420px] xl:w-[448px] will-change-transform"
      >
        {cardSurface}
      </motion.div>
    );
  }

  // Tablet simplified perspective entrance
  if (variant === 'tablet') {
    return (
      <motion.div
        initial={reducedMotion ? false : {opacity: 0, y: 20, rotateX: 6}}
        whileInView={{opacity: 1, y: 0, rotateX: 0}}
        viewport={{once: true, margin: '-50px'}}
        transition={{
          duration: 0.5,
          delay: reducedMotion ? 0 : index * 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={reducedMotion ? undefined : {transformPerspective: 1000}}
        onClick={onSelect}
        className="h-full"
      >
        {cardSurface}
      </motion.div>
    );
  }

  // Mobile lightweight sequential entrance
  return (
    <motion.div
      initial={reducedMotion ? false : {opacity: 0, y: 16}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-40px'}}
      transition={{
        duration: 0.42,
        delay: reducedMotion ? 0 : index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={onSelect}
      className="h-full"
    >
      {cardSurface}
    </motion.div>
  );
}
