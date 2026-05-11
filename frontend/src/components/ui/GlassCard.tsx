import type { StoryCard } from '@/types'

interface GlassCardProps {
  story: StoryCard
  className?: string
}

export function GlassCard({ story, className = '' }: GlassCardProps) {
  return (
    <article
      className={`
        relative w-full px-8 py-9 md:px-10 md:py-11 lg:px-12 lg:py-12 rounded-2xl
        bg-white/[0.06] backdrop-blur-xl
        border border-white/[0.13]
        shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)]
        transition-transform duration-300 hover:-translate-y-1
        ${className}
      `}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-floria-gold/50 to-transparent" />

      {/* Tag + icon */}
      <div className="flex items-center gap-3 mb-5">
        <span
          className="text-2xl md:text-3xl"
          role="img"
          aria-label={story.tag}
        >
          {story.icon}
        </span>
        <span className="font-fredoka font-medium text-xs md:text-sm tracking-[0.22em] uppercase text-floria-gold">
          {story.tag}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-fredoka font-semibold text-xl md:text-2xl text-floria-cream leading-snug mb-3 text-shadow-sm">
        {story.title}
      </h3>

      {/* Body */}
      <p className="font-fredoka font-light text-sm md:text-base text-floria-cream/65 leading-relaxed">
        {story.content}
      </p>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </article>
  )
}
