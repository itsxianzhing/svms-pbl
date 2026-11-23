import {motion} from 'motion/react';
import {FeatureShowcase} from './features/FeatureShowcase';
import {FeatureTransition} from './features/FeatureTransition';
import {SectionTransition} from './transitions/SectionTransition';
import {MOTION_EASE} from './transitions/transitionConfig';

export function FeaturesSection() {
  return (
    <section
      id="fitur"
      className="relative overflow-x-clip bg-white dark:bg-[#111827] pb-16 sm:pb-24"
    >
      {/* Diagonal Mask Reveal sweeping into #F6F7FB / #0B1020 while keeping sticky descendants unrestricted */}
      <SectionTransition type="diagonal-mask">
        <div className="bg-[#F6F7FB] dark:bg-[#0B1020] pt-16 sm:pt-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                  Fitur &amp; Manfaat Utama
                </p>
                <div className="overflow-hidden">
                  <motion.h2
                    initial={{opacity: 0, y: 24}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true, margin: '-60px'}}
                    transition={{duration: 0.65, ease: MOTION_EASE.expoOut}}
                    className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC] sm:text-3xl [text-wrap:balance]"
                  >
                    Kapabilitas Inti untuk Operasional Venue Olahraga Anda
                  </motion.h2>
                </div>
              </div>
              <motion.p
                initial={{opacity: 0, y: 14}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: '-60px'}}
                transition={{duration: 0.65, delay: 0.08, ease: MOTION_EASE.power3Out}}
                className="max-w-sm text-sm text-slate-600 dark:text-slate-300"
              >
                Setiap modul dirancang untuk menyederhanakan pekerjaan admin dan memberi kejelasan bagi pemilik bisnis.
              </motion.p>
            </div>
          </div>
        </div>
      </SectionTransition>

      {/* Main #F6F7FB / #0B1020 canvas carrying the unclipped sticky FeatureShowcase */}
      <div className="bg-[#F6F7FB] dark:bg-[#0B1020]">
        <FeatureShowcase />
        <FeatureTransition />
      </div>
    </section>
  );
}
