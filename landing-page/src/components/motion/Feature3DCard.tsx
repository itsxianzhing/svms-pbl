import {useEffect, useRef, useState, type ReactNode} from 'react';
import {motion, useMotionValue, useReducedMotion, useSpring, useTransform} from 'motion/react';

interface Feature3DCardProps {
  children: ReactNode;
  className?: string;
  index?: number;
  tiltStrength?: number;
}

export function Feature3DCard({
  children,
  className = '',
  index = 0,
  tiltStrength = 6,
}: Feature3DCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();
  const [canHoverTilt, setCanHoverTilt] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = {stiffness: 260, damping: 24, mass: 0.6};
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-tiltStrength, tiltStrength]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [tiltStrength, -tiltStrength]);

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const check = () => {
      setCanHoverTilt(pointerQuery.matches && window.innerWidth >= 1024 && !prefersReduced);
    };
    check();
    pointerQuery.addEventListener('change', check);
    window.addEventListener('resize', check);
    return () => {
      pointerQuery.removeEventListener('change', check);
      window.removeEventListener('resize', check);
    };
  }, [prefersReduced]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHoverTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(nx);
    mouseY.set(ny);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div style={{perspective: '1100px'}} className="h-full">
      <motion.div
        ref={cardRef}
        data-cursor-card="true"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={
          prefersReduced
            ? {opacity: 0}
            : {opacity: 0, y: 26, rotateX: 9, rotateY: index % 2 === 0 ? -3 : 3, scale: 0.97}
        }
        whileInView={{opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1}}
        viewport={{once: true, margin: '-50px'}}
        transition={{
          duration: 0.48,
          delay: Math.min(index * 0.06, 0.28),
          ease: [0.16, 1, 0.3, 1],
        }}
        style={
          canHoverTilt
            ? {rotateX, rotateY, transformStyle: 'preserve-3d'}
            : {transformStyle: 'preserve-3d'}
        }
        whileHover={canHoverTilt ? {y: -4} : undefined}
        className={`h-full will-change-transform ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
