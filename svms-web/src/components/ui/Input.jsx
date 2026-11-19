import { CircleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';
export function Input({ label, error, ...p }) {
  const id = p.id || p.name;
  return (
    <label className="block text-xs font-medium text-slate-500">
      {label && <span>{label}</span>}
      <input
        id={id}
        {...p}
        className={cn('mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base font-normal text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:text-sm', error && 'border-rose-300')}
      />
      {error && <span className="mt-1 flex items-center gap-1 text-xs text-rose-600"><CircleAlert size={13} />{error}</span>}
    </label>
  );
}
