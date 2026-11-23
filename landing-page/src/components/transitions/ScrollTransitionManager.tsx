import {createContext, useContext, useEffect, useState, type ReactNode} from 'react';
import {useReducedMotion} from 'motion/react';
import type {ViewportTier} from './transitionConfig';

interface ScrollTransitionContextValue {
  tier: ViewportTier;
  reducedMotion: boolean;
}

const ScrollTransitionContext = createContext<ScrollTransitionContextValue>({
  tier: 'desktop',
  reducedMotion: false,
});

function resolveTier(width: number): ViewportTier {
  if (width >= 1024) return 'desktop';
  if (width >= 640) return 'tablet';
  return 'mobile';
}

export function ScrollTransitionManager({children}: {children: ReactNode}) {
  const prefersReduced = Boolean(useReducedMotion());
  const [tier, setTier] = useState<ViewportTier>(() =>
    typeof window !== 'undefined' ? resolveTier(window.innerWidth) : 'desktop'
  );

  useEffect(() => {
    const handleResize = () => {
      const next = resolveTier(window.innerWidth);
      setTier((prev) => (prev === next ? prev : next));
    };
    handleResize();
    window.addEventListener('resize', handleResize, {passive: true});
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ScrollTransitionContext.Provider value={{tier, reducedMotion: prefersReduced}}>
      {children}
    </ScrollTransitionContext.Provider>
  );
}

export function useScrollTransitionContext() {
  return useContext(ScrollTransitionContext);
}
