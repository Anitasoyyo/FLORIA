import type { StoryCard } from '@/types'
import { GlassCard } from '@/components/ui/GlassCard'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

interface StorySectionProps {
  stories: StoryCard[]
}

export function StorySection({ stories }: StorySectionProps) {
  return (
    <section
      id="story"
      className="px-6 md:px-16 pt-8 pb-16"
      aria-label="Nuestra historia"
    >
      <div className="max-w-6xl mx-auto space-y-40 md:space-y-50 xl:space-y-18">
        {stories.map((story, index) => (
          <div
            key={story.id}
            className={`flex justify-center ${
              story.position === 'left' ? 'md:justify-start' : 'md:justify-end'
            }`}
          >
            <ScrollReveal direction={story.position} delay={index * 80}>
              <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
                <GlassCard story={story} />
              </div>
            </ScrollReveal>
          </div>
        ))}
      </div>
    </section>
  )
}
