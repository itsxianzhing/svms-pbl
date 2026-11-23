export const MOTION_EASE = {
  power3Out: [0.22, 1, 0.36, 1] as const,
  power4InOut: [0.76, 0, 0.24, 1] as const,
  expoOut: [0.16, 1, 0.3, 1] as const,
};

export const SECTION_SPRING = {
  stiffness: 140,
  damping: 26,
  mass: 0.5,
} as const;

export const MOTION_DURATION = {
  fast: 0.6,
  base: 0.8,
  slow: 1.05,
} as const;

export const MOTION_STAGGER = {
  tight: 0.06,
  base: 0.09,
} as const;

export type ViewportTier = 'desktop' | 'tablet' | 'mobile';

export type TransitionType =
  | 'perspective-zoom'
  | 'diagonal-mask'
  | 'layered-expand'
  | 'color-wipe'
  | 'circular-reveal'
  | 'vertical-curtain';
