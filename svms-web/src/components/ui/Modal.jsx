import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
export function Modal({ open, onClose, title, children, footer }) {
  const ref = useRef();
  useEffect(() => {
    if (!open) return undefined;
    ref.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const f = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', f);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', f);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-3 backdrop-blur-sm [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] sm:p-4">
      <div ref={ref} tabIndex="-1" className="flex max-h-[90dvh] w-full max-w-lg min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="min-w-0 truncate pr-3 text-lg font-semibold">{title}</h2>
          <button className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100" aria-label="Tutup" onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto p-4 sm:p-6">{children}</div>
        {footer && <div className="shrink-0 border-t border-slate-100 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-5">{footer}</div>}
      </div>
    </div>
  );
}
