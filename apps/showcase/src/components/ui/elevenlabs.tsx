export function ElevenLabs({
  width = 78,
  height = 78,
}: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 229 229"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ElevenLabs pause logo"
    >
      {/* Soft elevation so the logo reads on a bright backdrop */}
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="229">
          <stop offset="0%" stopColor="#1E1E1E" />
          <stop offset="60%" stopColor="#2A2A2A" />
          <stop offset="100%" stopColor="#333333" />
        </linearGradient>

        {/* Crisp, tiny drop shadow for separation on white */}
        <filter id="elevation" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.12" />
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.08" />
        </filter>

        {/* Very subtle specular highlight down the bars */}
        <linearGradient id="sheen" x1="0" y1="0" x2="229" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.00)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
        </linearGradient>
      </defs>

      <g filter="url(#elevation)">
        <path d="M43 1H90.8809V229H43V1Z" fill="url(#barGradient)" />
        <path d="M138.119 1H186V229H138.119V1Z" fill="url(#barGradient)" />
        {/* Overlay the faint sheen so it feels premium but not glossy */}
        <rect x="43" y="1" width="47.8809" height="228" fill="url(#sheen)" />
        <rect
          x="138.119"
          y="1"
          width="47.881"
          height="228"
          fill="url(#sheen)"
        />
      </g>
    </svg>
  );
}
