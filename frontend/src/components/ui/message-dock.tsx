import { cn } from '@/lib/utils'
import { motion, useReducedMotion, AnimatePresence, type TargetAndTransition, type Variants } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

export interface Character {
  id?: string | number
  emoji: string
  name: string
  online: boolean
  backgroundColor?: string
  gradientColors?: string
  avatar?: string
}

export interface MessageDockProps {
  characters?: Character[]
  onMessageSend?: (message: string, character: Character, characterIndex: number) => void
  onCharacterSelect?: (character: Character, characterIndex: number) => void
  onDockToggle?: (isExpanded: boolean) => void
  className?: string
  expandedWidth?: number
  position?: 'bottom' | 'top'
  showSparkleButton?: boolean
  showMenuButton?: boolean
  enableAnimations?: boolean
  animationDuration?: number
  placeholder?: (characterName: string) => string
  autoFocus?: boolean
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  closeOnSend?: boolean
  defaultExpandedIndex?: number
}

const defaultCharacters: Character[] = [
  { emoji: '✨', name: 'Hechizo', online: false },
  {
    emoji: '🧙‍♂️',
    name: 'Oráculo',
    online: true,
    backgroundColor: 'bg-amber-400/30',
    gradientColors: '#fde68a, #fffbeb',
  },
  {
    emoji: '🌿',
    name: 'Botánica',
    online: true,
    backgroundColor: 'bg-green-500/30',
    gradientColors: '#86efac, #f0fdf4',
  },
  {
    emoji: '🌸',
    name: 'Flora',
    online: true,
    backgroundColor: 'bg-pink-400/30',
    gradientColors: '#f9a8d4, #fdf2f8',
  },
  {
    emoji: '⚗️',
    name: 'Alquimia',
    online: false,
    backgroundColor: 'bg-violet-400/30',
    gradientColors: '#c084fc, #f5f3ff',
  },
]

const getGradientColors = (character: Character) =>
  character.gradientColors ?? '#fde68a, #fffbeb'

const COLLAPSED_BG = 'rgba(9, 9, 13, 0.92)'

