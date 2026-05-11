interface CauldronIconProps {
  size?: number
  className?: string
}

export function CauldronIcon({ size = 20, className = '' }: CauldronIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Bubbles rising */}
      <circle cx="9"    cy="4"   r="1.1"  fill="currentColor" stroke="none" opacity="0.75" />
      <circle cx="12"   cy="2.2" r="1.3"  fill="currentColor" stroke="none" />
      <circle cx="15.2" cy="3.4" r="0.95" fill="currentColor" stroke="none" opacity="0.8" />

      {/* Rim — the wide lip of the cauldron */}
      <ellipse cx="12" cy="9" rx="7.5" ry="2.1" />

      {/* Body — rounded bowl */}
      <path d="M4.5 9 C4 14.5 7 19 12 19 C17 19 20 14.5 19.5 9" />

      {/* Three legs */}
      <line x1="7"  y1="18.5" x2="5.5" y2="22.5" />
      <line x1="12" y1="19"   x2="12"  y2="22.5" />
      <line x1="17" y1="18.5" x2="18.5" y2="22.5" />
    </svg>
  )
}
