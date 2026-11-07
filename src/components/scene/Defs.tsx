/** Shared gradients, textures and the hand-drawn wobble filter. */
export default function Defs() {
  return (
    <defs>
      <linearGradient id="glassWarm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffeab8" />
        <stop offset="1" stopColor="#f0b36a" />
      </linearGradient>
      <linearGradient id="glassDark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#566277" />
        <stop offset="1" stopColor="#2c3446" />
      </linearGradient>
      <linearGradient id="glassSheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="0.35" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="0.7" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.25" />
      </linearGradient>
      <pattern id="brickTex" width="14" height="7" patternUnits="userSpaceOnUse">
        <rect width="14" height="7" fill="none" />
        <path d="M0 0.5H14 M0 4H14 M3 0.5V4 M10 4V7" stroke="#8a5a3f" strokeWidth="0.5" opacity="0.5" fill="none" />
      </pattern>
      <pattern id="grassTex" width="9" height="9" patternUnits="userSpaceOnUse">
        <path d="M1 7l1-3 1 3 M5 4l1-3 1 3" stroke="#8fae5a" strokeWidth="0.6" fill="none" />
      </pattern>
      {/* subtle pencil-wobble for the miniature layer */}
      <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" />
      </filter>
      {/* feathered reveal: the miniature fades into the flat map at its edges */}
      <radialGradient id="revealGrad" gradientUnits="userSpaceOnUse" cx="-24" cy="-120" r="1250" gradientTransform="translate(-24 -120) scale(1 0.62) translate(24 120)">
        <stop offset="0" stopColor="#fff" />
        <stop offset="0.55" stopColor="#fff" />
        <stop offset="1" stopColor="#000" />
      </radialGradient>
      <mask id="revealMask" maskUnits="userSpaceOnUse" x="-3000" y="-2000" width="6000" height="4000">
        <rect x="-3000" y="-2000" width="6000" height="4000" fill="url(#revealGrad)" />
      </mask>
    </defs>
  );
}
