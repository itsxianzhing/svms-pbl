import {useRef, useState} from 'react';
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react';
import {SVMS_FEATURES} from '../../constants/svmsData';
import {FeatureProgressIndicator} from './FeatureProgressIndicator';
import {FeatureContent} from './FeatureContent';
import {FeatureVisual, MobileFeatureVisual} from './FeatureVisual';

export function FeatureShowcase() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = Boolean(useReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef = useRef(0);

  const {scrollYProgress} = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 165,
    damping: 28,
    mass: 0.45,
  });

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const next = Math.min(
      SVMS_FEATURES.length - 1,
      Math.max(0, Math.floor(latest * SVMS_FEATURES.length))
    );
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActiveIndex(next);
    }
  });

  const handleSelectFeature = (index: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const trackTop = rect.top + window.scrollY;
    const scrollableDistance = trackRef.current.offsetHeight - window.innerHeight;
    if (scrollableDistance <= 0) return;

    // Scroll cleanly into the composed state of the selected feature slice
    const targetFraction = (index + 0.68) / SVMS_FEATURES.length;
    const targetY = trackTop + scrollableDistance * targetFraction;
    window.scrollTo({
      top: targetY,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  };

  const activeFeature = SVMS_FEATURES[activeIndex];

  return (
    <div className="mt-10">
      {/* Desktop Sticky Scroll-Driven 3D Showcase (>= lg when motion is allowed) */}
      {!prefersReduced && (
        <div
          ref={trackRef}
          className="hidden lg:block relative h-[440vh]"
        >
          <div className="sticky top-16 flex min-h-[calc(100vh-4rem)] flex-col justify-center py-6">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
              <FeatureProgressIndicator
                activeIndex={activeIndex}
                progress={smoothProgress}
                onSelectFeature={handleSelectFeature}
                reducedMotion={prefersReduced}
              />

              <div className="mt-6 grid grid-cols-12 items-center gap-8 xl:gap-10">
                <div className="col-span-5">
                  <FeatureContent
                    feature={activeFeature}
                    index={activeIndex}
                    total={SVMS_FEATURES.length}
                    animateSwap
                    reducedMotion={prefersReduced}
                  />
                </div>

                <div className="col-span-7">
                  <FeatureVisual
                    activeIndex={activeIndex}
                    scrollProgress={smoothProgress}
                    reducedMotion={prefersReduced}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Reduced-Motion Static Fallback (side-by-side clean presentation) */}
      {prefersReduced && (
        <div className="hidden lg:block mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          {SVMS_FEATURES.map((feature, idx) => (
            <div
              key={feature.id}
              className="grid grid-cols-12 items-center gap-8"
            >
              <div className="col-span-5">
                <FeatureContent
                  feature={feature}
                  index={idx}
                  total={SVMS_FEATURES.length}
                  animateSwap={false}
                  reducedMotion
                />
              </div>
              <div className="col-span-7">
                <MobileFeatureVisual featureId={feature.id} reducedMotion />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tablet & Mobile Vertical Stacked Feature Showcase (< lg) */}
      <div className="lg:hidden mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
        {SVMS_FEATURES.map((feature, idx) => (
          <div key={feature.id} className="space-y-4">
            <FeatureContent
              feature={feature}
              index={idx}
              total={SVMS_FEATURES.length}
              animateSwap={false}
              reducedMotion={prefersReduced}
            />
            <MobileFeatureVisual
              featureId={feature.id}
              reducedMotion={prefersReduced}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
