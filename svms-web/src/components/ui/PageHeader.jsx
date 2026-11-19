export const PageHeader = ({ title, subtitle, action }) => (
  <div className="mb-6 flex min-w-0 flex-wrap items-start justify-between gap-4">
    <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
    </div>
    {action}
  </div>
);
