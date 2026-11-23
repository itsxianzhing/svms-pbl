import {useRef} from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import {CalendarCheck2, Clock, ReceiptText, BarChart3} from 'lucide-react';

const STACK_LAYERS = [
  {
    id: 'booking',
    step: 'Lapisan 01',
    title: 'Online Booking',
    summary: 'Pelanggan memilih lapangan dan jam tersedia langsung tanpa menunggu balasan chat.',
    metricLabel: 'Contoh Alur',
    metricValue: 'Court A · 19:00',
    icon: CalendarCheck2,
    accent: 'bg-indigo-600 text-white',
    desktopX: -390,
    desktopY: -12,
    desktopRotate: -4,
  },
  {
    id: 'schedule',
    step: 'Lapisan 02',
    title: 'Kontrol Jadwal',
    summary: 'Slot terisi dan kosong tersinkronisasi otomatis untuk mencegah bentrok jadwal.',
    metricLabel: 'Status Slot',
    metricValue: 'Tersinkronisasi',
    icon: Clock,
    accent: 'bg-violet-600 text-white',
    desktopX: -130,
    desktopY: 10,
    desktopRotate: -1.5,
  },
  {
    id: 'payment',
    step: 'Lapisan 03',
    title: 'Status & Pembayaran',
    summary: 'Catatan status reservasi dan informasi pembayaran terpantau rapi oleh admin.',
    metricLabel: 'Contoh Status',
    metricValue: 'Terkonfirmasi · Lunas',
    icon: ReceiptText,
    accent: 'bg-sky-600 text-white',
    desktopX: 130,
    desktopY: -8,
    desktopRotate: 1.5,
  },
  {
    id: 'dashboard',
    step: 'Lapisan 04',
    title: 'Ringkasan Bisnis',
    summary: 'Pemilik melihat ringkasan pendapatan, volume booking, dan lapangan terpopuler.',
    metricLabel: 'Visibilitas',
    metricValue: 'Data Terstruktur',
    icon: BarChart3,
    accent: 'bg-slate-900 dark:bg-indigo-500 text-white',
    desktopX: 390,
    desktopY: 12,
    desktopRotate: 4,
  },
] as const;

export function StackedCardsSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();

  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['start 85%', 'center 45%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.6,
  });

  return (
    <section
      ref={containerRef}
      aria-label="Lapisan Ekosistem Operasional SVMS"
      className="relative py-16 sm:py-24 bg-[#F6F7FB] dark:bg-[#0B1020] overflow-x-clip border-b border-slate-200/70 dark:border-slate-800/80"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '-80px'}}
          transition={{duration: 0.45, ease: [0.16, 1, 0.3, 1]}}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
            Arsitektur Operasional Terpadu
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC] sm:text-3xl [text-wrap:balance]">
            Empat Lapisan Sistem yang Saling Terhubung
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Saat Anda menggulir halaman, lihat bagaimana setiap modul operasional SVMS terurai dari satu alur terpusat.
          </p>
        </motion.div>

        {/* Desktop 3D Unstacking Perspective Stage */}
        <div
          className="relative mt-12 hidden lg:flex h-[320px] items-center justify-center"
          style={{perspective: '1200px'}}
        >
          {STACK_LAYERS.map((layer, idx) => (
            <StackedDesktopCard
              key={layer.id}
              layer={layer}
              index={idx}
              progress={smoothProgress}
              reduced={Boolean(prefersReduced)}
            />
          ))}
        </div>

        {/* Tablet & Mobile Clean Responsive Grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
          {STACK_LAYERS.map((layer, idx) => {
            const Icon = layer.icon;
            return (
              <motion.div
                key={layer.id}
                initial={{opacity: 0, y: 16}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: '-40px'}}
                transition={{duration: 0.35, delay: idx * 0.05}}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-700/70 bg-white dark:bg-[#182235] p-5 shadow-xs dark:shadow-none"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${layer.accent}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      {layer.step}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
                    {layer.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {layer.summary}
                  </p>
                </div>
                <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{layer.metricLabel}</span>
                  <span className="font-mono font-semibold text-indigo-700 dark:text-indigo-300">{layer.metricValue}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StackedDesktopCard({
  layer,
  index,
  progress,
  reduced,
}: {
  layer: (typeof STACK_LAYERS)[number];
  index: number;
  progress: ReturnType<typeof useSpring>;
  reduced: boolean;
}) {
  const Icon = layer.icon;
  const stackedOffset = (index - 1.5) * 14;
  const stackedRotate = (index - 1.5) * 3.5;

  const x = useTransform(
    progress,
    [0, 1],
    [reduced ? layer.desktopX : stackedOffset, layer.desktopX]
  );
  const y = useTransform(
    progress,
    [0, 1],
    [reduced ? layer.desktopY : index * -6, layer.desktopY]
  );
  const rotateZ = useTransform(
    progress,
    [0, 1],
    [reduced ? 0 : stackedRotate, layer.desktopRotate]
  );
  const rotateY = useTransform(progress, [0, 1], [reduced ? 0 : -14 + index * 6, 0]);
  const scale = useTransform(progress, [0, 1], [reduced ? 1 : 0.93 + index * 0.02, 1]);

  return (
    <motion.div
      data-cursor-card="true"
      style={{
        x,
        y,
        rotateZ,
        rotateY,
        scale,
        zIndex: index + 1,
        transformStyle: 'preserve-3d',
      }}
      className="absolute w-[245px] rounded-2xl border border-slate-200/90 dark:border-slate-700/70 bg-white dark:bg-[#182235] p-5 shadow-[0_20px_44px_-16px_rgba(15,23,42,0.16)] dark:shadow-[0_20px_44px_-16px_rgba(0,0,0,0.5)] will-change-transform"
    >
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${layer.accent}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          {layer.step}
        </span>
      </div>

      <h3 className="mt-4 font-display text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
        {layer.title}
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{layer.summary}</p>

      <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-[11px]">
        <span className="text-slate-500 dark:text-slate-400">{layer.metricLabel}</span>
        <span className="font-mono font-semibold text-indigo-700 dark:text-indigo-300">{layer.metricValue}</span>
      </div>
    </motion.div>
  );
}
