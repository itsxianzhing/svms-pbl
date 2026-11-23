import {useRef} from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  Building2,
  CalendarClock,
  BarChart3,
  Layers,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface HorizontalScrollSectionProps {
  onBookDemo: () => void;
}

const PANELS = [
  {
    id: 'manage-venue',
    step: '01',
    tag: 'Kelola Venue Anda',
    title: 'Manage Your Venue',
    description:
      'Atur profil venue, jumlah lapangan, tarif per jam, serta jam operasional dari satu pusat kontrol yang terstruktur.',
    icon: Building2,
    accent: 'from-indigo-600 to-indigo-700',
  },
  {
    id: 'simplify-bookings',
    step: '02',
    tag: 'Sederhanakan Booking',
    title: 'Simplify Bookings',
    description:
      'Pelanggan melihat jadwal kosong secara langsung dan mengajukan booking tanpa proses tanya-jawab berulang di chat.',
    icon: CalendarClock,
    accent: 'from-violet-600 to-indigo-600',
  },
  {
    id: 'monitor-performance',
    step: '03',
    tag: 'Pantau Performa Bisnis',
    title: 'Monitor Performance',
    description:
      'Baca ringkasan pendapatan, total sesi booking, dan lapangan yang paling diminati melalui data ilustratif terstruktur.',
    icon: BarChart3,
    accent: 'from-indigo-600 to-sky-600',
  },
  {
    id: 'all-in-one',
    step: '04',
    tag: 'Satu Ekosistem Terintegrasi',
    title: 'Everything in One Platform',
    description:
      'Booking, jadwal lapangan, status pembayaran, dan ringkasan operasional menyatu untuk memudahkan pengelolaan harian.',
    icon: Layers,
    accent: 'from-slate-900 to-indigo-900',
  },
] as const;

