import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { UserMenu } from './UserMenu'
import { useCart } from '@/context/CartContext'
import { CauldronIcon } from '@/components/ui/CauldronIcon'
import { SpeakerIcon } from '@/components/ui/SpeakerIcon'
import { useAudio } from '@/hooks/useAudio'

interface NavbarProps {
  scrolled: boolean
  wizardOpen: boolean
  onWizardToggle: () => void
  cauldronOpen: boolean
  onCauldronToggle: () => void
}

export function Navbar({ scrolled, wizardOpen, onWizardToggle, cauldronOpen, onCauldronToggle }: NavbarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/'
  const [mobileOpen, setMobileOpen] = useState(false)

  const scrollToSection = (id: string) => {
    setMobileOpen(false)
    if (pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }
  const { count } = useCart()
  const { playing, toggle: toggleAudio } = useAudio('/music/FOREST.mp3')

  // Cierra el menú mobile al cambiar de ruta
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Bloquea el scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50
          flex items-center justify-between
          px-6 md:px-12 py-4
          transition-all duration-500
          ${scrolled || !isHome || mobileOpen
            ? 'bg-black/40 backdrop-blur-md border-b border-white/[0.07]'
            : ''
          }
        `}
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 hover:opacity-85 transition-opacity duration-300"
        >
          <span className="font-fredoka font-bold text-2xl text-floria-cream tracking-wide">
            Floria<span className="text-floria-gold">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-5 md:gap-6">
          {/* Links desktop */}
          <button
            onClick={() => scrollToSection('story')}
            className="hidden md:block font-fredoka font-medium text-sm text-floria-cream/80 hover:text-floria-cream transition-colors duration-300"
          >
            Historia
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="hidden md:block font-fredoka font-medium text-sm text-floria-cream/80 hover:text-floria-cream transition-colors duration-300"
          >
            Contacto
          </button>

          <span className="hidden md:block w-px h-4 bg-white/15" />

          <Link
            to="/explorar"
            className={`
              hidden md:block
              font-fredoka font-semibold text-sm px-5 py-1.5 rounded-full
              border transition-all duration-300
              ${pathname === '/explorar'
                ? 'bg-floria-gold text-floria-deep border-floria-gold'
                : 'border-floria-gold/50 text-floria-gold hover:bg-floria-gold hover:text-floria-deep'
              }
            `}
          >
            Explorar
          </Link>

          {/* Speaker */}
          <button
            onClick={toggleAudio}
            title={playing ? 'Silenciar música' : 'Activar música'}
            className={`
              flex items-center justify-center w-10 h-10 rounded-full
              border transition-all duration-300
              ${playing
                ? 'bg-floria-gold/20 border-floria-gold/70 text-floria-gold'
                : 'bg-white/[0.06] border-white/20 text-floria-cream/50 hover:bg-white/10 hover:border-white/40 hover:text-floria-cream/80'
              }
            `}
            aria-label={playing ? 'Silenciar música' : 'Activar música'}
          >
            <SpeakerIcon playing={playing} size={17} />
          </button>

          {/* Caldero */}
          <button
            onClick={onCauldronToggle}
            title="Tu Caldero"
            className={`
              relative flex items-center justify-center w-10 h-10 rounded-full
              border transition-all duration-300
              ${cauldronOpen
                ? 'bg-floria-gold/20 border-floria-gold/70 scale-110 text-floria-gold'
                : 'bg-white/[0.06] border-white/20 hover:bg-white/10 hover:border-floria-gold/40 text-floria-cream/70 hover:text-floria-gold'
              }
            `}
            aria-label="Caldero"
          >
            <CauldronIcon size={18} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-floria-gold text-floria-deep font-fredoka font-bold text-[9px] flex items-center justify-center leading-none">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>

          {/* Wizard */}
          <button
            onClick={onWizardToggle}
            title="Oráculo Floria"
            className={`
              flex items-center justify-center w-10 h-10 rounded-full
              border transition-all duration-300 text-lg leading-none
              ${wizardOpen
                ? 'bg-floria-gold/20 border-floria-gold/70 scale-110'
                : 'bg-white/[0.06] border-white/20 hover:bg-white/10 hover:border-floria-gold/40'
              }
            `}
            aria-label="Oráculo"
          >
            🧙‍♂️
          </button>

          {/* Usuario */}
          <UserMenu />

          {/* Hamburguesa */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden text-floria-cream/80 hover:text-floria-gold transition-colors"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="4" y1="4" x2="18" y2="18" />
                <line x1="18" y1="4" x2="4" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="2" y1="6" x2="20" y2="6" />
                <line x1="2" y1="11" x2="20" y2="11" />
                <line x1="2" y1="16" x2="16" y2="16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Panel móvil */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden
          transition-all duration-300
          ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}
        `}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer desde arriba */}
        <div
          className={`
            absolute top-0 left-0 right-0
            bg-floria-deep/97 backdrop-blur-xl
            border-b border-white/[0.08]
            px-6 pt-20 pb-8
            flex flex-col gap-1
            transition-transform duration-300 ease-out
            ${mobileOpen ? 'translate-y-0' : '-translate-y-full'}
          `}
        >
          <button
            onClick={() => scrollToSection('story')}
            className="font-fredoka font-medium text-base text-floria-cream/80 hover:text-floria-cream py-3 border-b border-white/[0.06] transition-colors text-left"
          >
            Historia
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="font-fredoka font-medium text-base text-floria-cream/80 hover:text-floria-cream py-3 border-b border-white/[0.06] transition-colors text-left"
          >
            Contacto
          </button>
          <Link
            to="/explorar"
            className="font-fredoka font-medium text-base text-floria-cream/80 hover:text-floria-cream py-3 transition-colors"
          >
            Explorar
          </Link>
        </div>
      </div>
    </>
  )
}
