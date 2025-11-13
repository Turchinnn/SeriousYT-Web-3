import { ReactNode } from 'react';
import { useParallax } from '../hooks/useScrollAnimation.tsx';

interface ParallaxBackgroundProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxBackground = ({
  children,
  speed = 0.5,
  className = '',
}: ParallaxBackgroundProps) => {
  const offset = useParallax(speed);

  return (
    <div
      className={`transition-transform duration-100 ${className}`}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  );
};
