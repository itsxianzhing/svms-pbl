export function SegmentedControl({ options, value, onChange }) {
  return <div className="flex min-w-max gap-1 rounded-xl bg-slate-100 p-1" role="tablist">
    {options.map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={value === key} onClick={() => onChange(key)} className={`min-h-10 rounded-lg px-3 text-sm font-medium transition motion-reduce:transition-none ${value === key ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{label}</button>)}
  </div>;
}
