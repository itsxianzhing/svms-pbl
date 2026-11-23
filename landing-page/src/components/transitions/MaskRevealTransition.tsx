import {useRef, type ReactNode} from 'react';
import {motion, useScroll, useSpring, useTransform} from 'motion/react';
import {SECTION_SPRING} from './transitionConfig';
import {useScrollTransitionContext} from './ScrollTransitionManager';

export type MaskMode = 'diagonal' | 'vertical-soft' | 'curtain';

interface MaskRevealTransitionProps {
  children: ReactNode;
  mode: MaskMode;
  className?: string;
}

export function MaskRevealTransition({
  children,
  mode,
  className = '',
}: MaskRevealTransitionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const {tier, reducedMotion} = useScrollTransitionContext();

  const offset: ['start 96%', 'start 42%'] | ['start 98%', 'start 66%'] =
    mode === 'curtain' ? ['start 98%', 'start 66%'] : ['start 96%', 'start 42%'];

  const {scrollYProgress} = useScroll({
    target: ref,
    offset,
  });

  const smooth = useSpring(scrollYProgress, SECTION_SPRING);
  const isMobile = tier === 'mobile';

  // Diagonal polygon clip-path: sweeps from angled wedge to full rectangle
  const diagonalClip = useTransform(smooth, (v) => {
    const p = Math.min(Math.max(v, 0), 1);
    const leftTop = Math.round((1 - p) * (isMobile ? 10 : 18));
    const rightTop = Math.round((1 - p) * (isMobile ? 2 : 4));
    return `polygon(0% ${leftTop}%, 100% ${rightTop}%, 100% 100%, 0% 100%)`;
  });

  // Soft vertical wipe / curtain inset
  const verticalClip = useTransform(smooth, (v) => {
    const p = Math.min(Math.max(v, 0), 1);
    const maxInset = mode === 'curtain' ? (isMobile ? 14 : 26) : isMobile ? 8 : 16;
    const topInset = Math.round((1 - p) * maxInset);
    return `inset(${topInset}% 0% 0% 0%)`;
  });

  const y = useTransform(
    smooth,
    [0, 1],
    [mode === 'curtain' ? (isMobile ? 18 : 30) : isMobile ? 16 : 24, 0]
  );
  const opacity = useTransform(smooth, [0, 0.65], [0.45, 1]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const clipPath = mode === 'diagonal' ? diagonalClip : verticalClip;

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          clipPath,
          y,
          opacity,
        }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
