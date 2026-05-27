import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { SPICES } from '@/data/spices'
import { MessageDock } from './message-dock'
import type { Character } from './message-dock'

const SPICE_NAMES = SPICES.map((s) => s.nombre)

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function getAnonSessionId(): string {
  const key = 'floria_wizard_session'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

/** Divide el texto por nombres de especias y devuelve nodos con enlaces. */
function renderWithSpiceLinks(text: string, spiceNames: string[], onLinkClick?: () => void) {
  if (!spiceNames.length) return <>{text}</>

  const sorted = [...spiceNames].sort((a, b) => b.length - a.length)
  const pattern = new RegExp(`(${sorted.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  const parts = text.split(pattern)

  return (
    <>
      {parts.map((part, i) => {
        const match = spiceNames.find((n) => n.toLowerCase() === part.toLowerCase())
        if (match) {
          return (
            <Link
              key={i}
              to={`/explorar?q=${encodeURIComponent(match)}`}
              onClick={onLinkClick}
              className="text-floria-gold underline underline-offset-2 hover:text-floria-amber transition-colors"
            >
              {part}
            </Link>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

const wizardCharacters = [
  { emoji: '✨', name: '_start', online: false },
  {
    emoji: '🧙‍♂️',
    name: 'Oráculo',
    online: true,
    backgroundColor: 'bg-amber-400/30',
    gradientColors: '#fde68a, #fffbeb',
  },
  { emoji: '✨', name: '_end', online: false },
]

interface WizardChatProps {
  isOpen: boolean
  onClose: () => void
}

export function WizardChat({ isOpen, onClose }: WizardChatProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [streaming, setStreaming] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const sessionId = user ? `user_${user.email}` : getAnonSessionId()

  // Resetea el chat cada vez que se cierra
  useEffect(() => {
    if (!isOpen) {
      setMessages([])
      setStreaming('')
      setIsLoading(false)
    }
  }, [isOpen])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  const handleSend = async (message: string, _char: Character) => {
    setMessages((prev) => [...prev, { role: 'user', content: message }])
    setIsLoading(true)
    setStreaming('')

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, session_id: sessionId }),
      })

      if (!res.ok || !res.body) throw new Error('Error del servidor')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const raw = decoder.decode(value, { stream: true })
        const lines = raw.split('\n').filter((l) => l.startsWith('data: '))

        for (const line of lines) {
          const content = line.slice(6)
          if (content === '[DONE]') {
            setMessages((prev) => [...prev, { role: 'assistant', content: full }])
            setStreaming('')
            setIsLoading(false)
            return
          }
          const token = content.replace(/\\n/g, '\n')
          full += token
          setStreaming(full)
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'El Mago no puede responder ahora. ¿Está Ollama corriendo?' },
      ])
      setStreaming('')
      setIsLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {/* Hint inicial */}
        {isOpen && messages.length === 0 && !isLoading && (
          <motion.div
            className="fixed bottom-24 left-1/2 z-50 w-[min(340px,calc(100vw-32px))]"
            style={{ x: '-50%' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="rounded-2xl px-5 py-4 bg-floria-deep/90 backdrop-blur-xl border border-white/[0.09] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <p className="font-fredoka text-sm text-floria-cream/50 text-center tracking-wide">
                🧙‍♂️ Pregúntale al Mago sobre especias, aromas o alquimia botánica
              </p>
            </div>
          </motion.div>
        )}

        {/* Panel de conversación */}
        {isOpen && (messages.length > 0 || isLoading) && (
          <motion.div
            className="fixed bottom-24 left-1/2 z-50 w-[min(360px,calc(100vw-32px))] max-h-[55vh] flex flex-col"
            style={{ x: '-50%' }}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <div className="rounded-2xl bg-floria-green/80 backdrop-blur-xl border border-white/[0.09] shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.07]">
                <span className="text-sm">🧙‍♂️</span>
                <span className="font-fredoka font-medium text-xs text-floria-gold/80 tracking-widest uppercase">
                  El Mago de Floria
                </span>
                {isLoading && (
                  <span className="flex items-center gap-1.5 ml-2">
                    <span className="font-fredoka text-xs text-floria-gold/60 italic">pensando</span>
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-floria-gold animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="ml-auto text-floria-cream/30 hover:text-floria-cream/70 transition-colors"
                  aria-label="Cerrar chat"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <line x1="2" y1="2" x2="12" y2="12" />
                    <line x1="12" y1="2" x2="2" y2="12" />
                  </svg>
                </button>
              </div>

              {/* Mensajes */}
              <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`
                        max-w-[85%] rounded-2xl px-3.5 py-2 font-fredoka text-sm leading-relaxed
                        ${msg.role === 'user'
                          ? 'bg-floria-gold text-floria-deep rounded-br-sm'
                          : 'bg-white/[0.07] text-floria-cream/90 rounded-bl-sm border border-white/[0.06]'
                        }
                      `}
                    >
                      {msg.role === 'assistant'
                        ? renderWithSpiceLinks(msg.content, SPICE_NAMES, onClose)
                        : msg.content}
                    </div>
                  </div>
                ))}

                {/* Streaming en vivo */}

                {streaming && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-bl-sm px-3.5 py-2 bg-white/[0.07] border border-white/[0.06] font-fredoka text-sm text-floria-cream/90 leading-relaxed">
                      {streaming}
                      <span className="inline-block w-0.5 h-3.5 bg-floria-gold/70 ml-0.5 animate-pulse align-middle" />
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock */}
      <AnimatePresence>
        {isOpen && (
          <MessageDock
            key="wizard-dock"
            characters={wizardCharacters}
            onMessageSend={handleSend}
            placeholder={() => 'Escríbele al mago experto...'}
            expandedWidth={400}
            showSparkleButton={false}
            closeOnSend={false}
            closeOnClickOutside={false}
          />
        )}
      </AnimatePresence>
    </>
  )
}
