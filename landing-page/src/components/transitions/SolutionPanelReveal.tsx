import {useRef} from 'react';
import {motion, useScroll, useSpring, useTransform} from 'motion/react';
import {
  FileSpreadsheet,
  DatabaseZap,
  CheckCircle2,
  LayoutDashboard,
} from 'lucide-react';
import {SECTION_SPRING} from './transitionConfig';
import {useScrollTransitionContext} from './ScrollTransitionManager';

const SOLUTION_BENEFITS = [
  'Jadwal booking tersinkronisasi untuk tiap lapangan',
  'Mengurangi pencatatan berulang dari chat WhatsApp',
  'Status booking dan info pembayaran lebih mudah dilacak',
  'Ringkasan pendapatan & lapangan terpopuler lebih jelas',
] as const;

export function SolutionPanelReveal() {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const {tier, reducedMotion} = useScrollTransitionContext();
  const isMobile = tier === 'mobile';

  // Phase 4 (75-100% of overall transition): expanding geometric reveal linked to scroll
  const {scrollYProgress: enterProgress} = useScroll({
    target: panelRef,
    offset: ['start 94%', 'start 42%'],
  });
  const smoothEnter = useSpring(enterProgress, SECTION_SPRING);

  // Preserved exit perspective scale/opacity toward FeaturesSection
  const {scrollYProgress: exitProgress} = useScroll({
    target: panelRef,
    offset: ['end 85%', 'end 20%'],
  });
  const smoothExit = useSpring(exitProgress, SECTION_SPRING);

  const panelClipPath = useTransform(
    smoothEnter,
    [0, 0.55],
    isMobile
      ? ['inset(0% 7% 6% 7% round 20px)', 'inset(0% 0% 0% 0% round 16px)']
      : ['inset(0% 18% 12% 18% round 24px)', 'inset(0% 0% 0% 0% round 16px)']
  );
  const panelY = useTransform(smoothEnter, [0, 0.55], [18, 0]);
  const exitScale = useTransform(smoothExit, [0, 1], [1, 0.97]);
  const exitOpacity = useTransform(smoothExit, [0.25, 1], [1, 0.65]);

  // Sequenced inner content entrance (background -> masked heading -> description -> benefits -> hub diagram)
  const labelOpacity = useTransform(smoothEnter, [0.16, 0.42], [0, 1]);
  const labelY = useTransform(smoothEnter, [0.16, 0.42], [12, 0]);

  const headingY = useTransform(smoothEnter, [0.22, 0.54], [28, 0]);
  const headingOpacity = useTransform(smoothEnter, [0.22, 0.52], [0, 1]);

  const descOpacity = useTransform(smoothEnter, [0.34, 0.64], [0, 1]);
  const descY = useTransform(smoothEnter, [0.34, 0.64], [14, 0]);

  const b0Opacity = useTransform(smoothEnter, [0.42, 0.66], [0, 1]);
  const b0Y = useTransform(smoothEnter, [0.42, 0.66], [10, 0]);
  const b1Opacity = useTransform(smoothEnter, [0.47, 0.71], [0, 1]);
  const b1Y = useTransform(smoothEnter, [0.47, 0.71], [10, 0]);
  const b2Opacity = useTransform(smoothEnter, [0.52, 0.76], [0, 1]);
  const b2Y = useTransform(smoothEnter, [0.52, 0.76], [10, 0]);
  const b3Opacity = useTransform(smoothEnter, [0.57, 0.81], [0, 1]);
  const b3Y = useTransform(smoothEnter, [0.57, 0.81], [10, 0]);
  const benefitMotion = [
    {opacity: b0Opacity, y: b0Y},
    {opacity: b1Opacity, y: b1Y},
    {opacity: b2Opacity, y: b2Y},
    {opacity: b3Opacity, y: b3Y},
  ];

  // Hub visualization assembly
  const hubBoxOpacity = useTransform(smoothEnter, [0.4, 0.74], [0, 1]);
  const hubBoxScale = useTransform(smoothEnter, [0.4, 0.74], [0.95, 1]);
  const leftNodesX = useTransform(smoothEnter, [0.5, 0.86], [-12, 0]);
  const rightNodesX = useTransform(smoothEnter, [0.5, 0.86], [12, 0]);
  const centerHubScale = useTransform(smoothEnter, [0.52, 0.88], [0.9, 1]);

  return (
    <motion.div
      ref={panelRef}
      style={
        reducedMotion
          ? undefined
          : {
              scale: exitScale,
              opacity: exitOpacity,
            }
      }
      className="relative -mt-px will-change-transform"
    >
      <motion.div
        style={
          reducedMotion
            ? undefined
            : {
                clipPath: panelClipPath,
                y: panelY,
              }
        }
        className="relative overflow-hidden rounded-2xl border border-indigo-200/80 dark:border-indigo-400/30 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-10 text-white will-change-transform"
      >
        {/* Top center entry notch highlight connecting to the transition stem */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-48 bg-gradient-to-r from-transparent via-indigo-400/80 to-transparent"
        />

        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <motion.p
              style={reducedMotion ? undefined : {opacity: labelOpacity, y: labelY}}
              className="text-xs font-semibold tracking-wider text-indigo-300 uppercase"
            >
              Solusi Terintegrasi SVMS
            </motion.p>

            <div className="overflow-hidden">
              <motion.h2
                style={reducedMotion ? undefined : {y: headingY, opacity: headingOpacity}}
                className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl [text-wrap:balance]"
              >
                Satu Sistem untuk Operasional Venue yang Lebih Terorganisir.
              </motion.h2>
            </div>

            <motion.p
              style={reducedMotion ? undefined : {opacity: descOpacity, y: descY}}
              className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base"
            >
              SVMS menyatukan proses booking pelanggan, pengelolaan lapangan dan jadwal, pemantauan status pembayaran, serta ringkasan kinerja bisnis dalam satu platform terstruktur.
            </motion.p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SOLUTION_BENEFITS.map((point, idx) => (
                <motion.div
                  key={point}
                  style={reducedMotion ? undefined : benefitMotion[idx]}
                  className="flex items-start gap-2.5 text-xs text-slate-200 sm:text-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" aria-hidden="true" />
                  <span>{point}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Hub Diagram */}
          <div className="lg:col-span-6">
            <motion.div
              style={
                reducedMotion
                  ? undefined
                  : {opacity: hubBoxOpacity, scale: hubBoxScale}
              }
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 items-center">
                <motion.div
                  style={reducedMotion || isMobile ? undefined : {x: leftNodesX}}
                  className="space-y-2.5"
                >
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
                    <p className="text-xs font-semibold text-white">Booking Pelanggan</p>
                    <p className="text-[11px] text-slate-300">Pilih court &amp; jam</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
                    <p className="text-xs font-semibold text-white">Manajemen Lapangan</p>
                    <p className="text-[11px] text-slate-300">Tarif &amp; ketersediaan</p>
                  </div>
                </motion.div>

                <motion.div
                  style={reducedMotion ? undefined : {scale: centerHubScale}}
                  className="flex flex-col items-center justify-center rounded-2xl border border-indigo-400/40 bg-indigo-600/90 px-4 py-5 text-center shadow-lg"
                >
                  <LayoutDashboard className="h-6 w-6 text-white" aria-hidden="true" />
                  <p className="mt-2 font-display text-sm font-bold text-white">SVMS Hub</p>
                  <p className="mt-1 text-[11px] text-indigo-100">
                    Satu catatan operasional
                  </p>
                </motion.div>

                <motion.div
                  style={reducedMotion || isMobile ? undefined : {x: rightNodesX}}
                  className="space-y-2.5"
                >
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
                    <p className="text-xs font-semibold text-white">Kontrol Jadwal &amp; Bayar</p>
                    <p className="text-[11px] text-slate-300">Status tercatat rapi</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
                    <p className="text-xs font-semibold text-white">Dashboard Bisnis</p>
                    <p className="text-[11px] text-slate-300">Evaluasi berbasis data</p>
                  </div>
                </motion.div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <FileSpreadsheet className="h-3.5 w-3.5 text-indigo-300" aria-hidden="true" />
                  Menggantikan rekap spreadsheet terpisah
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <DatabaseZap className="h-3.5 w-3.5 text-violet-300" aria-hidden="true" />
                  Data terstruktur
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