export function HorizontalScrollSection({onBookDemo}: HorizontalScrollSectionProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();

  const {scrollYProgress} = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.45,
  });

  // Translate 4 panels across 300% travel distance (0% -> -75% of 4-panel track width)
  const x = useTransform(smoothProgress, [0, 1], ['0%', '-75%']);
  const progressBarScale = useTransform(smoothProgress, [0, 1], [0.06, 1]);
  const bgParallaxX = useTransform(smoothProgress, [0, 1], ['0%', '-12%']);

  return (
    <section
      aria-label="Eksplorasi Alur Ekosistem SVMS"
      className="relative bg-slate-950 text-white"
    >
      {/* Desktop Sticky Horizontal Scroll Track (>= lg and motion enabled) */}
      {!prefersReduced && (
        <div ref={trackRef} className="hidden lg:block relative h-[260vh]">
          <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col justify-between overflow-hidden py-8">
            {/* Subtle Parallax Background Court Lines */}
            <motion.div
              aria-hidden="true"
              style={{x: bgParallaxX}}
              className="pointer-events-none absolute inset-0 opacity-20"
            >
              <div className="h-full w-[130%] bg-[radial-gradient(circle_at_25%_30%,rgba(99,102,241,0.35),transparent_48%),radial-gradient(circle_at_75%_65%,rgba(124,58,237,0.3),transparent_48%)]" />
            </motion.div>

            {/* Top Header & Progress Rail */}
            <div className="relative z-10 mx-auto flex w-full max-w-6xl items-end justify-between gap-8 px-6 lg:px-8">
              <div>
                <p className="text-xs font-semibold tracking-wider text-indigo-300 uppercase">
                  Pengalaman Digital Sports Venue
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-white">
                  Dari Manajemen Lapangan ke Keputusan Bisnis
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-slate-400">
                  Gulir untuk menjelajah
                </span>
                <div className="h-1.5 w-36 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    style={{scaleX: progressBarScale}}
                    className="h-full origin-left rounded-full bg-gradient-to-r from-indigo-400 to-violet-400"
                  />
                </div>
              </div>
            </div>

            {/* Horizontal Sliding Track (4 Panels = 400vw) */}
            <div className="relative z-10 flex-1 flex items-center overflow-hidden py-4">
              <motion.div
                style={{x}}
                className="flex w-[400%] items-center will-change-transform"
              >
                {PANELS.map((panel, idx) => (
                  <div key={panel.id} className="w-1/4 px-6 lg:px-12">
                    <div className="mx-auto max-w-5xl">
                      <HorizontalPanelCard
                        panel={panel}
                        index={idx}
                        progress={smoothProgress}
                        onBookDemo={onBookDemo}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Bottom Step Indicator Strip */}
            <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 lg:px-8 text-xs text-slate-400">
              <div className="flex items-center gap-6">
                {PANELS.map((panel) => (
                  <span key={panel.id} className="font-mono">
                    {panel.step} · {panel.tag}
                  </span>
                ))}
              </div>
              <span className="text-slate-400">Visual ilustratif platform SVMS</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile, Tablet & Reduced-Motion Clean Vertical Layout */}
      <div className={`${prefersReduced ? 'block' : 'lg:hidden'} py-16 sm:py-20`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-indigo-300 uppercase">
              Pengalaman Digital Sports Venue
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl [text-wrap:balance]">
              Dari Manajemen Lapangan ke Keputusan Bisnis
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {PANELS.map((panel, idx) => (
              <motion.div
                key={panel.id}
                initial={{opacity: 0, y: 18}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: '-40px'}}
                transition={{duration: 0.36, delay: idx * 0.05}}
              >
                <PanelVisualContent panel={panel} onBookDemo={onBookDemo} compact />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HorizontalPanelCard({
  panel,
  index,
  progress,
  onBookDemo,
}: {
  panel: (typeof PANELS)[number];
  index: number;
  progress: ReturnType<typeof useSpring>;
  onBookDemo: () => void;
}) {
  const center = index / (PANELS.length - 1);
  const rotateY = useTransform(
    progress,
    [Math.max(0, center - 0.35), center, Math.min(1, center + 0.35)],
    [8, 0, -8]
  );
  const scale = useTransform(
    progress,
    [Math.max(0, center - 0.35), center, Math.min(1, center + 0.35)],
    [0.94, 1, 0.94]
  );

  return (
    <div style={{perspective: '1200px'}}>
      <motion.div
        style={{rotateY, scale, transformStyle: 'preserve-3d'}}
        className="will-change-transform"
      >
        <PanelVisualContent panel={panel} onBookDemo={onBookDemo} />
      </motion.div>
    </div>
  );
}

function PanelVisualContent({
  panel,
  onBookDemo,
  compact = false,
}: {
  panel: (typeof PANELS)[number];
  onBookDemo: () => void;
  compact?: boolean;
}) {
  const Icon = panel.icon;

  return (
    <div
      data-cursor-card="true"
      className={`grid grid-cols-1 gap-6 rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-xs ${
        compact ? 'p-5' : 'lg:grid-cols-12 lg:items-center lg:gap-10 p-8'
      }`}
    >
      {/* Text Narrative */}
      <div className={compact ? '' : 'lg:col-span-5'}>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${panel.accent} text-white shadow-md`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="font-mono text-xs font-semibold text-indigo-300">
            {panel.step} · {panel.tag}
          </span>
        </div>

        <h3 className="mt-5 font-display text-xl font-bold text-white sm:text-2xl">
          {panel.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          {panel.description}
        </p>

        {panel.id === 'all-in-one' && (
          <button
            type="button"
            onClick={onBookDemo}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            <span>Book a Demo</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Bespoke SVMS Product UI Card inside Panel */}
      <div className={compact ? '' : 'lg:col-span-7'}>
        <div className="rounded-2xl border border-white/15 bg-slate-900/90 p-4 sm:p-5 shadow-2xl">
          {panel.id === 'manage-venue' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
                <span className="font-semibold text-white">Daftar Lapangan Venue (Contoh)</span>
                <span className="font-mono text-indigo-300">3 Unit Aktif</span>
              </div>
              {[
                {name: 'Court A · Badminton', rate: 'Rp 90.000 / jam', hours: '07:00 – 23:00'},
                {name: 'Lapangan Futsal 1', rate: 'Rp 170.000 / jam', hours: '08:00 – 23:00'},
                {name: 'Padel Court 2', rate: 'Rp 300.000 / jam', hours: '06:00 – 22:00'},
              ].map((court) => (
                <div
                  key={court.name}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs"
                >
                  <div>
                    <p className="font-semibold text-white">{court.name}</p>
                    <p className="font-mono text-[11px] text-slate-400">{court.hours}</p>
                  </div>
                  <span className="font-mono font-semibold text-indigo-300 tabular-nums">
                    {court.rate}
                  </span>
                </div>
              ))}
            </div>
          )}

          {panel.id === 'simplify-bookings' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
                <span className="font-semibold text-white">Kalender Slot Harian (Ilustratif)</span>
                <span className="text-emerald-300 font-medium">Jadwal Tersinkron</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {slot: '17:00 – 18:00', court: 'Court A', status: 'Tersedia', open: true},
                  {slot: '18:00 – 19:00', court: 'Court A', status: 'Terisi · Smash Pagi', open: false},
                  {slot: '19:00 – 20:00', court: 'Futsal 1', status: 'Terisi · Raka P.', open: false},
                  {slot: '20:00 – 21:00', court: 'Court B', status: 'Tersedia', open: true},
                ].map((item) => (
                  <div
                    key={item.slot + item.court}
                    className={`rounded-xl border p-3 text-xs ${
                      item.open
                        ? 'border-emerald-400/30 bg-emerald-500/10'
                        : 'border-indigo-400/30 bg-indigo-500/15'
                    }`}
                  >
                    <p className="font-mono font-semibold text-white tabular-nums">{item.slot}</p>
                    <p className="mt-1 text-[11px] text-slate-300">{item.court}</p>
                    <p
                      className={`mt-1.5 text-[11px] font-semibold ${
                        item.open ? 'text-emerald-300' : 'text-indigo-200'
                      }`}
                    >
                      {item.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {panel.id === 'monitor-performance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
                <span className="font-semibold text-white">Ringkasan Mingguan (Ilustratif)</span>
                <span className="font-mono text-indigo-300 tabular-nums">166 Sesi</span>
              </div>
              <div className="grid grid-cols-7 items-end gap-2 h-28 pt-2">
                {[42, 54, 48, 66, 80, 100, 92].map((h, i) => (
                  <div key={i} className="flex h-full flex-col items-center justify-end gap-1.5">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-violet-400"
                      style={{height: `${h}%`}}
                    />
                    <span className="font-mono text-[10px] text-slate-400">
                      {['S', 'S', 'R', 'K', 'J', 'S', 'M'][i]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3.5 py-2 text-xs">
                <span className="text-slate-300">Lapangan paling aktif</span>
                <span className="font-mono font-semibold text-white">Court A · 46 sesi</span>
              </div>
            </div>
          )}

          {panel.id === 'all-in-one' && (
            <div className="grid grid-cols-2 gap-2.5">
              {[
                {title: 'Booking Online', desc: 'Jadwal tersusun otomatis'},
                {title: 'Manajemen Lapangan', desc: 'Tarif & jam terpusat'},
                {title: 'Info Pembayaran', desc: 'Status transaksi terpantau'},
                {title: 'Dashboard Bisnis', desc: 'Ringkasan data harian'},
              ].map((tile) => (
                <div
                  key={tile.title}
                  className="rounded-xl border border-white/10 bg-white/[0.05] p-3 text-xs"
                >
                  <div className="flex items-center gap-1.5 font-semibold text-white">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" aria-hidden="true" />
                    <span>{tile.title}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-300">{tile.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
