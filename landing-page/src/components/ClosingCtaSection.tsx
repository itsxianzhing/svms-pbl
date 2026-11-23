import {useRef} from 'react';
import {motion, useScroll, useSpring, useTransform} from 'motion/react';
import {ArrowRight, ExternalLink} from 'lucide-react';
import {PROTOTYPE_URL} from '../constants/svmsData';
import {BackgroundTransition} from './transitions/BackgroundTransition';
import {SectionTransition} from './transitions/SectionTransition';
import {MOTION_EASE, SECTION_SPRING} from './transitions/transitionConfig';
import {useScrollTransitionContext} from './transitions/ScrollTransitionManager';

interface ClosingCtaSectionProps {
  onBookDemo: () => void;
}

export function ClosingCtaSection({onBookDemo}: ClosingCtaSectionProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const {reducedMotion} = useScrollTransitionContext();

  const {scrollYProgress} = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const smooth = useSpring(scrollYProgress, SECTION_SPRING);
  const svgY = useTransform(smooth, [0, 1], [18, -16]);
  const svgScale = useTransform(smooth, [0, 1], [1.05, 1]);

  return (
    <BackgroundTransition
      fromColor="#FFFFFF"
      toColor="#F6F7FB"
      className="relative overflow-x-clip py-16 sm:py-24"
    >
      <div ref={cardRef} className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTransition type="circular-reveal">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 px-6 py-12 text-center text-white shadow-[0_24px_60px_-20px_rgba(79,70,229,0.45)] sm:px-12 sm:py-16">
            {/* Decorative court-grid geometry with gentle parallax */}
            <motion.svg
              aria-hidden="true"
              style={reducedMotion ? undefined : {y: svgY, scale: svgScale}}
              className="pointer-events-none absolute inset-0 h-full w-full opacity-15 will-change-transform"
              viewBox="0 0 800 360"
              fill="none"
              preserveAspectRatio="none"
            >
              <rect x="40" y="30" width="720" height="300" rx="20" stroke="white" strokeWidth="1.5" />
              <line x1="400" y1="30" x2="400" y2="330" stroke="white" strokeWidth="1.5" strokeDasharray="6 6" />
              <circle cx="400" cy="180" r="64" stroke="white" strokeWidth="1.5" />
            </motion.svg>

            <div className="relative mx-auto max-w-2xl">
              <p className="text-xs font-semibold tracking-wider text-indigo-100 uppercase">
                Langkah Berikutnya untuk Venue Anda
              </p>
              <div className="overflow-hidden">
                <motion.h2
                  initial={{opacity: 0, y: 24}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true, margin: '-40px'}}
                  transition={{duration: 0.7, ease: MOTION_EASE.expoOut}}
                  className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-4xl [text-wrap:balance]"
                >
                  Siap Mengelola Venue dengan Cara yang Lebih Terarah?
                </motion.h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-indigo-100 sm:text-base">
                Kenali bagaimana SVMS dapat membantu menyederhanakan operasional dan memberikan gambaran bisnis yang lebih jelas.
              </p>

              <motion.div
                initial={{opacity: 0, scale: 0.94}}
                whileInView={{opacity: 1, scale: 1}}
                viewport={{once: true, margin: '-40px'}}
                transition={{duration: 0.6, delay: 0.1, ease: MOTION_EASE.power3Out}}
                className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
              >
                <button
                  type="button"
                  onClick={onBookDemo}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-700 shadow-sm transition-all duration-150 hover:bg-indigo-50 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700"
                >
                  <span>Book a Demo</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <a
                  href={PROTOTYPE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-xs transition-all duration-150 hover:bg-white/20 hover:-translate-y-0.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700"
                >
                  <span>Coba Prototype</span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </motion.div>
            </div>
          </div>
        </SectionTransition>
      </div>
    </BackgroundTransition>
  );
}
