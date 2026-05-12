import { FloatingParticles } from '@/components/ui/FloatingParticles'

interface HeroSectionProps {
  heroOpacity: number
}

export function HeroSection({ heroOpacity }: HeroSectionProps) {
  return (
    <section
      className="relative h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ opacity: heroOpacity }}
      aria-label="Hero Floria Spices"
    >
      <FloatingParticles />

      {/* Top vignette — keeps navbar legible regardless of scroll state */}
      <div
        className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)' }}
      />

      {/* Concentric ring decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[95vmin] h-[95vmin] rounded-full border border-floria-gold/8 absolute animate-pulse-slow" />
        <div className="w-[80vmin] h-[80vmin] rounded-full border border-floria-gold/12 absolute" />
        <div className="w-[45vmin] h-[45vmin] rounded-full border border-floria-gold/15 absolute" />
      </div>

      {/* Botanical badge */}
      <div
        className="mb-8 px-5 py-2 rounded-full border border-floria-gold/30
          bg-black/25 backdrop-blur-sm animate-fade-in"
        style={{ animationDelay: '300ms' }}
      >
        <span className="font-fredoka font-medium text-xs md:text-sm tracking-[0.3em] uppercase text-floria-gold/85">
          Botanical Artisan · Est. 2024
        </span>
      </div>

      {/* Main title */}
      <h1
        className="font-fredoka font-bold text-floria-cream leading-none text-shadow-lg animate-fade-up"
        style={{ fontSize: 'clamp(4rem, 14vw, 9rem)', letterSpacing: '-0.02em', animationDelay: '500ms' }}
      >
        FLORIA
      </h1>
      <h1
        className="font-fredoka font-bold leading-none bg-gradient-to-r from-floria-saffron via-floria-gold to-floria-amber bg-clip-text text-transparent"
        style={{
          fontSize: 'clamp(4rem, 14vw, 9rem)',
          letterSpacing: '-0.02em',
          backgroundSize: '200% 100%',
          animation: 'fadeUp 0.9s ease both 650ms, shimmer 4s ease-in-out 1.6s infinite',
        }}
      >
        SPICES
      </h1>

      {/* Divider */}
      <div
        className="my-6 w-24 h-px bg-gradient-to-r from-transparent via-floria-gold/60 to-transparent animate-fade-in"
        style={{ animationDelay: '900ms' }}
      />

      {/* Subtitle */}
      <p
        className="font-fredoka font-light tracking-[0.18em] uppercase text-floria-cream/65 animate-fade-up"
        style={{
          fontSize: 'clamp(0.8rem, 2vw, 1.15rem)',
          animationDelay: '1000ms',
        }}
      >
        Spices &amp; Botanical Alchemy
      </p>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in"
        style={{ animationDelay: '1600ms' }}
        aria-hidden="true"
      >
        <span className="font-fredoka text-floria-cream/35 text-[0.65rem] tracking-[0.3em] uppercase">
          Descend
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-floria-gold/50 to-transparent animate-pulse-slow" />
      </div>
    </section>
  )
}