export function MessageDock({
  characters = defaultCharacters,
  onMessageSend,
  onCharacterSelect,
  onDockToggle,
  className,
  expandedWidth = 448,
  position = 'bottom',
  showSparkleButton = true,
  showMenuButton = true,
  enableAnimations = true,
  animationDuration = 1,
  placeholder = (name: string) => `Escríbele al ${name}...`,
  autoFocus = true,
  closeOnClickOutside = true,
  closeOnEscape = true,
  closeOnSend = true,
  defaultExpandedIndex,
}: MessageDockProps) {
  const shouldReduceMotion = useReducedMotion()
  const [expandedCharacter, setExpandedCharacter] = useState<number | null>(defaultExpandedIndex ?? null)
  const [messageInput, setMessageInput] = useState('')
  const dockRef = useRef<HTMLDivElement>(null)
  const [collapsedWidth, setCollapsedWidth] = useState<number>(266)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Expanded width capped to screen size with 24px margin on each side
  const [actualExpandedWidth, setActualExpandedWidth] = useState(() =>
    Math.min(expandedWidth, window.innerWidth - 48),
  )

  useEffect(() => {
    const update = () => setActualExpandedWidth(Math.min(expandedWidth, window.innerWidth - 48))
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [expandedWidth])

  useEffect(() => {
    if (dockRef.current && !hasInitialized) {
      const width = dockRef.current.offsetWidth
      if (width > 0) {
        setCollapsedWidth(width)
        setHasInitialized(true)
      }
    }
  }, [hasInitialized])

  useEffect(() => {
    if (!closeOnClickOutside) return
    const handleClickOutside = (event: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
        setExpandedCharacter(null)
        setMessageInput('')
        onDockToggle?.(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeOnClickOutside, onDockToggle])

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 100, scale: 0.8, x: '-50%' },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      x: '-50%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const hoverAnimation: TargetAndTransition = shouldReduceMotion
    ? { scale: 1.02 }
    : {
        scale: 1.05,
        y: -8,
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }

  const handleCharacterClick = (index: number) => {
    const character = characters[index]
    if (expandedCharacter === index) {
      setExpandedCharacter(null)
      setMessageInput('')
      onDockToggle?.(false)
    } else {
      setExpandedCharacter(index)
      onCharacterSelect?.(character, index)
      onDockToggle?.(true)
    }
  }

  const handleSendMessage = () => {
    if (messageInput.trim() && expandedCharacter !== null) {
      const character = characters[expandedCharacter]
      onMessageSend?.(messageInput, character, expandedCharacter)
      setMessageInput('')
      if (closeOnSend) {
        setExpandedCharacter(null)
        onDockToggle?.(false)
      }
    }
  }

  const selectedCharacter = expandedCharacter !== null ? characters[expandedCharacter] : null
  const isExpanded = expandedCharacter !== null

  const positionClasses =
    position === 'top'
      ? 'fixed top-6 left-1/2 z-50'
      : 'fixed bottom-6 left-1/2 z-50'

  return (
    <motion.div
      ref={dockRef}
      className={cn(positionClasses, className)}
      initial={enableAnimations ? 'hidden' : 'visible'}
      animate="visible"
      exit={{
        opacity: 0,
        y: 80,
        scale: 0.85,
        x: '-50%',
        transition: { duration: 0.22, ease: 'easeIn' },
      }}
      variants={enableAnimations ? containerVariants : undefined}
    >
      <motion.div
        className="rounded-full px-4 py-2 border border-white/[0.1] shadow-[0_8px_40px_rgba(0,0,0,0.65)]"
        animate={{
          width: isExpanded ? actualExpandedWidth : collapsedWidth,
          background: isExpanded && selectedCharacter
            ? `linear-gradient(to right, ${getGradientColors(selectedCharacter)})`
            : COLLAPSED_BG,
        }}
        transition={
          enableAnimations
            ? {
                type: 'spring',
                stiffness: isExpanded ? 300 : 500,
                damping: isExpanded ? 30 : 35,
                mass: isExpanded ? 0.8 : 0.6,
                background: { duration: 0.2 * animationDuration, ease: 'easeInOut' },
              }
            : { duration: 0 }
        }
      >
        <div className="flex items-center gap-2 relative">
          {/* Sparkle button */}
          {showSparkleButton && (
            <motion.div
              className="flex items-center justify-center"
              animate={{
                opacity: isExpanded ? 0 : 1,
                x: isExpanded ? -20 : 0,
                scale: isExpanded ? 0.8 : 1,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <motion.button
                className="w-12 h-12 flex items-center justify-center cursor-pointer"
                whileHover={
                  !isExpanded
                    ? { scale: 1.02, y: -2, transition: { type: 'spring', stiffness: 400, damping: 25 } }
                    : undefined
                }
                whileTap={{ scale: 0.95 }}
                aria-label="Sparkle"
              >
                <span className="text-2xl">✨</span>
              </motion.button>
            </motion.div>
          )}

          {/* First separator */}
          <motion.div
            className="w-px h-6 bg-white/15 mr-2 -ml-2"
            animate={{ opacity: isExpanded ? 0 : 1, scaleY: isExpanded ? 0 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, delay: isExpanded ? 0 : 0.3 }}
          />

          {/* Character buttons */}
          {characters.slice(1, -1).map((character, index) => {
            const actualIndex = index + 1
            const isSelected = expandedCharacter === actualIndex

            return (
              <motion.div
                key={character.name}
                className={cn('relative', isSelected && isExpanded && 'absolute left-1 top-1/2 -translate-y-1/2 z-20')}
                style={{
                  width: isSelected && isExpanded ? 0 : 'auto',
                  minWidth: isSelected && isExpanded ? 0 : 'auto',
                  overflow: 'visible',
                }}
                animate={{
                  opacity: isExpanded && !isSelected ? 0 : 1,
                  y: isExpanded && !isSelected ? 60 : 0,
                  scale: isExpanded && !isSelected ? 0.8 : 1,
                  x: 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                  delay: isExpanded && !isSelected ? index * 0.05 : isExpanded ? 0.1 : 0,
                }}
              >
                <motion.button
                  className={cn(
                    'relative w-10 h-10 rounded-full flex items-center justify-center text-xl cursor-pointer',
                    isSelected && isExpanded ? 'bg-white/90' : character.backgroundColor,
                  )}
                  onClick={() => handleCharacterClick(actualIndex)}
                  whileHover={!isExpanded ? hoverAnimation : { scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Mensaje a ${character.name}`}
                >
                  <span className="text-2xl">{character.emoji}</span>

                  {character.online && (
                    <motion.div
                      className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black/30 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: isExpanded && !isSelected ? 0 : 1 }}
                      transition={{
                        delay: isExpanded ? (isSelected ? 0.3 : 0) : (index + 1) * 0.1 + 0.5,
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              </motion.div>
            )
          })}

          {/* Text input */}
          <AnimatePresence>
            {isExpanded && (
              <motion.input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage()
                  if (e.key === 'Escape' && closeOnEscape) {
                    setExpandedCharacter(null)
                    setMessageInput('')
                    onDockToggle?.(false)
                  }
                }}
                placeholder={placeholder(selectedCharacter?.name ?? '')}
                className="absolute left-14 right-12 bg-transparent border-none outline-none text-sm font-medium z-50 text-gray-700 placeholder-gray-500"
                autoFocus={autoFocus}
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.2, type: 'spring', stiffness: 400, damping: 30 },
                }}
                exit={{ opacity: 0, transition: { duration: 0.1, ease: 'easeOut' } }}
              />
            )}
          </AnimatePresence>

          {/* Second separator */}
          <motion.div
            className="w-px h-6 bg-white/15 ml-2 -mr-2"
            animate={{ opacity: isExpanded ? 0 : 1, scaleY: isExpanded ? 0 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />

          {/* Menu / Send button */}
          {showMenuButton && (
            <motion.div
              className={cn('flex items-center justify-center z-20', isExpanded && 'absolute right-0')}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <AnimatePresence mode="wait">
                {!isExpanded ? (
                  <motion.button
                    key="menu"
                    className="w-12 h-12 flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.02, y: -2, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Menú"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-white/50"
                    >
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </motion.button>
                ) : (
                  <motion.button
                    key="send"
                    onClick={handleSendMessage}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-floria-gold hover:bg-floria-amber transition-colors disabled:opacity-40 cursor-pointer relative z-30"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={!messageInput.trim()}
                    initial={{ opacity: 0, scale: 0, rotate: -90 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0,
                      transition: { delay: 0.25, type: 'spring', stiffness: 400, damping: 30 },
                    }}
                    exit={{ opacity: 0, scale: 0, rotate: 90, transition: { duration: 0.1, ease: 'easeIn' } }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-floria-deep"
                    >
                      <path d="m22 2-7 20-4-9-9-4z" />
                      <path d="M22 2 11 13" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
