import {useRef, type ReactNode} from 'react';
import {motion, useScroll, useSpring, useTransform} from 'motion/react';
import {SECTION_SPRING} from './transitionConfig';
import {useScrollTransitionContext} from './ScrollTransitionManager';

interface CircularRevealTransitionProps {
  children: ReactNode;
  className?: string;
}

export function CircularRevealTransition({
  children,
  className = '',
}: CircularRevealTransitionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const {tier, reducedMotion} = useScrollTransitionContext();

  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start 94%', 'start 36%'],
  });

  const smooth = useSpring(scrollYProgress, SECTION_SPRING);
  const isMobile = tier === 'mobile';

  const clipPath = useTransform(smooth, (v) => {
    const p = Math.min(Math.max(v, 0), 1);
    const minRadius = isMobile ? 34 : 20;
    const radius = Math.round(minRadius + p * (150 - minRadius));
    const centerY = Math.round(62 - p * 12);
    return `circle(${radius}% at 50% ${centerY}%)`;
  });

  const scale = useTransform(smooth, [0, 1], [isMobile ? 0.97 : 0.93, 1]);
  const opacity = useTransform(smooth, [0, 0.55], [0.5, 1]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          clipPath,
          scale,
          opacity,
        }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
