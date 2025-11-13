import { ReactNode } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation.tsx';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up' | 'zoom-in';
  delay?: number;
  threshold?: number;
  className?: string;
}

export const AnimatedSection = ({
  children,
  animation = 'fade-up',
  delay = 0,
  threshold = 0.1,
  className = '',
}: AnimatedSectionProps) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold, triggerOnce: true });

  const animationClasses = {
    'fade-up': 'opacity-0 translate-y-12',
    'fade-in': 'opacity-0',
    'slide-left': 'opacity-0 -translate-x-12',
    'slide-right': 'opacity-0 translate-x-12',
    'scale-up': 'opacity-0 scale-95',
    'zoom-in': 'opacity-0 scale-90',
  };

  const visibleClasses = {
    'fade-up': 'opacity-100 translate-y-0',
    'fade-in': 'opacity-100',
    'slide-left': 'opacity-100 translate-x-0',
    'slide-right': 'opacity-100 translate-x-0',
    'scale-up': 'opacity-100 scale-100',
    'zoom-in': 'opacity-100 scale-100',
  };

  return (
    <div
      ref={elementRef as any}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? visibleClasses[animation] : animationClasses[animation]
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
