import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
export function Modal({ open, onClose, title, children, footer }) {
  const ref = useRef();
  useEffect(() => {
    if (open) ref.current?.focus();
    const f = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div ref={ref} tabIndex="-1" className="flex max-h-[90dvh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100" aria-label="Tutup" onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="overflow-y-auto p-5 sm:p-6">{children}</div>
        {footer && <div className="shrink-0 border-t border-slate-100 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-5">{footer}</div>}
      </div>
    </div>
  );
}
