import {useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {ChevronDown} from 'lucide-react';
import {FAQ_ITEMS} from '../constants/svmsData';
import {BackgroundTransition} from './transitions/BackgroundTransition';
import {SectionTransition} from './transitions/SectionTransition';
import {MOTION_EASE} from './transitions/transitionConfig';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <BackgroundTransition
      id="faq"
      fromColor="#FFFFFF"
      toColor="#F6F7FB"
      className="relative overflow-x-clip py-16 sm:py-24"
    >
      <SectionTransition type="color-wipe">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
              Pertanyaan Umum
            </p>
            <div className="overflow-hidden">
              <motion.h2
                initial={{opacity: 0, y: 22}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: '-60px'}}
                transition={{duration: 0.65, ease: MOTION_EASE.power3Out}}
                className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC] sm:text-3xl [text-wrap:balance]"
              >
                Informasi Penting Seputar SVMS
              </motion.h2>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
              Jawaban ringkas mengenai cara kerja, status Beta, masa uji coba, dan pengajuan demo.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;
              const panelId = `faq-panel-${idx}`;
              const buttonId = `faq-button-${idx}`;

              return (
                <motion.div
                  key={item.question}
                  initial={{opacity: 0, y: 14}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true, margin: '-30px'}}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(idx * 0.04, 0.24),
                    ease: MOTION_EASE.power3Out,
                  }}
                  className={`overflow-hidden rounded-2xl border bg-white dark:bg-[#182235] transition-colors ${
                    isOpen
                      ? 'border-indigo-200 dark:border-indigo-400/50 shadow-xs dark:shadow-none'
                      : 'border-slate-200/90 dark:border-slate-700/70'
                  }`}
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-600"
                    >
                      <span className="font-display text-sm font-semibold text-slate-900 dark:text-[#F8FAFC] sm:text-base">
                        {item.question}
                      </span>
                      <motion.span
                        animate={{rotate: isOpen ? 180 : 0}}
                        transition={{duration: 0.2}}
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          isOpen
                            ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      </motion.span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{height: 0, opacity: 0}}
                        animate={{height: 'auto', opacity: 1}}
                        exit={{height: 0, opacity: 0}}
                        transition={{duration: 0.24, ease: MOTION_EASE.expoOut}}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:px-6">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </SectionTransition>
    </BackgroundTransition>
  );
}
