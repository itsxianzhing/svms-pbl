import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {Menu, X, ArrowRight} from 'lucide-react';
import {NAV_ITEMS} from '../constants/svmsData';
import {SvmsLogo} from './SvmsLogo';
import {ThemeToggle} from './ThemeToggle';

interface NavbarProps {
  onBookDemo: () => void;
}

export function Navbar({onBookDemo}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>('beranda');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);

      const offsets = NAV_ITEMS.map((item) => {
        const el = document.getElementById(item.id);
        if (!el) return {id: item.id, top: Infinity};
        return {id: item.id, top: Math.abs(el.getBoundingClientRect().top - 120)};
      });
      offsets.sort((a, b) => a.top - b.top);
      if (offsets[0] && offsets[0].top < 600) {
        setActiveId(offsets[0].id);
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({behavior: 'smooth'});
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-white/88 dark:bg-[#0B1020]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_1px_12px_rgba(15,23,42,0.04)] dark:shadow-[0_1px_16px_rgba(2,6,23,0.45)]'
          : 'bg-[#F6F7FB]/85 dark:bg-[#0B1020]/80 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 lg:px-8">
        <a
          href="#beranda"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('beranda');
          }}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0B1020] rounded-lg"
          aria-label="SVMS Beranda"
        >
          <SvmsLogo />
        </a>

        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-md ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
                    transition={{type: 'spring', stiffness: 420, damping: 32}}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <ThemeToggle />

          <button
            type="button"
            onClick={onBookDemo}
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0B1020]"
          >
            <span>Book a Demo</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700/80 dark:bg-[#182235] dark:text-slate-200 dark:hover:bg-[#1E293B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{opacity: 0, y: -8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.18, ease: [0.16, 1, 0.3, 1]}}
            className="md:hidden border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-[#111827] px-4 py-4 shadow-lg"
          >
            <nav aria-label="Navigasi seluler" className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeId === item.id
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-[#182235]'
                  }`}
                >
                  <span>{item.label}</span>
                  {activeId === item.id && (
                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      Aktif
                    </span>
                  )}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onBookDemo();
                }}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                <span>Book a Demo</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
