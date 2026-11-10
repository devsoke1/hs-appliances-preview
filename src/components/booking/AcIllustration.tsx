/**
 * Wall-mounted split air conditioner, blowing cool air (blue) and warm air (orange) — the "one unit,
 * cooling and heating" message of the Air Conditioning page. Inline SVG: sharp at any size, no download.
 * Swap for a photo of one of your own installs whenever you like.
 */
export function AcIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 340" role="img" aria-labelledby="ac-ill-title" className={className}>
      <title id="ac-ill-title">Wall-mounted air conditioning unit blowing cool air in summer and warm air in winter</title>
      <defs>
        <linearGradient id="ac-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e6edf4" />
        </linearGradient>
        <linearGradient id="ac-cool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fb2ef" stopOpacity="0.95" />
          <stop offset="1" stopColor="#5fb2ef" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ac-warm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8a3d" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ff8a3d" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* wall */}
      <rect width="480" height="340" rx="22" fill="#003352" />
      <path d="M0 250h480" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="2" />

      {/* unit */}
      <g>
        <rect x="70" y="46" width="340" height="104" rx="22" fill="#00243a" opacity="0.35" transform="translate(0 8)" />
        <rect x="70" y="40" width="340" height="104" rx="22" fill="url(#ac-body)" />
        <rect x="70" y="40" width="340" height="104" rx="22" fill="none" stroke="#ffffff" strokeOpacity="0.8" />
        <path d="M92 116h296" stroke="#c9d6e3" strokeWidth="2" />
        <rect x="96" y="124" width="288" height="12" rx="6" fill="#0b2236" opacity="0.85" />
        <path d="M104 130h272" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="10 8" />
        {/* display */}
        <rect x="320" y="62" width="64" height="30" rx="8" fill="#0b2236" />
        <text x="352" y="83" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="17" fontWeight="700" fill="#7dd3fc">
          21°
        </text>
        <circle cx="304" cy="77" r="4" fill="#22c55e" />
      </g>

      {/* cool air (left) */}
      <g fill="none" strokeLinecap="round" strokeWidth="6">
        <path d="M120 150c-10 28 6 48-6 76" stroke="url(#ac-cool)" />
        <path d="M156 150c-12 30 8 52-4 84" stroke="url(#ac-cool)" />
        <path d="M192 150c-10 28 8 50-2 80" stroke="url(#ac-cool)" />
        <path d="M228 150c-8 26 6 46 0 72" stroke="url(#ac-cool)" />
      </g>
      {/* warm air (right) */}
      <g fill="none" strokeLinecap="round" strokeWidth="6">
        <path d="M256 150c8 26-6 46 0 72" stroke="url(#ac-warm)" />
        <path d="M292 150c10 28-8 50 2 80" stroke="url(#ac-warm)" />
        <path d="M328 150c12 30-8 52 4 84" stroke="url(#ac-warm)" />
        <path d="M364 150c10 28-6 48 6 76" stroke="url(#ac-warm)" />
      </g>

      {/* labels */}
      <g fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="700" fontSize="17">
        <rect x="70" y="268" width="150" height="44" rx="22" fill="#0061a5" />
        <g transform="translate(92 279)" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M11 0v22M1.5 5.5l19 11M1.5 16.5l19-11" />
        </g>
        <text x="124" y="296" fill="#ffffff">Cooling</text>
        <rect x="260" y="268" width="150" height="44" rx="22" fill="#f25c00" />
        <g transform="translate(282 279)" stroke="#00243a" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <circle cx="11" cy="11" r="5" />
          <path d="M11 0v2.5M11 19.5V22M0 11h2.5M19.5 11H22M3.2 3.2l1.8 1.8M17 17l1.8 1.8M3.2 18.8 5 17M17 5l1.8-1.8" />
        </g>
        <text x="314" y="296" fill="#00243a">Heating</text>
      </g>
    </svg>
  );
}
