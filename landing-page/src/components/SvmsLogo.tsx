interface SvmsLogoProps {
  className?: string;
  inverted?: boolean;
}

export function SvmsLogo({className = '', inverted = false}: SvmsLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          width="32"
          height="32"
          rx="9"
          fill={inverted ? '#FFFFFF' : 'url(#svms-brand-grad)'}
        />
        <rect
          x="7.5"
          y="8.5"
          width="17"
          height="15"
          rx="2.5"
          stroke={inverted ? '#4F46E5' : '#FFFFFF'}
          strokeWidth="1.75"
        />
        <line
          x1="16"
          y1="8.5"
          x2="16"
          y2="23.5"
          stroke={inverted ? '#4F46E5' : '#FFFFFF'}
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
        <line
          x1="7.5"
          y1="16"
          x2="24.5"
          y2="16"
          stroke={inverted ? '#7C3AED' : '#E0E7FF'}
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient
            id="svms-brand-grad"
            x1="0"
            y1="0"
            x2="32"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4F46E5" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className={`font-display text-lg font-bold tracking-tight ${
          inverted ? 'text-white' : 'text-slate-900 dark:text-[#F8FAFC]'
        }`}
      >
        SVMS
      </span>
    </span>
  );
}
