export const Badge = ({ children, className = '', dot = true }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
    {dot && <span className="size-1.5 rounded-full bg-current" />}
    {children}
  </span>
);
