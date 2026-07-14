export function Skyline() {
  return (
    <svg
      className="hero__skyline"
      viewBox="0 0 1200 110"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      {/* pyramids */}
      <polygon points="40,110 170,18 300,110" fill="var(--mustard)" />
      <polygon points="230,110 330,52 430,110" fill="var(--mustard)" opacity="0.75" />
      {/* leaning tower */}
      <g transform="rotate(-4 530 110)">
        <rect x="505" y="30" width="52" height="80" rx="6" fill="var(--cloud)" />
        <line x1="505" y1="50" x2="557" y2="50" stroke="var(--sky-deep)" strokeWidth="4" />
        <line x1="505" y1="70" x2="557" y2="70" stroke="var(--sky-deep)" strokeWidth="4" />
        <line x1="505" y1="90" x2="557" y2="90" stroke="var(--sky-deep)" strokeWidth="4" />
        <polygon points="524,30 531,12 545,18 538,30" fill="var(--orange)" />
      </g>
      {/* city blocks */}
      <rect x="640" y="46" width="42" height="64" fill="var(--ink-soft)" opacity="0.55" />
      <rect x="694" y="66" width="34" height="44" fill="var(--ink-soft)" opacity="0.4" />
      <rect x="740" y="34" width="26" height="76" fill="var(--ink-soft)" opacity="0.5" />
      {/* statue silhouette, very loosely */}
      <g fill="var(--ink-soft)" opacity="0.45">
        <rect x="840" y="70" width="26" height="40" />
        <rect x="847" y="44" width="12" height="30" rx="5" />
        <line x1="866" y1="26" x2="858" y2="52" stroke="var(--ink-soft)" strokeWidth="6" />
      </g>
      {/* rolling hill */}
      <path d="M920 110 Q 1060 20 1200 96 L1200 110 Z" fill="var(--orange)" opacity="0.8" />
    </svg>
  )
}
