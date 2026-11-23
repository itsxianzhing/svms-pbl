import {useRef} from 'react';
import {useScroll, useSpring} from 'motion/react';
import {SpatialCourtAccent} from './three/SpatialCourtAccent';
import {ManualWorkflowTimeline} from './timeline/ManualWorkflowTimeline';
import {BackgroundTransition} from './transitions/BackgroundTransition';
import {SectionTransition} from './transitions/SectionTransition';
import {ProblemSolutionTransition} from './transitions/ProblemSolutionTransition';
import {SolutionPanelReveal} from './transitions/SolutionPanelReveal';
import {SECTION_SPRING} from './transitions/transitionConfig';

export function ProblemSolutionSection() {
  const transitionRef = useRef<HTMLDivElement | null>(null);
  const {scrollYProgress: rawTransitionProgress} = useScroll({
    target: transitionRef,
    offset: ['start 94%', 'end 44%'],
  });
  const smoothTransition = useSpring(rawTransitionProgress, SECTION_SPRING);

  return (
    <BackgroundTransition
      id="solusi"
      fromColor="#F6F7FB"
      toColor="#FFFFFF"
      className="relative overflow-x-clip py-16 sm:py-24 border-b border-slate-200/70 dark:border-slate-800/80"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SpatialCourtAccent variant="court" />
        {/* Part 1: Problem Header emerging from Hero perspective */}
        <SectionTransition type="perspective-zoom">
          <div className="relative max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
              Tantangan Operasional Venue
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC] sm:text-3xl [text-wrap:balance]">
              Mengapa Pengelolaan Manual Menghambat Pertumbuhan Venue?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Banyak pengelola lapangan masih mengandalkan alur terpisah antara chat, kertas, dan spreadsheet. Semakin ramai pemesanan, semakin besar beban administrasi harian.
            </p>
          </div>
        </SectionTransition>

        {/* Scroll-Driven 3D Manual Workflow Timeline & Operational Problems */}
        <ManualWorkflowTimeline handoffProgress={smoothTransition} />

        {/* Fragment-to-Unity Convergence Transition into SVMS Hub */}
        <ProblemSolutionTransition
          transitionRef={transitionRef}
          progress={smoothTransition}
        />

        {/* Part 2: Solution Presentation emerging from the unified SVMS Hub stem */}
        <SolutionPanelReveal />
      </div>
    </BackgroundTransition>
  );
}
