import {lazy, Suspense, useRef} from 'react';
import {motion, useScroll, useSpring, useTransform} from 'motion/react';
import {
  ArrowRight,
  ExternalLink,
  CalendarClock,
  CheckCircle2,
  CircleCheck,
  Wallet,
} from 'lucide-react';
import {PROTOTYPE_URL} from '../constants/svmsData';
import {VenueSceneFallback} from './three/VenueSceneFallback';
import {SECTION_SPRING} from './transitions/transitionConfig';
import {useScrollTransitionContext} from './transitions/ScrollTransitionManager';

const DigitalVenueCanvas = lazy(() =>
  import('./three/DigitalVenueCanvas').then((m) => ({default: m.DigitalVenueCanvas}))
);

interface HeroSectionProps {
  onBookDemo: () => void;
}

const FLOATING_UI_CARDS = [
  {
    id: 'schedule',
    label: 'Jadwal Booking',
    value: '19:00 – 21:00',
    meta: 'Court A · Contoh Harian',
    icon: CalendarClock,
    accentClass: 'text-indigo-600 bg-indigo-50',
    desktopPos: 'sm:top-3 sm:left-0',
    floatDelay: 0,
    floatY: -5,
  },
  {
    id: 'availability',
    label: 'Ketersediaan Lapangan',
    value: 'Court B Tersedia',
    meta: 'Slot 20:00 siap dipesan',
    icon: CircleCheck,
    accentClass: 'text-emerald-700 bg-emerald-50',
    desktopPos: 'sm:top-6 sm:right-0',
    floatDelay: 0.35,
    floatY: 5,
  },
  {
    id: 'revenue',
    label: 'Ringkasan Pendapatan',
    value: 'Rp 1,45 Jt',
    meta: 'Ilustratif · Hari ini',
    icon: Wallet,
    accentClass: 'text-violet-700 bg-violet-50',
    desktopPos: 'sm:bottom-6 sm:left-0',
    floatDelay: 0.7,
    floatY: 5,
  },
  {
    id: 'confirmation',
    label: 'Konfirmasi Reservasi',
    value: 'BK-2401 · Lunas',
    meta: 'Status terverifikasi',
    icon: CheckCircle2,
    accentClass: 'text-indigo-700 bg-indigo-50',
    desktopPos: 'sm:bottom-3 sm:right-0',
    floatDelay: 1.0,
    floatY: -5,
  },
] as const;

