import {useRef} from 'react';
import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import {ArrowDown} from 'lucide-react';
import {MANUAL_WORKFLOW_STEPS, OPERATIONAL_PROBLEMS} from '../../constants/svmsData';
import {TimelineProgress} from './TimelineProgress';
import {TimelineNode} from './TimelineNode';
import {TimelineCard} from './TimelineCard';
import {OperationalProblemCard} from './OperationalProblemCard';

interface ManualWorkflowTimelineProps {
  handoffProgress?: MotionValue<number>;
}

export function ManualWorkflowTimeline({handoffProgress}: ManualWorkflowTimelineProps) {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const problemsRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = Boolean(useReducedMotion());

  const {scrollYProgress: rawTimelineProgress} = useScroll({
    target: timelineRef,
    offset: ['start 74%', 'end 68%'],
  });

  const smoothTimeline = useSpring(rawTimelineProgress, {
    stiffness: 130,
    damping: 26,
    mass: 0.5,
  });

  const {scrollYProgress: rawProblemsProgress} = useScroll({
    target: problemsRef,
    offset: ['start 88%', 'start 42%'],
  });

  const smoothProblems = useSpring(rawProblemsProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.5,
  });

  const spineScaleY = useTransform(smoothTimeline, [0, 1], [0, 1]);
  const bridgeOpacity = useTransform(smoothProblems, [0, 0.35], [0.25, 1]);
  const bridgeScale = useTransform(smoothProblems, [0, 0.35], [0.94, 1]);

  return (
    <div className="mt-10 rounded-2xl border border-slate-200/90 bg-[#F6F7FB] dark:border-slate-800 dark:bg-[#151D30] p-5 sm:p-8">
      <TimelineProgress progress={smoothTimeline} reducedMotion={prefersReduced} />

      {/* 6-Step Interactive 3D Timeline */}
      <div ref={timelineRef} className="relative mt-8">
        {/* Desktop Center Vertical Spine */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-0.5 bg-slate-200/90 dark:bg-slate-700/70 rounded-full"
        >
          <motion.div
            style={{scaleY: prefersReduced ? 1 : spineScaleY}}
            className="h-full w-full origin-top rounded-full bg-gradient-to-b from-indigo-600 via-violet-600 to-rose-500"
          />
        </div>

        {/* Mobile Left Vertical Spine */}
        <div
          aria-hidden="true"
          className="md:hidden absolute top-4 bottom-4 left-[19px] w-0.5 bg-slate-200/90 dark:bg-slate-700/70 rounded-full"
        >
          <motion.div
            style={{scaleY: prefersReduced ? 1 : spineScaleY}}
            className="h-full w-full origin-top rounded-full bg-gradient-to-b from-indigo-600 via-violet-600 to-rose-500"
          />
        </div>

        <ol className="relative space-y-6 md:space-y-8">
          {MANUAL_WORKFLOW_STEPS.map((item, idx) => {
            const start = idx * 0.14;
            const end = Math.min(start + 0.24, 0.96);
            const side: 'left' | 'right' = idx % 2 === 0 ? 'left' : 'right';

            return (
              <li key={item.step} className="relative">
                {/* Desktop Alternating 3-Column Row */}
                <div className="hidden md:grid md:grid-cols-12 md:items-center md:gap-4">
                  {/* Left Slot */}
                  <div className="md:col-span-5 flex items-center justify-end">
                    {side === 'left' ? (
                      <div className="flex w-full items-center gap-3">
                        <TimelineCard
                          step={item.step}
                          title={item.title}
                          detail={item.detail}
                          index={idx}
                          side="left"
                          progress={smoothTimeline}
                          start={start}
                          end={end}
                          reducedMotion={prefersReduced}
                        />
                        <span
                          aria-hidden="true"
                          className="h-px w-6 shrink-0 bg-indigo-300/70 dark:bg-indigo-500/40"
                        />
                      </div>
                    ) : (
                      <div className="text-right pr-4">
                        <span className="font-mono text-[11px] font-medium text-slate-400 dark:text-slate-500">
                          Tahap {item.step}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Center Node */}
                  <div className="md:col-span-2 flex justify-center">
                    <TimelineNode
                      step={item.step}
                      progress={smoothTimeline}
                      start={start}
                      end={end}
                      reducedMotion={prefersReduced}
                    />
                  </div>

                  {/* Right Slot */}
                  <div className="md:col-span-5 flex items-center justify-start">
                    {side === 'right' ? (
                      <div className="flex w-full items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="h-px w-6 shrink-0 bg-indigo-300/70 dark:bg-indigo-500/40"
                        />
                        <TimelineCard
                          step={item.step}
                          title={item.title}
                          detail={item.detail}
                          index={idx}
                          side="right"
                          progress={smoothTimeline}
                          start={start}
                          end={end}
                          reducedMotion={prefersReduced}
                        />
                      </div>
                    ) : (
                      <div className="text-left pl-4">
                        <span className="font-mono text-[11px] font-medium text-slate-400 dark:text-slate-500">
                          Tahap {item.step}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Left-Rail Vertical Timeline Row */}
                <div className="md:hidden relative flex items-start gap-4">
                  <div className="relative z-10 shrink-0 pt-2">
                    <TimelineNode
                      step={item.step}
                      progress={smoothTimeline}
                      start={start}
                      end={end}
                      reducedMotion={prefersReduced}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <TimelineCard
                      step={item.step}
                      title={item.title}
                      detail={item.detail}
                      index={idx}
                      side="right"
                      progress={smoothTimeline}
                      start={start}
                      end={end}
                      reducedMotion={prefersReduced}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Transition into 5 Operational Problems */}
      <div ref={problemsRef} className="mt-10 border-t border-slate-200/80 dark:border-slate-800 pt-8">
        <motion.div
          style={
            prefersReduced
              ? undefined
              : {opacity: bridgeOpacity, scale: bridgeScale}
          }
          className="flex flex-col items-center text-center"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-400">
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </div>
          <p className="mt-2.5 text-xs font-semibold tracking-wider text-rose-700 dark:text-rose-400 uppercase">
            Dampak dari Alur Kerja Manual
          </p>
          <p className="mt-1 max-w-xl text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
            Ketika keenam langkah manual terus berulang setiap hari, pengelola venue menghadapi lima masalah operasional berikut:
          </p>
        </motion.div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {OPERATIONAL_PROBLEMS.map((prob, idx) => (
            <OperationalProblemCard
              key={prob.id}
              title={prob.title}
              description={prob.description}
              index={idx}
              progress={smoothProblems}
              handoffProgress={handoffProgress}
              reducedMotion={prefersReduced}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
