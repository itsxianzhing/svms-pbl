import { CircleAlert } from 'lucide-react';
export function Textarea({ label, error, ...p }) {
  return (
    <label className="block text-xs font-medium text-slate-500">
      {label}
      <textarea
        {...p}
        className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-base font-normal text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:text-sm"
      />
      {error && <span className="mt-1 flex items-center gap-1 text-xs text-rose-600"><CircleAlert size={13} />{error}</span>}
    </label>
  );
}