export function HeroSection({onBookDemo}: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const {tier, reducedMotion} = useScrollTransitionContext();
  const isMobile = tier === 'mobile';
  const isTablet = tier === 'tablet';

  const {scrollYProgress} = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const smoothScroll = useSpring(scrollYProgress, SECTION_SPRING);

  // Layered backdrop parallax
  const bgParallaxY = useTransform(smoothScroll, [0, 1], [0, 56]);
  const orbTopY = useTransform(smoothScroll, [0, 1], [0, 90]);
  const orbBottomY = useTransform(smoothScroll, [0, 1], [0, -45]);
  const cardsParallaxY = useTransform(smoothScroll, [0, 1], [0, -28]);

  // 3D Perspective Zoom exit as visitor scrolls toward Operational Challenges
  const textExitScale = useTransform(smoothScroll, [0.15, 1], [1, isMobile ? 0.98 : 0.93]);
  const textExitY = useTransform(smoothScroll, [0, 1], [0, isMobile ? -12 : -28]);
  const textExitRotateX = useTransform(
    smoothScroll,
    [0.1, 1],
    [0, isMobile ? 0 : isTablet ? 2 : 4]
  );
  const textExitOpacity = useTransform(smoothScroll, [0.35, 1], [1, 0.25]);

  const visualExitScale = useTransform(smoothScroll, [0.15, 1], [1, isMobile ? 0.96 : 0.89]);
  const visualExitY = useTransform(smoothScroll, [0, 1], [0, isMobile ? -8 : -20]);
  const visualExitRotateY = useTransform(
    smoothScroll,
    [0.1, 1],
    [0, isMobile ? 0 : isTablet ? -2.5 : -5]
  );
  const visualExitOpacity = useTransform(smoothScroll, [0.4, 1], [1, 0.25]);

  return (
    <section
      ref={heroRef}
      id="beranda"
      className="relative overflow-hidden border-b border-slate-200/70 dark:border-slate-800/80 bg-[#F6F7FB] dark:bg-[#0B1020] pt-10 pb-16 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-28"
    >
      {/* Subtle geometric court-grid & radial glow backdrop */}
      <div className="pointer-events-none absolute inset-0 court-grid-bg opacity-70" aria-hidden="true" />
      <motion.div
        data-theme-stagger="decor"
        style={reducedMotion ? undefined : {y: orbTopY}}
        className="pointer-events-none absolute -top-28 right-0 h-[460px] w-[460px] rounded-full bg-gradient-to-br from-indigo-500/15 via-violet-500/12 to-cyan-400/10 dark:from-indigo-500/20 dark:via-violet-500/15 dark:to-transparent blur-3xl will-change-transform"
        aria-hidden="true"
      />
      <motion.div
        data-theme-stagger="decor"
        style={reducedMotion ? undefined : {y: orbBottomY}}
        className="pointer-events-none absolute -bottom-24 -left-16 h-[360px] w-[360px] rounded-full bg-gradient-to-tr from-indigo-400/10 to-violet-400/10 dark:from-indigo-500/15 dark:to-violet-500/10 blur-3xl will-change-transform"
        aria-hidden="true"
      />

      {/* Decorative architectural court lines SVG with slow parallax */}
      <motion.svg
        data-theme-stagger="decor"
        style={reducedMotion ? undefined : {y: bgParallaxY}}
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-12 hidden lg:block h-[540px] w-[540px] text-indigo-600/[0.06] dark:text-indigo-400/[0.1]"
        viewBox="0 0 540 540"
        fill="none"
      >
        <rect x="40" y="40" width="460" height="460" rx="24" stroke="currentColor" strokeWidth="1.5" />
        <line x1="270" y1="40" x2="270" y2="500" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
        <line x1="40" y1="270" x2="500" y2="270" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="270" cy="270" r="76" stroke="currentColor" strokeWidth="1.5" />
      </motion.svg>

      <div
        style={{perspective: isMobile || reducedMotion ? undefined : '1400px'}}
        className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left column: Value Proposition */}
          <motion.div
            data-theme-stagger="hero"
            initial={{opacity: 0, y: 18}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.45, ease: [0.16, 1, 0.3, 1]}}
            style={
              reducedMotion
                ? undefined
                : {
                    scale: textExitScale,
                    y: textExitY,
                    rotateX: textExitRotateX,
                    opacity: textExitOpacity,
                    transformStyle: isMobile ? undefined : 'preserve-3d',
                  }
            }
            className="lg:col-span-6 will-change-transform"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/90 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-700 shadow-xs dark:border-indigo-400/30 dark:bg-[#182235]/90 dark:text-indigo-300">
              <span>EARLY ACCESS</span>
              <span aria-hidden="true" className="text-indigo-300 dark:text-indigo-500">·</span>
              <span>BETA VERSION</span>
            </div>

            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC] sm:text-4xl lg:text-[2.85rem] lg:leading-[1.12] [text-wrap:balance]">
              Kelola Lapangan Lebih Mudah.{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                Kembangkan Bisnis Lebih Terarah.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              SVMS membantu pemilik venue olahraga mengelola booking, jadwal, lapangan, dan operasional bisnis dalam satu platform yang terintegrasi.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onBookDemo}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0B1020]"
              >
                <span>Book a Demo</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <a
                href={PROTOTYPE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-xs transition-all duration-150 hover:border-indigo-300 hover:text-indigo-700 hover:-translate-y-0.5 dark:border-slate-700 dark:bg-[#182235] dark:text-slate-100 dark:hover:border-indigo-400/60 dark:hover:text-indigo-300 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0B1020]"
              >
                <span>Coba Prototype</span>
                <ExternalLink className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-8 border-t border-slate-200/80 dark:border-slate-800 pt-5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Dirancang untuk pengelola dan pemilik venue:
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Badminton</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span>Futsal</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span>Padel</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span>Billiard</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span>Sports Center</span>
              </div>
            </div>
          </motion.div>

          {/* Right column: "The Digital Sports Venue" 3D Scene + Supporting UI Cards */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1]}}
            style={
              reducedMotion
                ? undefined
                : {
                    scale: visualExitScale,
                    y: visualExitY,
                    rotateY: visualExitRotateY,
                    opacity: visualExitOpacity,
                    transformStyle: isMobile ? undefined : 'preserve-3d',
                  }
            }
            className="relative lg:col-span-6 will-change-transform"
          >
            {/* Interactive 3D Viewport Stage */}
            <div className="relative h-[300px] sm:h-[430px] lg:h-[490px] w-full">
              <Suspense fallback={<VenueSceneFallback reason="loading" />}>
                <DigitalVenueCanvas />
              </Suspense>

              {/* Floating UI Indicators around the 3D court (Tablet & Desktop) */}
              <motion.div
                style={reducedMotion ? undefined : {y: cardsParallaxY}}
                className="pointer-events-none absolute inset-0 hidden sm:block"
              >
                {FLOATING_UI_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.id}
                      animate={{y: [0, card.floatY, 0]}}
                      transition={{
                        duration: 5.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: card.floatDelay,
                      }}
                      className={`flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white/95 dark:border-slate-700/70 dark:bg-[#182235]/95 px-3.5 py-2.5 shadow-[0_12px_30px_-10px_rgba(15,23,42,0.12)] dark:shadow-[0_14px_32px_-12px_rgba(2,6,23,0.65)] absolute z-10 ${card.desktopPos}`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${card.accentClass} dark:bg-indigo-500/15 dark:text-indigo-300`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                          {card.label}
                        </p>
                        <p className="font-mono text-xs font-bold text-slate-900 dark:text-[#F8FAFC] tabular-nums whitespace-nowrap">
                          {card.value}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {card.meta}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Mobile-only clean 2x2 grid below 3D scene so the 3D court stays unobstructed */}
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:hidden">
              {FLOATING_UI_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    className="flex items-start gap-2 rounded-xl border border-slate-200/90 bg-white dark:border-slate-700/70 dark:bg-[#182235] p-3 shadow-xs"
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${card.accentClass} dark:bg-indigo-500/15 dark:text-indigo-300`}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {card.label}
                      </p>
                      <p className="truncate font-mono text-xs font-bold text-slate-900 dark:text-[#F8FAFC] tabular-nums">
                        {card.value}
                      </p>
                      <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                        {card.meta}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-center text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Visualisasi 3D · Ilustrasi operasional venue digital SVMS
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
