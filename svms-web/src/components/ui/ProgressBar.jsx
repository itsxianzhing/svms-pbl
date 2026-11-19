export function ProgressBar({ value = 0, className = '' }) {
  return <div className={`h-2 overflow-hidden rounded-full bg-slate-100 ${className}`}><div className="h-full rounded-full bg-indigo-600 transition-[width] duration-200 ease-out motion-reduce:transition-none" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}
