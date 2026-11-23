import {useId, useRef} from 'react';
import {motion, useReducedMotion} from 'motion/react';
import {useTheme} from '../context/ThemeContext';

const SUN_RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export function ThemeToggle() {
  const {resolvedTheme, isTransitioning, toggleTheme} = useTheme();
  const prefersReduced = Boolean(useReducedMotion());
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const maskId = useId();

  const isDark = resolvedTheme === 'dark';

  const handleClick = () => {
    if (isTransitioning) return;
    const rect = buttonRef.current?.getBoundingClientRect();
    const origin = rect
      ? {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        }
      : undefined;
    toggleTheme(origin);
  };

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      aria-pressed={isDark}
      aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      title={isDark ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
      whileHover={prefersReduced ? undefined : {scale: 1.05}}
      whileTap={prefersReduced ? undefined : {scale: 0.9}}
      transition={{duration: 0.18, ease: [0.22, 1, 0.36, 1]}}
      className="group relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-amber-500 shadow-xs transition-colors duration-200 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700/80 dark:bg-[#182235] dark:text-indigo-300 dark:hover:border-indigo-400/60 dark:hover:bg-[#1E293B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0B1020]"
    >
      {/* Subtle restrained moon glow in dark mode */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300 ${
          isDark
            ? 'opacity-100 shadow-[inset_0_0_12px_rgba(129,140,248,0.18)]'
            : 'opacity-0'
        }`}
      />

      {/* Animated SVG Sun <-> Crescent Moon */}
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        animate={{rotate: isDark ? -28 : 0}}
        transition={{
          duration: prefersReduced ? 0 : 0.38,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 overflow-visible"
      >
        <defs>
          <mask id={maskId}>
            <rect x="0" y="0" width="24" height="24" fill="white" />
            <motion.circle
              cx="12"
              cy="12"
              r="7.5"
              fill="black"
              initial={false}
              animate={{
                cx: isDark ? 16.5 : 27,
                cy: isDark ? 8.5 : 4,
              }}
              transition={{
                duration: prefersReduced ? 0 : 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </mask>
        </defs>

        {/* Center Disc morphing from Sun to Crescent Moon */}
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          mask={`url(#${maskId})`}
          initial={false}
          animate={{r: isDark ? 8 : 4.8}}
          transition={{
            duration: prefersReduced ? 0 : 0.32,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

        {/* Sun Rays rotating and fading out smoothly in dark mode */}
        <motion.g
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={false}
          animate={{
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0.55 : 1,
            rotate: isDark ? 45 : 0,
          }}
          style={{transformOrigin: '12px 12px'}}
          transition={{
            duration: prefersReduced ? 0 : 0.28,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={
            prefersReduced
              ? ''
              : 'transition-transform duration-500 group-hover:rotate-45'
          }
        >
          {SUN_RAY_ANGLES.map((deg) => (
            <line
              key={deg}
              x1="12"
              y1="2.2"
              x2="12"
              y2="4.1"
              transform={`rotate(${deg} 12 12)`}
            />
          ))}
        </motion.g>
      </motion.svg>
    </motion.button>
  );
}
