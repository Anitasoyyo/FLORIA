import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`
          flex items-center justify-center w-9 h-9 rounded-full
          border transition-all duration-300
          ${user
            ? 'bg-floria-gold/20 border-floria-gold/60 text-floria-gold hover:bg-floria-gold/35'
            : 'bg-white/10 border-white/35 text-floria-cream hover:bg-white/15 hover:border-white/55'
          }
        `}
        aria-label="Menú de usuario"
      >
        {user ? (
          /* User initial */
          <span className="font-fredoka font-semibold text-sm leading-none">
            {user.nombre.charAt(0).toUpperCase()}
          </span>
        ) : (
          /* User icon */
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        )}
      </button>

      {/* Dropdown */}
      <div
        className={`
          absolute right-0 top-full mt-2 w-48
          rounded-2xl overflow-hidden
          bg-floria-deep/95 backdrop-blur-xl
          border border-white/[0.1]
          shadow-[0_8px_32px_rgba(0,0,0,0.5)]
          transition-all duration-200 origin-top-right
          ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        {user ? (
          <>
            {/* User info */}
            <div className="px-4 py-3 border-b border-white/[0.08]">
              <p className="font-fredoka font-semibold text-sm text-floria-cream truncate">
                {user.nombre}
              </p>
              <p className="font-fredoka font-light text-xs text-floria-cream/35 truncate">
                {user.email}
              </p>
            </div>

            <Link
              to="/mis-pedidos"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 font-fredoka font-medium text-sm text-floria-cream/70 hover:text-floria-cream hover:bg-white/[0.05] transition-colors duration-200"
            >
              <span className="text-base leading-none">📦</span>
              Mis pedidos
            </Link>
            <Link
              to="/mis-datos"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 font-fredoka font-medium text-sm text-floria-cream/70 hover:text-floria-cream hover:bg-white/[0.05] transition-colors duration-200 border-b border-white/[0.06]"
            >
              <span className="text-base leading-none">✦</span>
              Mis datos
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2.5 px-4 py-3 font-fredoka font-light text-sm text-floria-cream/40 hover:text-red-400/70 hover:bg-white/[0.03] transition-colors duration-200"
            >
              <span className="text-base leading-none">↪</span>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 font-fredoka font-medium text-sm text-floria-cream/80 hover:text-floria-cream hover:bg-white/[0.05] transition-colors duration-200"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 font-fredoka font-semibold text-sm text-floria-gold hover:bg-floria-gold/10 transition-colors duration-200 border-t border-white/[0.06]"
            >
              Registrarse ✦
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
