import { useEffect, useRef, useState } from 'react'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { StorySection } from '@/components/sections/StorySection'
import type { StoryCard } from '@/types'

const FALLBACK_STORIES: StoryCard[] = [
  {
    id: 1,
    tag: 'Nuestros Orígenes',
    title: 'Nace de la Tierra',
    content:
      'Floria Spices nació de un amor profundo por la naturaleza y las especias. Cada hoja, cada raíz, cada semilla cuenta una historia de suelo fértil y cuidado artesanal.',
    icon: '🌿',
    position: 'left',
  },
  {
    id: 2,
    tag: 'La Alquimia',
    title: 'Ciencia & Naturaleza',
    content:
      'Combinamos el conocimiento ancestral de las plantas con técnicas modernas de extracción. El resultado: aromas y sabores que trascienden lo ordinario.',
    icon: '⚗️',
    position: 'right',
  },
  {
    id: 3,
    tag: 'Origen Consciente',
    title: 'Ingredientes con Propósito',
    content:
      'Cada ingrediente es seleccionado con intención. Trabajamos directamente con agricultores que comparten nuestra filosofía: el respeto profundo por la tierra.',
    icon: '🌍',
    position: 'left',
  },
  {
    id: 4,
    tag: 'Nuestras Raíces',
    title: 'La Fundación',
    content:
      'Como un árbol que encuentra su fuerza en las raíces, Floria Spices se fundamenta en valores inmovibles: autenticidad, sostenibilidad y pasión botánica.',
    icon: '🌱',
    position: 'right',
  },
  {
    id: 5,
    tag: 'El Arte del Secado',
    title: 'Tiempo y Paciencia',
    content:
      'En Floria, el tiempo no se mide en horas sino en aromas. Nuestras especias se secan lentamente, respetando los ritmos naturales para concentrar cada esencia hasta su punto exacto de perfección.',
    icon: '🕯️',
    position: 'left',
  },
  {
    id: 6,
    tag: 'Nuestra Visión',
    title: 'Siembra de Futuro',
    content:
      'Cada frasco de Floria es una semilla plantada hacia el mañana. Cultivamos no solo especias, sino un modo de entender la naturaleza: despacio, con reverencia, sabiendo que lo mejor siempre tarda en florecer.',
    icon: '🔮',
    position: 'right',
  },
  {
    id: 7,
    tag: 'El Laboratorio',
    title: 'Donde Nace la Magia',
    content:
      'Nuestro invernadero-laboratorio es el corazón de Floria. Entre destiladores de cobre, morteros de piedra y estanterías repletas de frascos ámbar, cada nueva mezcla toma vida. Aquí el tiempo se detiene y solo habla el aroma.',
    icon: '🔬',
    position: 'left',
  },
  {
    id: 8,
    tag: 'La Cosecha',
    title: 'El Fruto del Tiempo',
    content:
      'Cosechar en Floria es un ritual sagrado. Sabemos exactamente en qué momento del día, bajo qué luz y con qué humedad debemos recoger cada planta. Ese instante preciso es el que encierra todo su poder aromático.',
    icon: '🌾',
    position: 'right',
  },
  {
    id: 9,
    tag: 'El Legado',
    title: 'Historia que Perdura',
    content:
      'Cada especia que sale de Floria lleva consigo siglos de conocimiento destilado. No vendemos condimentos: transmitimos un legado botánico que queremos ver crecer en cada cocina, en cada mesa, en cada momento compartido.',
    icon: '🏺',
    position: 'left',
  },
  {
    id: 10,
    tag: 'El Encuentro',
    title: 'Cuando Todo Cobra Sentido',
    content:
      'El momento en que abres un frasco de Floria y ese aroma te envuelve — eso es para lo que existe todo lo demás. Años de cultivo, horas de laboratorio, siglos de saber. Todo condensado en un instante que cambia cómo entiendes la cocina.',
    icon: '✨',
    position: 'right',
  },
  {
    id: 11,
    tag: 'La Experiencia',
    title: 'Más que un Pedido',
    content:
      'Cada envío de Floria llega perfumado y envuelto con esmero. Los frascos están pensados para quedarse en tu cocina, para decorarla. No enviamos productos: enviamos un ritual que empieza mucho antes de que lo abras.',
    icon: '📦',
    position: 'left',
  },
  {
    id: 12,
    tag: 'Con Alma',
    title: 'Hecho con Cariño',
    content:
      'Este proyecto nació de la pasión por el detalle y el amor por lo bien hecho. Cada decisión, cada color, cada palabra elegida con cuidado. Porque creemos que la artesanía no es solo un proceso — es una declaración de intenciones sobre cómo queremos estar en el mundo.',
    icon: '🌸',
    position: 'right',
  },
]

interface HomePageProps {
  onWizardToggle: () => void
}

export function HomePage({ onWizardToggle }: HomePageProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const [heroOpacity, setHeroOpacity] = useState(1)
  const [stories, setStories] = useState<StoryCard[]>(FALLBACK_STORIES)

  useEffect(() => {
    fetch('/api/v1/story')
      .then((res) => res.json())
      .then((data: StoryCard[]) => {
        if (Array.isArray(data) && data.length > 0) setStories(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const section = sectionRef.current
      const img = imgRef.current

      if (section && img) {
        const totalScrollable = section.offsetHeight - window.innerHeight
        if (totalScrollable > 0) {
          const progress = Math.min(1, Math.max(0, scrollY / totalScrollable))
          img.style.objectPosition = `50% ${progress * 100}%`
        }
      }

      setHeroOpacity(Math.max(0, 1 - scrollY / (window.innerHeight * 0.4)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <main
        ref={sectionRef}
        className="relative"
        style={{ minHeight: '520vh' }}
      >
        {/* Sticky tree background */}
        <div className="sticky top-0 w-full h-screen overflow-hidden z-0">
          <img
            ref={imgRef}
            src="/images/fondo.png"
            alt=""
            role="presentation"
            className="w-full h-full object-cover select-none"
            style={{ objectPosition: '50% 0%' }}
            loading="eager"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(10,31,13,0.78) 0%, rgba(10,31,13,0.22) 35%, rgba(10,31,13,0.15) 55%, rgba(10,31,13,0.55) 85%, rgba(10,31,13,0.82) 100%)',
            }}
          />
        </div>

        {/* Scrollable content layer */}
        <div
          className="absolute top-0 left-0 right-0 z-10"
          style={{ minHeight: '520vh' }}
        >
          <HeroSection heroOpacity={heroOpacity} onWizardToggle={onWizardToggle} />
          <StorySection stories={stories} />
        </div>
      </main>

      {/* Footer fuera del sticky — tapa la imagen y aparece en flujo normal */}
      <Footer />
    </>
  )
}
