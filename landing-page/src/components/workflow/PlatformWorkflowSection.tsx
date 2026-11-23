import {motion} from 'motion/react';
import {SpatialCourtAccent} from '../three/SpatialCourtAccent';
import {BackgroundTransition} from '../transitions/BackgroundTransition';
import {MOTION_EASE} from '../transitions/transitionConfig';
import {WorkflowScrollExperience} from './WorkflowScrollExperience';

export function PlatformWorkflowSection() {
  return (
    <BackgroundTransition
      fromColor="#FFFFFF"
      toColor="#F6F7FB"
      className="relative overflow-x-clip py-16 sm:py-24"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SpatialCourtAccent variant="net" />

        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '-80px'}}
          transition={{duration: 0.55, ease: MOTION_EASE.expoOut}}
          className="relative max-w-2xl"
        >
          <p className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
            Cara Kerja Platform
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC] sm:text-3xl [text-wrap:balance]">
            Alur Sederhana dari Pengaturan Lapangan hingga Evaluasi Bisnis
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Empat tahapan utama yang menghubungkan persiapan venue, pemesanan pelanggan, hingga pemantauan harian oleh pengelola.
          </p>
        </motion.div>
      </div>

      <WorkflowScrollExperience />
    </BackgroundTransition>
  );
}
