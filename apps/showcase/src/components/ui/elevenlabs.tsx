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
      <defs>
        {/* Base vertical gradient for the bars */}
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="229">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#F0F0F0" />
          <stop offset="70%" stopColor="#D9D9D9" />
          <stop offset="100%" stopColor="#BFBFBF" />
        </linearGradient>

        {/* Darken the side edges to simulate curvature */}
        <linearGradient
          id="edgeShade"
          x1="0"
          y1="0"
          x2="229"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="rgba(0,0,0,0.38)" />
          <stop offset="15%" stopColor="rgba(0,0,0,0.18)" />
          <stop offset="50%" stopColor="rgba(0,0,0,0.00)" />
          <stop offset="85%" stopColor="rgba(0,0,0,0.18)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.38)" />
        </linearGradient>

        {/* Soft top bevel highlight */}
        <linearGradient id="topBevel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
        </linearGradient>

        {/* Soft bottom bevel/ambient occlusion */}
        <linearGradient id="bottomBevel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.00)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
        </linearGradient>

        {/* Narrow bright stripe to fake specular reflection */}
        <linearGradient id="specularStripe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.70)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
        </linearGradient>

        {/* Subtle horizontal sheen across each bar */}
        <linearGradient id="sheen" x1="0" y1="0" x2="229" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.00)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.16)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
        </linearGradient>

        {/* Small specular glint near the top-left area of each bar */}
        <radialGradient
          id="glint"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(0 0) rotate(0) scale(1 1)"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
        </radialGradient>

        {/* Soft group shadow */}
        <filter id="softDrop" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.22" />
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodOpacity="0.10" />
        </filter>
      </defs>

      <g filter="url(#softDrop)">
        {/* LEFT BAR */}
        <g>
          {/* Base shape */}
          <rect
            x="43"
            y="1"
            width="47.8809"
            height="228"
            rx="8"
            fill="url(#barGradient)"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="1"
          />
          {/* Edge curvature shading */}
          <rect
            x="43"
            y="1"
            width="47.8809"
            height="228"
            rx="8"
            fill="url(#edgeShade)"
            opacity="0.20"
          />
          {/* Top bevel */}
          <rect
            x="43"
            y="1"
            width="47.8809"
            height="18"
            rx="8"
            fill="url(#topBevel)"
          />
          {/* Bottom bevel */}
          <rect
            x="43"
            y="211"
            width="47.8809"
            height="18"
            rx="8"
            fill="url(#bottomBevel)"
          />
          {/* Vertical center sheen */}
          <rect
            x="43"
            y="1"
            width="47.8809"
            height="228"
            rx="8"
            fill="url(#sheen)"
            opacity="0.30"
          />
          {/* Specular narrow stripe */}
          <rect
            x="54"
            y="10"
            width="9"
            height="208"
            fill="url(#specularStripe)"
            opacity="0.55"
          />
          {/* Small glint */}
          <circle cx="58" cy="24" r="10" fill="url(#glint)" />
        </g>

        {/* RIGHT BAR */}
        <g>
          {/* Base shape */}
          <rect
            x="138.119"
            y="1"
            width="47.881"
            height="228"
            rx="8"
            fill="url(#barGradient)"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="1"
          />
          {/* Edge curvature shading */}
          <rect
            x="138.119"
            y="1"
            width="47.881"
            height="228"
            rx="8"
            fill="url(#edgeShade)"
            opacity="0.20"
          />
          {/* Top bevel */}
          <rect
            x="138.119"
            y="1"
            width="47.881"
            height="18"
            rx="8"
            fill="url(#topBevel)"
          />
          {/* Bottom bevel */}
          <rect
            x="138.119"
            y="211"
            width="47.881"
            height="18"
            rx="8"
            fill="url(#bottomBevel)"
          />
          {/* Vertical center sheen */}
          <rect
            x="138.119"
            y="1"
            width="47.881"
            height="228"
            rx="8"
            fill="url(#sheen)"
            opacity="0.30"
          />
          {/* Specular narrow stripe */}
          <rect
            x="149"
            y="10"
            width="9"
            height="208"
            fill="url(#specularStripe)"
            opacity="0.55"
          />
          {/* Small glint */}
          <circle cx="153" cy="24" r="10" fill="url(#glint)" />
        </g>
      </g>
    </svg>
  );
}
