const LEGAL_LINKS = [
  'Política de Privacidad',
  'Términos y Condiciones – Normas de la Casa',
  'Servicio',
]

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.6" cy="6.4" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function IconPinterest({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.266.64 1.266 1.408 0 .858-.546 2.141-.828 3.329-.236.995.499 1.806 1.48 1.806 1.775 0 3.143-1.872 3.143-4.573 0-2.39-1.718-4.064-4.177-4.064-2.845 0-4.515 2.134-4.515 4.34 0 .858.33 1.776.744 2.279" />
      <path d="M10.5 18.5c-.3 1.1-.95 2.2-1.5 3" />
    </svg>
  )
}

const SOCIALS = [
  { label: 'Instagram', Icon: IconInstagram },
  { label: 'Pinterest', Icon: IconPinterest },
  { label: 'LinkedIn',  Icon: IconLinkedIn  },
]

export function Footer() {
  return (
    <footer
      id="contact"
      className="relative bg-floria-deep px-6 md:px-16 pt-20 md:pt-28"
      aria-label="Contacto"
    >
      {/* Gradient that bleeds upward to cover the Gemini watermark on the background image */}
      <div
        className="absolute inset-x-0 top-0 -translate-y-full pointer-events-none"
        style={{ height: '40px', background: 'linear-gradient(to top, #0a1f0d 25%, transparent 100%)' }}
      />
      {/* Contact card */}
      <div
        className="max-w-2xl mx-auto px-8 md:px-14 py-20 md:py-28 rounded-3xl
          glass-strong shadow-[0_16px_64px_rgba(0,0,0,0.5)]"
      >
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-floria-gold to-transparent mx-auto mb-12" />

        <h2
          className="font-fredoka font-bold text-floria-cream text-center mb-3"
          style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', lineHeight: '1.1' }}
        >
          Hablemos de <span className="text-floria-gold">Especias</span>
        </h2>
        <p className="font-fredoka font-light text-sm text-floria-cream/45 text-center mb-14">
          Estamos en el invernadero, pero siempre respondemos.
        </p>

        {/* Contact data */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <ContactItem
            icon="✉"
            label="Email"
            value="hola@floriaspices.com"
            href="mailto:hola@floriaspices.com"
          />
          <ContactItem
            icon="📞"
            label="Teléfono"
            value="+34 900 123 456"
            href="tel:+34900123456"
          />
          <ContactItem
            icon="📍"
            label="Ubicación"
            value="Invernadero Central, Jardín Botánico de Floria"
          />
          <ContactItem
            icon="🕐"
            label="Horario"
            value="Lun – Vie · 9:00 a 18:00"
          />
        </div>

        {/* App download */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="font-fredoka font-medium text-[0.65rem] tracking-[0.2em] uppercase text-floria-gold/50">
            Floria Spices App
          </p>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
            aria-label="Disponible en Google Play"
          >
            {/* Google Play icon */}
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3.18 23.76a2 2 0 001.06-.3l10.84-6.26-2.97-2.97-8.93 9.53z" fill="#EA4335"/>
              <path d="M22.14 10.32l-3.06-1.77-3.3 3.3 3.3 3.3 3.09-1.78a1.8 1.8 0 000-3.05z" fill="#FBBC04"/>
              <path d="M2.1.54A2 2 0 001 2.36v19.28a2 2 0 001.1 1.8l.1.06 10.8-10.8v-.26L2.2.48l-.1.06z" fill="#4285F4"/>
              <path d="M15.08 7.15L12.01 4.1 2.1.48a2 2 0 00-1 .06l10.9 10.9 3.08-4.29z" fill="#34A853"/>
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="font-fredoka font-light text-[0.55rem] text-floria-cream/40 tracking-wider uppercase">
                Disponible en
              </span>
              <span className="font-fredoka font-semibold text-sm text-floria-cream/80">
                Google Play
              </span>
            </div>
          </a>
        </div>

        {/* Social icons — centered, discrete */}
        <div className="mt-14 pt-8 border-t border-white/[0.08] flex items-center justify-center gap-7">
          {SOCIALS.map(({ label, Icon }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="text-floria-cream/25 hover:text-floria-gold transition-colors duration-300"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>

      {/* Legal strip — solid black, tagline included */}
      <div className="-mx-6 md:-mx-16 mt-16 px-6 md:px-16 py-10 bg-black/85 border-t border-white/[0.07]">
        {/* Tagline */}
        <p className="text-center font-fredoka font-light text-[0.65rem] text-floria-cream/30 tracking-[0.4em] uppercase mb-6">
          Spices &amp; Botanical Alchemy
        </p>

        {/* Copyright + links */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
          <span className="font-fredoka font-light text-xs text-floria-cream/45 tracking-wide">
            © 2026 Floria Spices. Todos los derechos reservados.
          </span>
          {LEGAL_LINKS.map((label) => (
            <span key={label} className="flex items-center gap-6">
              <span className="hidden sm:inline text-xs text-floria-cream/20" aria-hidden="true">·</span>
              <a
                href="#"
                className="font-fredoka font-light text-xs text-floria-cream/40 hover:text-floria-gold transition-colors duration-300"
              >
                {label}
              </a>
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}

interface ContactItemProps {
  icon: string
  label: string
  value: string
  href?: string
}

function ContactItem({ icon, label, value, href }: ContactItemProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xl" aria-hidden="true">{icon}</span>
      <span className="font-fredoka font-medium text-[0.65rem] tracking-[0.2em] uppercase text-floria-gold/60">
        {label}
      </span>
      {href ? (
        <a
          href={href}
          className="font-fredoka font-light text-xs text-floria-cream/55 hover:text-floria-gold transition-colors text-center"
        >
          {value}
        </a>
      ) : (
        <span className="font-fredoka font-light text-xs text-floria-cream/55 text-center">
          {value}
        </span>
      )}
    </div>
  )
}
