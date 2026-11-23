import {useRef} from 'react';
import {motion, useScroll, useTransform} from 'motion/react';

interface SpatialCourtAccentProps {
  variant?: 'court' | 'net';
}

export function SpatialCourtAccent({variant = 'court'}: SpatialCourtAccentProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const rotateZ = useTransform(
    scrollYProgress,
    [0, 1],
    variant === 'court' ? [-4, 4] : [3, -3]
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-6 hidden lg:block h-44 w-64 select-none overflow-visible opacity-60"
      style={{perspective: '900px'}}
    >
      <motion.div
        style={{y, rotateZ, rotateX: 52}}
        className="h-full w-full origin-center"
      >
        {variant === 'court' ? (
          <svg
            viewBox="0 0 260 170"
            fill="none"
            className="h-full w-full text-indigo-500/20 dark:text-indigo-400/20 drop-shadow-[0_12px_20px_rgba(79,70,229,0.08)]"
          >
            <rect
              x="10"
              y="10"
              width="240"
              height="150"
              rx="14"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="rgba(79, 70, 229, 0.03)"
            />
            <line x1="130" y1="10" x2="130" y2="160" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="10" y1="40" x2="250" y2="40" stroke="currentColor" strokeWidth="1" />
            <line x1="10" y1="130" x2="250" y2="130" stroke="currentColor" strokeWidth="1" />
            <line x1="78" y1="10" x2="78" y2="160" stroke="currentColor" strokeWidth="1" />
            <line x1="182" y1="10" x2="182" y2="160" stroke="currentColor" strokeWidth="1" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 260 150"
            fill="none"
            className="h-full w-full text-violet-500/20 dark:text-violet-400/20 drop-shadow-[0_12px_20px_rgba(124,58,237,0.08)]"
          >
            <rect
              x="16"
              y="18"
              width="228"
              height="114"
              rx="18"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="rgba(124, 58, 237, 0.03)"
            />
            <path
              d="M36 75 H224 M130 28 V122"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeDasharray="5 5"
            />
            <circle cx="130" cy="75" r="24" stroke="currentColor" strokeWidth="1.25" />
          </svg>
        )}
      </motion.div>
    </div>
  );
}
