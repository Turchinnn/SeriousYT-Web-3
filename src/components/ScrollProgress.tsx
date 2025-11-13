import { useScrollProgress } from '../hooks/useScrollAnimation.tsx';

export const ScrollProgress = () => {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-background/20">
      <div
        className="h-full bg-primary transition-all duration-500 ease-out "
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
