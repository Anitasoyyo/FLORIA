interface StarRatingProps {
  rating: number
  max?: number
}

export function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-0.5" aria-label={`Rareza: ${rating} de ${max} estrellas`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={i < rating ? 'text-floria-gold' : 'text-white/15'}
          style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
        >
          ★
        </span>
      ))}
    </div>
  )
}
