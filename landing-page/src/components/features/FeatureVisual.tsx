import {useEffect, useRef, useState} from 'react';
import {
  animate,
  motion,
  type MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import {SVMS_FEATURES, type FeatureItem} from '../../constants/svmsData';
import {BookingMockup} from './mockups/BookingMockup';
import {ScheduleMockup} from './mockups/ScheduleMockup';
import {VenueCourtMockup} from './mockups/VenueCourtMockup';
import {DashboardMockup} from './mockups/DashboardMockup';
import {StatusPaymentMockup} from './mockups/StatusPaymentMockup';
import {CustomerMockup} from './mockups/CustomerMockup';

function renderMockup(
  featureId: FeatureItem['id'],
  progress: MotionValue<number>,
  reducedMotion: boolean
) {
  switch (featureId) {
    case 'online-booking':
      return <BookingMockup progress={progress} reducedMotion={reducedMotion} />;
    case 'schedule-management':
      return <ScheduleMockup progress={progress} reducedMotion={reducedMotion} />;
    case 'venue-court':
      return <VenueCourtMockup progress={progress} reducedMotion={reducedMotion} />;
    case 'business-dashboard':
      return <DashboardMockup progress={progress} reducedMotion={reducedMotion} />;
    case 'status-payment':
      return <StatusPaymentMockup progress={progress} reducedMotion={reducedMotion} />;
    case 'customer-management':
      return <CustomerMockup progress={progress} reducedMotion={reducedMotion} />;
    default:
      return null;
  }
}

interface DesktopStageLayerProps {
  feature: FeatureItem;
  index: number;
  total: number;
  activeIndex: number;
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
}

function DesktopStageLayer({
  feature,
  index,
  total,
  activeIndex,
  scrollProgress,
  reducedMotion,
}: DesktopStageLayerProps) {
  const segStart = index / total;
  const segEnd = (index + 1) / total;
  const enterStart = Math.max(0, segStart - 0.035);
  const enterEnd = Math.min(1, segStart + 0.04);
  const exitStart = Math.max(0, segEnd - 0.035);
  const exitEnd = Math.min(1, segEnd + 0.035);

  const isFirst = index === 0;
  const isLast = index === total - 1;

  // Normalized 0..1 progress within this feature's scroll slice
  const localProgress = useTransform(scrollProgress, [segStart, segEnd], [0, 1]);

  // Coordinated 3D entry & exit transitions across feature boundaries
  const inputRange = isFirst
    ? [0, exitStart, exitEnd]
    : isLast
      ? [enterStart, enterEnd, 1]
      : [enterStart, enterEnd, exitStart, exitEnd];

  const opacity = useTransform(
    scrollProgress,
    inputRange,
    isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollProgress,
    inputRange,
    isFirst ? [0, 0, -28] : isLast ? [32, 0, 0] : [32, 0, 0, -28]
  );

  const z = useTransform(
    scrollProgress,
    inputRange,
    isFirst ? [0, 0, -90] : isLast ? [60, 0, 0] : [60, 0, 0, -90]
  );

  const rotateX = useTransform(
    scrollProgress,
    inputRange,
    isFirst ? [0, 0, 8] : isLast ? [-8, 0, 0] : [-8, 0, 0, 8]
  );

  const scale = useTransform(
    scrollProgress,
    inputRange,
    isFirst ? [1, 1, 0.94] : isLast ? [0.95, 1, 1] : [0.95, 1, 1, 0.94]
  );

  const isActive = activeIndex === index;

  return (
    <motion.div
      aria-hidden={!isActive}
      style={
        reducedMotion
          ? {opacity: isActive ? 1 : 0}
          : {
              opacity,
              y,
              z,
              rotateX,
              scale,
              transformStyle: 'preserve-3d',
            }
      }
      className={`col-start-1 row-start-1 w-full will-change-transform ${
        isActive ? 'relative z-10 pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {renderMockup(feature.id, localProgress, reducedMotion)}
    </motion.div>
  );
}

interface FeatureVisualProps {
  activeIndex: number;
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
}

export function FeatureVisual({
  activeIndex,
  scrollProgress,
  reducedMotion,
}: FeatureVisualProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [canTilt, setCanTilt] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {stiffness: 200, damping: 24, mass: 0.6});
  const smoothY = useSpring(mouseY, {stiffness: 200, damping: 24, mass: 0.6});

  const tiltRotateY = useTransform(smoothX, [-0.5, 0.5], [-4.5, 4.5]);
  const tiltRotateX = useTransform(smoothY, [-0.5, 0.5], [4.5, -4.5]);

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const update = () => {
      setCanTilt(pointerQuery.matches && window.innerWidth >= 1024 && !reducedMotion);
    };
    update();
    pointerQuery.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => {
      pointerQuery.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, [reducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
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
    <div
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{perspective: '1400px'}}
      className="relative w-full"
    >
      {/* Subtle Layered Ambient Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 rounded-3xl bg-gradient-to-br from-indigo-500/[0.06] via-transparent to-violet-500/[0.06]"
      />

      <motion.div
        style={
          canTilt
            ? {
                rotateX: tiltRotateX,
                rotateY: tiltRotateY,
                transformStyle: 'preserve-3d',
              }
            : {transformStyle: 'preserve-3d'}
        }
        className="relative grid grid-cols-1 grid-rows-1 items-center"
      >
        {SVMS_FEATURES.map((feature, idx) => (
          <DesktopStageLayer
            key={feature.id}
            feature={feature}
            index={idx}
            total={SVMS_FEATURES.length}
            activeIndex={activeIndex}
            scrollProgress={scrollProgress}
            reducedMotion={reducedMotion}
          />
        ))}
      </motion.div>
    </div>
  );
}

interface MobileFeatureVisualProps {
  featureId: FeatureItem['id'];
  reducedMotion: boolean;
}

export function MobileFeatureVisual({
  featureId,
  reducedMotion,
}: MobileFeatureVisualProps) {
  const localProgress = useMotionValue(reducedMotion ? 1 : 0);
  const hasPlayedRef = useRef(false);

  return (
    <motion.div
      initial={reducedMotion ? undefined : {opacity: 0, y: 20, rotateX: 6}}
      whileInView={reducedMotion ? undefined : {opacity: 1, y: 0, rotateX: 0}}
      viewport={{once: true, margin: '-40px'}}
      transition={{duration: 0.45, ease: [0.16, 1, 0.3, 1]}}
      onViewportEnter={() => {
        if (reducedMotion || hasPlayedRef.current) return;
        hasPlayedRef.current = true;
        animate(localProgress, 1, {duration: 1.05, ease: [0.16, 1, 0.3, 1]});
      }}
      style={{perspective: '1000px'}}
      className="w-full"
    >
      {renderMockup(featureId, localProgress, reducedMotion)}
    </motion.div>
  );
}
