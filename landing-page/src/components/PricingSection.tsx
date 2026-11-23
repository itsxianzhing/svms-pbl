import {useRef} from 'react';
import {motion, useScroll, useSpring, useTransform} from 'motion/react';
import {ArrowRight, Check} from 'lucide-react';
import {Feature3DCard} from './motion/Feature3DCard';
import {BackgroundTransition} from './transitions/BackgroundTransition';
import {SectionTransition} from './transitions/SectionTransition';
import {MOTION_EASE, SECTION_SPRING} from './transitions/transitionConfig';
import {useScrollTransitionContext} from './transitions/ScrollTransitionManager';

interface PricingSectionProps {
  onBookDemo: () => void;
}

export function PricingSection({onBookDemo}: PricingSectionProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const {tier, reducedMotion} = useScrollTransitionContext();
  const isMobile = tier === 'mobile';

  const {scrollYProgress} = useScroll({
    target: stageRef,
    offset: ['start 92%', 'start 35%'],
  });
  const smooth = useSpring(scrollYProgress, SECTION_SPRING);

  const plateScale = useTransform(smooth, [0, 1], [isMobile ? 0.96 : 0.88, 1]);
  const plateRotateX = useTransform(smooth, [0, 1], [isMobile ? 0 : 8, 0]);
  const plateOpacity = useTransform(smooth, [0, 0.7], [0.25, 1]);

  return (
    <BackgroundTransition
      id="paket"
      fromColor="#F6F7FB"
      toColor="#FFFFFF"
      className="relative overflow-x-clip py-16 sm:py-24 border-y border-slate-200/70 dark:border-slate-800/80"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '-80px'}}
          transition={{duration: 0.65, ease: MOTION_EASE.expoOut}}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
            Penawaran Penggunaan SVMS
          </p>
          <div className="overflow-hidden">
            <motion.h2
              initial={{opacity: 0, y: 24}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-60px'}}
              transition={{duration: 0.7, ease: MOTION_EASE.expoOut}}
              className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC] sm:text-3xl [text-wrap:balance]"
            >
              Mulai Uji Coba atau Diskusikan Kebutuhan Bisnis Anda
            </motion.h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Ketentuan final harga dan penyesuaian paket dibahas langsung bersama tim SVMS saat sesi demonstrasi produk agar sesuai dengan skala venue Anda.
          </p>
        </motion.div>

        {/* Layered 3D Card Expansion Foundation + Pricing Cards */}
        <div
          ref={stageRef}
          style={{perspective: isMobile || reducedMotion ? undefined : '1400px'}}
          className="relative mx-auto mt-12 max-w-5xl"
        >
          {/* Expanding Architectural Foundation Plate */}
          <motion.div
            aria-hidden="true"
            style={
              reducedMotion
                ? undefined
                : {
                    scale: plateScale,
                    rotateX: plateRotateX,
                    opacity: plateOpacity,
                    transformStyle: isMobile ? undefined : 'preserve-3d',
                  }
            }
            className="pointer-events-none absolute -inset-x-4 -inset-y-5 hidden sm:block rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-[#F6F7FB]/70 dark:bg-[#151D30]/80 will-change-transform"
          />

          <SectionTransition type="layered-expand">
            <div className="relative mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 items-stretch">
              {/* Package 1: Free Trial */}
              <Feature3DCard index={0} tiltStrength={4}>
                <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-[#F6F7FB] dark:bg-[#182235] p-6 sm:p-8 transition-shadow duration-200 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md dark:hover:shadow-none">
                  <div>
                    <span className="inline-block rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1E293B] px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
                      Mulai Gratis
                    </span>

                    <div className="mt-5">
                      <h3 className="font-display text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">Free Trial</h3>
                      <p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-[#F8FAFC]">
                        Gratis
                      </p>
                      <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        15 hari atau hingga 100 booking (mana yang tercapai lebih dahulu)
                      </p>
                    </div>

                    <ul className="mt-6 space-y-3 border-t border-slate-200/80 dark:border-slate-700/70 pt-6 text-sm text-slate-700 dark:text-slate-300">
                      {[
                        'Akses gratis selama 15 hari atau hingga 100 booking',
                        'Berlaku berdasarkan batas yang tercapai lebih dahulu',
                        'Akses ke fungsionalitas inti SVMS yang tersedia saat ini',
                        'Cocok untuk mencoba alur sistem sebelum memutuskan lanjut',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={onBookDemo}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1E293B] px-5 py-3 text-sm font-semibold text-slate-900 dark:text-[#F8FAFC] shadow-xs dark:shadow-none transition-all duration-150 hover:border-indigo-400 dark:hover:border-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#182235]"
                    >
                      <span>Book a Demo</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <p className="mt-3 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      Ketentuan uji coba dan panduan onboarding akan dibahas saat sesi demonstrasi produk.
                    </p>
                  </div>
                </div>
              </Feature3DCard>

              {/* Package 2: Business */}
              <Feature3DCard index={1} tiltStrength={4}>
                <div className="relative flex h-full flex-col justify-between rounded-2xl border-2 border-indigo-600 dark:border-indigo-500 bg-white dark:bg-[#1E293B] p-6 sm:p-8 shadow-[0_18px_44px_-16px_rgba(79,70,229,0.2)] dark:shadow-[0_18px_44px_-16px_rgba(79,70,229,0.28)] transition-shadow duration-200 hover:shadow-[0_24px_56px_-16px_rgba(79,70,229,0.28)] dark:hover:shadow-[0_24px_56px_-16px_rgba(99,102,241,0.34)]">
                  <div>
                    <span className="inline-block rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1 text-xs font-semibold text-white">
                      Untuk Operasional Bisnis
                    </span>

                    <div className="mt-5">
                      <h3 className="font-display text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">Business</h3>
                      <p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-indigo-700 dark:text-indigo-300">
                        Custom Pricing
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        Untuk pemilik venue olahraga yang ingin mengelola operasional bisnisnya melalui SVMS secara berkelanjutan.
                      </p>
                    </div>

                    <ul className="mt-6 space-y-3 border-t border-slate-100 dark:border-slate-700/70 pt-6 text-sm text-slate-700 dark:text-slate-200">
                      {[
                        'Manajemen booking terpusat untuk alur pemesanan harian',
                        'Pengelolaan profil venue, daftar lapangan, tarif, dan jadwal',
                        'Dashboard bisnis untuk ringkasan operasional & pendapatan',
                        'Visibilitas status booking dan informasi pembayaran',
                        'Panduan produk serta diskusi onboarding bersama tim SVMS',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={onBookDemo}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-indigo-700 dark:hover:bg-indigo-500 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#1E293B]"
                    >
                      <span>Book a Demo</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <p className="mt-3 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      Harga final dan detail paket dibahas bersama tim SVMS sesuai kebutuhan operasional venue Anda.
                    </p>
                  </div>
                </div>
              </Feature3DCard>
            </div>
          </SectionTransition>
        </div>
      </div>
    </BackgroundTransition>
  );
}
