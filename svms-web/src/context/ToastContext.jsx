import { createContext, useContext, useState } from 'react';
import { CheckCircle2, Info, X, CircleAlert } from 'lucide-react';
const C = createContext();
export const useToast = () => useContext(C);
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const show = (message, type = 'info') => {
    const id = Date.now();
    setItems((x) => [...x, { id, message, type }]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 3500);
  };
  return (
    <C.Provider value={{ show }}>
      {children}
      <div className="fixed left-4 right-4 top-4 z-50 space-y-2 sm:left-auto sm:max-w-sm">
        {items.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-xl"
          >
            {t.type === 'error' ? <CircleAlert className="shrink-0 text-rose-600" size={19} /> : t.type === 'success' ? <CheckCircle2 className="shrink-0 text-indigo-600" size={19} /> : <Info className="shrink-0 text-sky-600" size={19} />}
            <span>{t.message}</span>
            <button
              aria-label="Tutup"
              onClick={() => setItems((x) => x.filter((i) => i.id !== t.id))}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </C.Provider>
  );
}
