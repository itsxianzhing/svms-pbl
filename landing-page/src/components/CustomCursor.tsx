import {useEffect, useState} from 'react';
import {motion, useMotionValue, useSpring} from 'motion/react';
import {useTheme} from '../context/ThemeContext';

type CursorVariant = 'default' | 'action' | 'card';

export function CustomCursor() {
  const {resolvedTheme} = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [pressed, setPressed] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const ringX = useSpring(mouseX, {stiffness: 420, damping: 32, mass: 0.45});
  const ringY = useSpring(mouseY, {stiffness: 420, damping: 32, mass: 0.45});

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const evaluate = () => {
      setEnabled(pointerQuery.matches && !motionQuery.matches);
    };

    evaluate();
    pointerQuery.addEventListener('change', evaluate);
    motionQuery.addEventListener('change', evaluate);

    return () => {
      pointerQuery.removeEventListener('change', evaluate);
      motionQuery.removeEventListener('change', evaluate);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('has-custom-cursor', enabled);
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('iframe')) {
        setVisible(false);
        return;
      }

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);

      if (!target) {
        setVariant('default');
        return;
      }

      if (target.closest('button, a, [role="button"], input, select, textarea, summary')) {
        setVariant('action');
      } else if (target.closest('[data-cursor-card="true"]')) {
        setVariant('card');
      } else {
        setVariant('default');
      }
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);
    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);

    window.addEventListener('mousemove', handleMove, {passive: true});
    window.addEventListener('blur', handleLeave);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);
    window.addEventListener('mousedown', handleDown, {passive: true});
    window.addEventListener('mouseup', handleUp, {passive: true});

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('blur', handleLeave);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [enabled, mouseX, mouseY]);

  if (!enabled || !visible) {
    return null;
  }

  const ringScale = pressed
    ? 0.8
    : variant === 'action'
      ? 1.55
      : variant === 'card'
        ? 1.25
        : 1;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-150"
        style={{
          x: ringX,
          y: ringY,
          width: 28,
          height: 28,
          borderColor:
            variant === 'action'
              ? isDark
                ? 'rgba(165, 180, 252, 0.85)'
                : 'rgba(79, 70, 229, 0.72)'
              : variant === 'card'
                ? isDark
                  ? 'rgba(139, 92, 246, 0.6)'
                  : 'rgba(124, 58, 237, 0.45)'
                : isDark
                  ? 'rgba(129, 140, 248, 0.45)'
                  : 'rgba(79, 70, 229, 0.35)',
          backgroundColor:
            variant === 'action'
              ? isDark
                ? 'rgba(99, 102, 241, 0.14)'
                : 'rgba(79, 70, 229, 0.08)'
              : 'transparent',
        }}
        animate={{scale: ringScale, opacity: visible ? 1 : 0}}
        transition={{duration: 0.16, ease: [0.16, 1, 0.3, 1]}}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600 dark:bg-indigo-400"
        style={{
          x: mouseX,
          y: mouseY,
        }}
        animate={{scale: variant === 'action' ? 0.5 : 1, opacity: visible ? 1 : 0}}
        transition={{duration: 0.12}}
      />
    </>
  );
}