import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { safeJson, friendlyError, extractErrorMessage } from '@/utils/api'

export function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setError(null)
    setLoading(true)

    try {
      // Registro
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
      })
      const regData = await safeJson<{ detail?: unknown }>(res)
      if (!res.ok) throw new Error(extractErrorMessage(res.status, regData))

      // Auto-login tras el registro
      const loginRes = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const loginData = await safeJson<{ access_token?: string; detail?: unknown }>(loginRes)
      if (!loginRes.ok || !loginData?.access_token) {
        throw new Error('Cuenta creada. Iniciá sesión para continuar.')
      }
      await login(loginData.access_token)
      navigate('/')
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-floria-deep flex items-center justify-center px-4 py-24">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(201,168,76,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-sm relative">
        <Link
          to="/"
          className="block text-center font-fredoka font-semibold text-2xl text-floria-cream mb-8 hover:text-floria-gold transition-colors"
        >
          Floria<span className="text-floria-gold">.</span>
        </Link>

        <div
          className="rounded-2xl p-8 bg-white/[0.05] backdrop-blur-xl border border-white/[0.1]"
          style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.5)' }}
        >
          <div className="mb-7 text-center">
            <span className="font-fredoka font-medium text-xs tracking-[0.25em] uppercase text-floria-gold/70">
              ✦ Únete al jardín
            </span>
            <h1
              className="font-fredoka font-bold text-floria-cream mt-2"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2rem)' }}
            >
              Crear cuenta
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Field label="Nombre">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                required
                className="input-floria"
                autoComplete="name"
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="input-floria"
                autoComplete="email"
              />
            </Field>

            <Field label="Contraseña">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="input-floria"
                autoComplete="new-password"
              />
            </Field>

            <Field label="Repetir contraseña">
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                className="input-floria"
                autoComplete="new-password"
              />
            </Field>

            {error && (
              <p className="font-fredoka text-xs text-red-400/90 text-center bg-red-900/20 border border-red-500/20 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                mt-1 w-full py-3 rounded-xl
                font-fredoka font-semibold text-sm
                bg-floria-gold text-floria-deep
                hover:bg-floria-amber disabled:opacity-50
                transition-all duration-300
              "
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-6 text-center font-fredoka font-light text-xs text-floria-cream/35">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-floria-gold hover:text-floria-amber transition-colors">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-fredoka font-medium text-xs tracking-wide text-floria-cream/50 uppercase">
        {label}
      </label>
      {children}
    </div>
  )
}
