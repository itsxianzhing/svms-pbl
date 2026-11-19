export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-slate-200/60 motion-reduce:animate-none ${className}`} />
);
