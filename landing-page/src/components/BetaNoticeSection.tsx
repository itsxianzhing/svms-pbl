import {motion} from 'motion/react';
import {Compass, MessageSquare, RefreshCw} from 'lucide-react';
import {BackgroundTransition} from './transitions/BackgroundTransition';
import {MOTION_EASE} from './transitions/transitionConfig';

export function BetaNoticeSection() {
  return (
    <BackgroundTransition
      fromColor="#F6F7FB"
      toColor="#FFFFFF"
      className="relative overflow-x-clip py-14 sm:py-20 border-t border-slate-200/70 dark:border-slate-800/80"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{opacity: 0, y: 18}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '-80px'}}
          transition={{duration: 0.65, ease: MOTION_EASE.expoOut}}
          className="rounded-2xl border border-indigo-200/80 dark:border-indigo-500/25 bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/60 dark:from-[#182235] dark:via-[#151D30] dark:to-[#1E293B] p-6 sm:p-10"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                Transparansi Pengembangan · Beta Version
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC] sm:text-3xl">
                SVMS Terus Berkembang.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                SVMS saat ini masih berada dalam tahap Beta. Kami terus mengembangkan fitur, menyempurnakan pengalaman pengguna, dan memperbaiki sistem berdasarkan proses pengujian serta masukan pengguna.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-[#182235] p-3.5">
                <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-[#F8FAFC]">Penyempurnaan Berkelanjutan</p>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                    Alur dan antarmuka terus dievaluasi dari hasil pengujian lapangan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-[#182235] p-3.5">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-[#F8FAFC]">Masukan Pemilik Venue</p>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                    Sesi demo menjadi ruang diskusi langsung terkait kebutuhan venue Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-[#182235] p-3.5">
                <Compass className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-[#F8FAFC]">Fokus pada Kejelasan</p>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                    Hanya kemampuan yang sudah tersedia yang kami hadirkan di produk ini.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </BackgroundTransition>
  );
}
