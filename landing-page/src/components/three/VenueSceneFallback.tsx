export function VenueSceneFallback({reason}: {reason?: 'loading' | 'unavailable'}) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-white via-[#F6F7FB] to-indigo-50/80 dark:border-indigo-400/25 dark:from-[#151D30] dark:via-[#111827] dark:to-[#182235] p-6"
      aria-label="Ilustrasi arena lapangan badminton SVMS"
    >
      {/* Stylized isometric SVG badminton court fallback */}
      <svg
        viewBox="0 0 420 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[360px] drop-shadow-[0_18px_32px_rgba(79,70,229,0.16)]"
        aria-hidden="true"
      >
        <g transform="translate(210 154) scale(1 0.58) rotate(-32)">
          {/* Plinth */}
          <rect x="-136" y="-88" width="272" height="176" rx="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
          {/* Court Mat */}
          <rect x="-120" y="-74" width="240" height="148" rx="8" fill="#312E81" />
          <rect x="-104" y="-60" width="208" height="120" fill="#4F46E5" stroke="#F8FAFC" strokeWidth="3" />
          {/* Singles sidelines */}
          <line x1="-104" y1="-48" x2="104" y2="-48" stroke="#F8FAFC" strokeWidth="2.5" />
          <line x1="-104" y1="48" x2="104" y2="48" stroke="#F8FAFC" strokeWidth="2.5" />
          {/* Service lines */}
          <line x1="-88" y1="-60" x2="-88" y2="60" stroke="#F8FAFC" strokeWidth="2.5" />
          <line x1="88" y1="-60" x2="88" y2="60" stroke="#F8FAFC" strokeWidth="2.5" />
          <line x1="-32" y1="-60" x2="-32" y2="60" stroke="#F8FAFC" strokeWidth="2.5" />
          <line x1="32" y1="-60" x2="32" y2="60" stroke="#F8FAFC" strokeWidth="2.5" />
          {/* Center line */}
          <line x1="-104" y1="0" x2="-32" y2="0" stroke="#F8FAFC" strokeWidth="2.5" />
          <line x1="32" y1="0" x2="104" y2="0" stroke="#F8FAFC" strokeWidth="2.5" />
          {/* Net line */}
          <line x1="0" y1="-66" x2="0" y2="66" stroke="#E0E7FF" strokeWidth="4" />
        </g>
      </svg>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-slate-200/90 bg-white/95 px-3.5 py-1 text-[11px] font-medium text-slate-600 shadow-xs dark:border-slate-700 dark:bg-[#182235]/95 dark:text-slate-300">
        {reason === 'loading'
          ? 'Menyiapkan tampilan 3D venue...'
          : 'Tampilan 2D venue · WebGL tidak aktif'}
      </div>
    </div>
  );
}
