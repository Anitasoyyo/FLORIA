interface SpeakerIconProps {
  playing: boolean
  size?: number
  className?: string
}

export function SpeakerIcon({ playing, size = 18, className = '' }: SpeakerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Speaker body */}
      <path d="M3 8 L3 14 L7 14 L13 18 L13 4 L7 8 Z" />

      {playing ? (
        <>
          {/* Sound waves */}
          <path d="M16 8.5 C17.2 9.6 17.2 12.4 16 13.5" />
          <path d="M18.5 6.5 C20.5 8.5 20.5 13.5 18.5 15.5" />
        </>
      ) : (
        <>
          {/* Muted X */}
          <line x1="16" y1="8.5" x2="21" y2="13.5" />
          <line x1="21" y1="8.5" x2="16" y2="13.5" />
        </>
      )}
    </svg>
  )
}
