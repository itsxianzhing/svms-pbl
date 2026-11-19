import { ChevronDown } from 'lucide-react';
export function Select({ label, children, ...p }) {
  return (
    <label className="block text-xs font-medium text-slate-500">
      {label && <span>{label}</span>}
      <span className="relative mt-1 block"><select {...p} className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 text-base font-normal text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:text-sm">
        {children}
      </select><ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /></span>
    </label>
  );
}
