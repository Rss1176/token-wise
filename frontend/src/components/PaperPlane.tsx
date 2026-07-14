export function PaperPlane() {
  return (
    <div className="plane" aria-hidden="true">
      <div className="plane__inner">
        <svg viewBox="0 0 96 44" width="100%" fill="none">
          {/* looping trail */}
          <path
            d="M0 34 C 10 20, 18 40, 27 27 S 38 17, 44 20"
            stroke="var(--cloud)"
            strokeWidth="2.5"
            strokeDasharray="5 6"
            strokeLinecap="round"
          />
          {/* folded paper plane */}
          <path d="M44 16 L92 8 L62 36 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
          <path
            d="M92 8 L62 36 L57 23 Z"
            fill="var(--paper-shade)"
            stroke="var(--ink)"
            strokeWidth="2"
          />
          <path d="M44 16 L57 23" stroke="var(--ink)" strokeWidth="2" />
          <path d="M92 8 L57 23" stroke="var(--red)" strokeWidth="2.5" />
        </svg>
      </div>
    </div>
  )
}
