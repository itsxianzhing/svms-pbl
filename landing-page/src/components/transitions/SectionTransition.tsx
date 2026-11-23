import type {ReactNode} from 'react';
import type {TransitionType} from './transitionConfig';
import {PerspectiveTransition} from './PerspectiveTransition';
import {MaskRevealTransition} from './MaskRevealTransition';
import {CircularRevealTransition} from './CircularRevealTransition';

interface SectionTransitionProps {
  type: TransitionType;
  children: ReactNode;
  className?: string;
}

export function SectionTransition({
  type,
  children,
  className = '',
}: SectionTransitionProps) {
  switch (type) {
    case 'perspective-zoom':
      return (
        <PerspectiveTransition direction="emerge" className={className}>
          {children}
        </PerspectiveTransition>
      );
    case 'layered-expand':
      return (
        <PerspectiveTransition direction="layered-expand" className={className}>
          {children}
        </PerspectiveTransition>
      );
    case 'diagonal-mask':
      return (
        <MaskRevealTransition mode="diagonal" className={className}>
          {children}
        </MaskRevealTransition>
      );
    case 'color-wipe':
      return (
        <MaskRevealTransition mode="vertical-soft" className={className}>
          {children}
        </MaskRevealTransition>
      );
    case 'vertical-curtain':
      return (
        <MaskRevealTransition mode="curtain" className={className}>
          {children}
        </MaskRevealTransition>
      );
    case 'circular-reveal':
      return (
        <CircularRevealTransition className={className}>
          {children}
        </CircularRevealTransition>
      );
  }
}
