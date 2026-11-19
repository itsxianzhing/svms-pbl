import { useEffect } from 'react';
export function Drawer({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const escape = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', escape);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', escape); };
  }, [open, onClose]);
  if (!open) return null;
  return <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
    <button className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-label="Tutup menu" onClick={onClose} />
    <aside className="relative flex h-dvh w-72 max-w-[85vw] flex-col bg-white p-4 shadow-xl">{children}</aside>
  </div>;
}
