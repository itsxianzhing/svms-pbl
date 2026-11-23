import {useRef, type ReactNode} from 'react';
import {motion, useScroll, useSpring, useTransform} from 'motion/react';
import {SECTION_SPRING} from './transitionConfig';
import {useScrollTransitionContext} from './ScrollTransitionManager';
import {useTheme} from '../../context/ThemeContext';

interface BackgroundTransitionProps {
  children: ReactNode;
  fromColor: string;
  toColor: string;
  darkFromColor?: string;
  darkToColor?: string;
  className?: string;
  id?: string;
}

function resolveDarkFallback(lightHex: string): string {
  const normalized = lightHex.trim().toUpperCase();
  if (normalized === '#F6F7FB') return '#0B1020';
  if (normalized === '#FFFFFF' || normalized === '#FFF') return '#111827';
  return '#151D30';
}

export function BackgroundTransition({
  children,
  fromColor,
  toColor,
  darkFromColor,
  darkToColor,
  className = '',
  id,
}: BackgroundTransitionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const {reducedMotion} = useScrollTransitionContext();
  const {resolvedTheme} = useTheme();

  const isDark = resolvedTheme === 'dark';
  const activeFrom = isDark ? darkFromColor ?? resolveDarkFallback(fromColor) : fromColor;
  const activeTo = isDark ? darkToColor ?? resolveDarkFallback(toColor) : toColor;

  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start 95%', 'start 35%'],
  });

  const smooth = useSpring(scrollYProgress, SECTION_SPRING);
  const backgroundColor = useTransform(smooth, [0, 1], [activeFrom, activeTo]);

  return (
    <motion.section
      ref={ref}
      id={id}
      style={reducedMotion ? {backgroundColor: activeTo} : {backgroundColor}}
      className={className}
    >
      {children}
    </motion.section>
  );
}
