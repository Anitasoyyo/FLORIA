import { useMemo } from 'react'

export function FloatingParticles({ count = 28 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${5 + Math.random() * 90}%`,
        size: Math.random() * 3 + 2,
        delay: Math.random() * 12,
        duration: Math.random() * 8 + 10,
        swayX: (Math.random() - 0.5) * 50,
      })),
    [count],
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 rounded-full bg-floria-gold"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            boxShadow: `0 0 ${p.size * 2}px ${p.size}px rgba(240,229,60,0.4)`,
            animation: `floatUp ${p.duration}s ${p.delay}s ease-in infinite`,
            '--sway-x': `${p.swayX}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
