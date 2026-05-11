import { useEffect, useRef, useState } from 'react'

export function useAudio(src: string, volume = 0.35) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = volume
    audioRef.current = audio

    // Browsers block autoplay — start on first user interaction
    const startOnInteraction = () => {
      if (startedRef.current) return
      startedRef.current = true
      audio.play().then(() => setPlaying(true)).catch(() => {})
      window.removeEventListener('click', startOnInteraction)
      window.removeEventListener('keydown', startOnInteraction)
    }

    window.addEventListener('click', startOnInteraction)
    window.addEventListener('keydown', startOnInteraction)

    return () => {
      audio.pause()
      audio.src = ''
      window.removeEventListener('click', startOnInteraction)
      window.removeEventListener('keydown', startOnInteraction)
    }
  }, [src, volume])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return { playing, toggle }
}
