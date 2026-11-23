import {motion, type MotionValue, useTransform} from 'motion/react';
import {HOW_IT_WORKS_STEPS} from '../../constants/svmsData';

interface WorkflowProgressIndicatorProps {
  activeStage: number;
  progress?: MotionValue<number>;
  onSelectStage: (index: number) => void;
  reducedMotion: boolean;
}

export function WorkflowProgressIndicator({
  activeStage,
  progress,
  onSelectStage,
  reducedMotion,
}: WorkflowProgressIndicatorProps) {
  return (
    <div
      role="tablist"
      aria-label="Tahapan Cara Kerja SVMS"
      className="mx-auto grid max-w-4xl grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3"
    >
      {HOW_IT_WORKS_STEPS.map((step, index) => {
        const isActive = activeStage === index;
        return (
          <StageIndicatorButton
            key={step.number}
            number={step.number}
            title={step.title}
            index={index}
            isActive={isActive}
            progress={progress}
            reducedMotion={reducedMotion}
            onClick={() => onSelectStage(index)}
          />
        );
      })}
    </div>
  );
}

interface StageIndicatorButtonProps {
  number: string;
  title: string;
  index: number;
  isActive: boolean;
  progress?: MotionValue<number>;
  reducedMotion: boolean;
  onClick: () => void;
}

function StageIndicatorButton({
  number,
  title,
  index,
  isActive,
  progress,
  reducedMotion,
  onClick,
}: StageIndicatorButtonProps) {
  // Segment fill windows aligned to the 4 stage scroll windows across [0, 0.90]
  const start = index * 0.22;
  const end = Math.min(0.92, start + 0.22);

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border px-3.5 py-2.5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0B1020] ${
        isActive
          ? 'border-indigo-500/70 dark:border-indigo-400/70 bg-white dark:bg-[#1E293B] shadow-[0_8px_24px_-12px_rgba(79,70,229,0.28)]'
          : 'border-slate-200/80 dark:border-slate-700/70 bg-white/70 dark:bg-[#182235]/70 hover:border-indigo-300 dark:hover:border-indigo-500/40'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-bold tabular-nums transition-colors duration-300 ${
            isActive
              ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300'
          }`}
        >
          {number}
        </span>
        <span
          className={`truncate text-xs font-semibold transition-colors duration-300 ${
            isActive
              ? 'text-slate-900 dark:text-[#F8FAFC]'
              : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
          }`}
        >
          {title}
        </span>
      </div>

      {/* Independent subtle progress meter inside each step tab (no connecting rail) */}
      <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
        {progress && !reducedMotion ? (
          <StageProgressFill
            progress={progress}
            start={start}
            end={end}
            isActive={isActive}
          />
        ) : (
          <div
            className={`h-full w-full transition-opacity duration-300 ${
              isActive
                ? 'bg-indigo-600 dark:bg-indigo-400 opacity-100'
                : 'opacity-0'
            }`}
          />
        )}
      </div>
    </button>
  );
}

function StageProgressFill({
  progress,
  start,
  end,
  isActive,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  isActive: boolean;
}) {
  const scaleX = useTransform(progress, [start, end], [0, 1]);

  return (
    <motion.div
      style={{scaleX}}
      className={`h-full w-full origin-left transition-colors duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400'
          : 'bg-indigo-400/50 dark:bg-indigo-500/40'
      }`}
    />
  );
}
