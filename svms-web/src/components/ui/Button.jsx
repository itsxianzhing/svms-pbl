import { cn } from '@/lib/cn';
export function Button({ variant = 'primary', size = 'md', isLoading, children, className, ...p }) {
  const styles = {
    primary: 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700',
    secondary: 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50',
    danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700',
    ghost: 'text-slate-600 hover:bg-slate-100',
  };
  return (
    <button
      {...p}
      disabled={isLoading || p.disabled}
      className={cn(
        'inline-flex min-h-11 items-center justify-center rounded-xl font-medium transition duration-200 ease-out active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 motion-reduce:transition-none',
        styles[variant],
         size === 'sm' ? 'min-h-10 px-3 text-sm' : 'px-4 text-sm',
        className
      )}
    >
      {isLoading ? 'Memproses...' : children}
    </button>
  );
}
