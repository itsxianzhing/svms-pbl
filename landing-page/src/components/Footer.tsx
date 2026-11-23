import {motion} from 'motion/react';
import {ArrowRight, ExternalLink} from 'lucide-react';
import {NAV_ITEMS, PROTOTYPE_URL} from '../constants/svmsData';
import {SvmsLogo} from './SvmsLogo';
import {SectionTransition} from './transitions/SectionTransition';
import {MOTION_EASE, MOTION_STAGGER} from './transitions/transitionConfig';

interface FooterProps {
  onBookDemo: () => void;
}

export function Footer({onBookDemo}: FooterProps) {
  return (
    <footer className="relative overflow-x-clip border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300">
      <SectionTransition type="vertical-curtain">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Brand Column */}
            <motion.div
              initial={{opacity: 0, y: 16}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-40px'}}
              transition={{duration: 0.6, ease: MOTION_EASE.power3Out}}
              className="md:col-span-5"
            >
              <SvmsLogo />
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Sports Venue Management System — platform terintegrasi untuk membantu pemilik dan pengelola venue olahraga mengatur booking, jadwal lapangan, dan operasional bisnis.
              </p>
              <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                Status produk: Early Access · Beta Version (pengembangan berkelanjutan)
              </p>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              initial={{opacity: 0, y: 16}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-40px'}}
              transition={{
                duration: 0.6,
                delay: MOTION_STAGGER.tight,
                ease: MOTION_EASE.power3Out,
              }}
              className="md:col-span-3"
            >
              <p className="text-xs font-semibold tracking-wider text-slate-900 dark:text-[#F8FAFC] uppercase">
                Navigasi
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{opacity: 0, y: 16}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-40px'}}
              transition={{
                duration: 0.6,
                delay: MOTION_STAGGER.tight * 2,
                ease: MOTION_EASE.power3Out,
              }}
              className="md:col-span-4"
            >
              <p className="text-xs font-semibold tracking-wider text-slate-900 dark:text-[#F8FAFC] uppercase">
                Aksi &amp; Pratinjau
              </p>
              <div className="mt-3 flex flex-col items-start gap-2.5">
                <button
                  type="button"
                  onClick={onBookDemo}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors whitespace-nowrap"
                >
                  <span>Book a Demo</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <a
                  href={PROTOTYPE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>Coba Prototype</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-slate-200/80 dark:border-slate-800 pt-6 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 SVMS — Sports Venue Management System. Seluruh hak cipta dilindungi.</p>
            <p>Badminton · Futsal · Padel · Billiard · Sports Center</p>
          </div>
        </div>
      </SectionTransition>
    </footer>
  );
}
