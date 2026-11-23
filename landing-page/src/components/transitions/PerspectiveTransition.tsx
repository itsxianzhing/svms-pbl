import {useRef, type ReactNode} from 'react';
import {motion, useScroll, useSpring, useTransform} from 'motion/react';
import {SECTION_SPRING} from './transitionConfig';
import {useScrollTransitionContext} from './ScrollTransitionManager';

interface PerspectiveTransitionProps {
  children: ReactNode;
  className?: string;
  direction?: 'emerge' | 'layered-expand';
}

export function PerspectiveTransition({
  children,
  className = '',
  direction = 'emerge',
}: PerspectiveTransitionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const {tier, reducedMotion} = useScrollTransitionContext();

  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start 96%', 'start 32%'],
  });

  const smooth = useSpring(scrollYProgress, SECTION_SPRING);

  const isMobile = tier === 'mobile';
  const isTablet = tier === 'tablet';

  const startY = isMobile ? 22 : direction === 'layered-expand' ? 32 : 42;
  const startScale = isMobile ? 0.98 : direction === 'layered-expand' ? 0.93 : 0.95;
  const startRotateX = isMobile ? 0 : isTablet ? 3 : direction === 'layered-expand' ? 7 : 5;

  const y = useTransform(smooth, [0, 1], [startY, 0]);
  const scale = useTransform(smooth, [0, 1], [startScale, 1]);
  const rotateX = useTransform(smooth, [0, 1], [startRotateX, 0]);
  const opacity = useTransform(smooth, [0, 0.7], [0.42, 1]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} style={{perspective: isMobile ? undefined : '1400px'}} className={className}>
      <motion.div
        style={{
          y,
          scale,
          rotateX,
          opacity,
          transformStyle: isMobile ? undefined : 'preserve-3d',
        }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
