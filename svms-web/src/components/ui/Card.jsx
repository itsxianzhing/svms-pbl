export const Card = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow sm:p-6 ${className}`}>
    {children}
  </div>
);
