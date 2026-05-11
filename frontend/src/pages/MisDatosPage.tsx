import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function MisDatosPage() {
  const { user } = useAuth()

  if (!user) return null

  const initial = user.nombre.charAt(0).toUpperCase()

  return (
    <main className="min-h-screen bg-floria-deep pt-24 pb-20 px-6 md:px-16">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="mb-10">
          <Link
            to="/"
            className="font-fredoka text-xs text-floria-cream/30 hover:text-floria-cream/60 transition-colors tracking-wider uppercase mb-6 inline-block"
          >
            ← Volver
          </Link>
          <h1 className="font-fredoka font-bold text-floria-cream" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
            Mis <span className="text-floria-gold">Datos</span>
          </h1>
          <div className="w-12 h-px bg-floria-gold/40 mt-3" />
        </div>

        {/* Profile card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm p-8 flex flex-col gap-6">

          {/* Avatar */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-floria-gold/20 border-2 border-floria-gold/50 flex items-center justify-center">
              <span className="font-fredoka font-bold text-3xl text-floria-gold leading-none">
                {initial}
              </span>
            </div>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-4">
            <Field label="Nombre" value={user.nombre} />
            <Field label="Email" value={user.email} />
            <Field label="Estado" value={user.is_active ? 'Cuenta activa' : 'Inactiva'} />
          </div>

          <div className="border-t border-white/[0.06] pt-4">
            <p className="font-fredoka font-light text-xs text-floria-cream/25 text-center">
              ¿Quieres cambiar tu contraseña o datos? Contacta con nosotros en{' '}
              <a href="mailto:hola@floriaspices.com" className="text-floria-gold/60 hover:text-floria-gold transition-colors">
                hola@floriaspices.com
              </a>
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-fredoka font-medium text-[0.65rem] tracking-[0.2em] uppercase text-floria-gold/50">
        {label}
      </span>
      <span className="font-fredoka font-light text-sm text-floria-cream/70">
        {value}
      </span>
    </div>
  )
}
