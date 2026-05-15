import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { img } from '../lib/img'
import './Hero.css'

// ─── VZ Signature ──────────────────────────────────────────────────────────────
// ViewBox 580×380 — bleeds well outside the square on all sides

const SIG_STROKES = [
  { d: 'M 80,58 L 242,316',                                      sw: 6.5 }, // V left arm
  { d: 'M 322,36 C 316,90 295,190 242,316',                      sw: 6.5 }, // V right arm
  { d: 'M 242,316 C 278,280 344,244 386,230',                    sw: 5.5 }, // Z upper arc
  { d: 'M 386,230 C 360,265 318,306 294,330',                    sw: 5.5 }, // Z diagonal
  { d: 'M 294,330 C 364,320 440,312 510,304',                    sw: 5.5 }, // underline tail
]

// [startDelay ms, duration ms]
const SIG_SCHEDULE: [number, number][] = [
  [0,   240],
  [190, 260],
  [475, 200],
  [645, 180],
  [795, 240],
]

function SignatureOverlay({ active, onExited }: { active: boolean; onExited: () => void }) {
  const svgRef  = useRef<SVGSVGElement>(null)
  const drawn   = useRef(false)   // true once forward pass has initialised paths
  const timers  = useRef<ReturnType<typeof setTimeout>[]>([])

  // helper — get cached path lengths (computed once per mount)
  const lengths = useRef<number[]>([])

  // Initialise dash arrays on first render
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path[data-sig]'))
    lengths.current = paths.map((p) => p.getTotalLength())
    paths.forEach((p, i) => {
      p.style.strokeDasharray  = String(lengths.current[i])
      p.style.strokeDashoffset = String(lengths.current[i])
    })
  }, [])

  useEffect(() => {
    // clear any in-flight timers whenever direction changes
    timers.current.forEach(clearTimeout)
    timers.current = []

    const svg = svgRef.current
    if (!svg) return
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path[data-sig]'))

    if (active) {
      // ── Forward: draw each stroke in schedule order
      drawn.current = true
      SIG_SCHEDULE.forEach(([delay, dur], i) => {
        timers.current.push(setTimeout(() => {
          paths[i].style.transition       = `stroke-dashoffset ${dur}ms cubic-bezier(0.4,0,0.2,1)`
          paths[i].style.strokeDashoffset = '0'
        }, delay))
      })
    } else {
      // ── Reverse: un-draw in reverse stroke order
      if (!drawn.current) { onExited(); return }
      const REV_DUR = 180
      const REV_GAP = 120
      ;[...SIG_SCHEDULE].reverse().forEach(([, ], ri) => {
        const i = SIG_STROKES.length - 1 - ri
        timers.current.push(setTimeout(() => {
          paths[i].style.transition       = `stroke-dashoffset ${REV_DUR}ms cubic-bezier(0.6,0,0.8,1)`
          paths[i].style.strokeDashoffset = String(lengths.current[i])
        }, ri * REV_GAP))
      })
      const totalReverse = (SIG_STROKES.length - 1) * REV_GAP + REV_DUR + 40
      timers.current.push(setTimeout(() => { drawn.current = false; onExited() }, totalReverse))
    }

    return () => timers.current.forEach(clearTimeout)
  }, [active, onExited])

  return (
    <div
      style={{
        position:       'absolute',
        inset:          0,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        pointerEvents:  'none',
        zIndex:         20,
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 580 380"
        width="720"
        height="470"
        style={{ overflow: 'visible' }}
      >
        {SIG_STROKES.map(({ d, sw }, i) => (
          <path
            key={i}
            data-sig
            d={d}
            stroke="white"
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}
      </svg>
    </div>
  )
}

// ─── Nav ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'home',    targetId: null },
  { label: 'about',   targetId: 'about' },
  { label: 'contact', targetId: 'contact' },
] as const

function Nav() {
  const scrollTo = (id: string | null) => {
    if (!id) return
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      style={{
        position: 'absolute',
        top: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.75rem',
        zIndex: 10,
        whiteSpace: 'nowrap',
      }}
    >
      {NAV_ITEMS.map(({ label, targetId }) => {
        const active = label === 'home'
        return (
          <button
            key={label}
            onClick={() => scrollTo(targetId)}
            style={{
              borderRadius: 999,
              border: active ? '1.5px solid transparent' : '1.5px solid rgba(255,255,255,0.5)',
              background: active ? 'rgba(80,65,60,0.75)' : 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
              padding: '0.5rem 1.4rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              fontWeight: 400,
              color: active ? '#ffffff' : '#1a1a1a',
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.2)'
            }}
            onMouseLeave={(e) => {
              if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'
            }}
          >
            {label}
          </button>
        )
      })}
    </nav>
  )
}

// ─── SVG placeholders ────────────────────────────────────────────────────────

/** Actual image thumbnail */
function ImageThumb({ src, onClick }: { src: string; onClick?: () => void }) {
  return (
    <img
      src={src}
      alt="Portfolio"
      onClick={onClick}
      style={{
        width: '80px',
        height: '80px',
        objectFit: 'cover',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
      }}
    />
  )
}

function FolderIcon() {
  return (
    <svg width="80" height="68" viewBox="0 0 80 68" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="10" width="80" height="58" rx="6" fill="#1a8fff" />
      <rect x="0" y="10" width="80" height="58" rx="6" fill="url(#folderGrad)" />
      <path d="M0 22 Q0 10 10 10 H30 Q36 10 38 16 H70 Q80 16 80 26 V62 Q80 68 74 68 H6 Q0 68 0 62 Z" fill="#3ab5ff" />
      <defs>
        <linearGradient id="folderGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#57c8ff" />
          <stop offset="100%" stopColor="#1a8fff" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0a84ff" />
      <rect x="10" y="18" width="44" height="30" rx="4" fill="white" />
      <polyline points="10,18 32,36 54,18" fill="none" stroke="#0a84ff" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#igGrad)" />
      <rect x="14" y="14" width="36" height="36" rx="10" fill="none" stroke="white" strokeWidth="3.5" />
      <circle cx="32" cy="32" r="9" fill="none" stroke="white" strokeWidth="3.5" />
      <circle cx="44.5" cy="19.5" r="2.5" fill="white" />
    </svg>
  )
}

function RetroIcon() {
  // Retro paint bucket / art app icon
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#e17055" />
      <rect x="12" y="12" width="40" height="30" rx="3" fill="white" />
      <rect x="14" y="14" width="36" height="26" rx="2" fill="#fab1a0" />
      {/* Pencil */}
      <rect x="28" y="30" width="5" height="18" rx="2" fill="white" transform="rotate(-30 28 30)" />
      <polygon points="28,44 33,44 30.5,50" fill="#fdcb6e" transform="rotate(-30 28 30)" />
    </svg>
  )
}

// ─── Icon label ──────────────────────────────────────────────────────────────

function IconLabel({ children }: { children: string }) {
  return (
    <span
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '0.75rem',
        color: '#1a1a1a',
        textAlign: 'center',
        marginTop: '0.3rem',
        userSelect: 'none',
        textShadow: '0 1px 2px rgba(255,255,255,0.7)',
      }}
    >
      {children}
    </span>
  )
}

// ─── Draggable icon wrapper ───────────────────────────────────────────────────

interface DraggableIconProps {
  left: string
  top: string
  index: number
  constraintsRef: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
}

function DraggableIcon({ left, top, index, constraintsRef, children }: DraggableIconProps) {
  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragMomentum={false}
      initial={{ opacity: 0, x: '50vw', y: '50vh', translateX: '-50%', translateY: '-50%' }}
      animate={{ opacity: 1, x: 0, y: 0, translateX: 0, translateY: 0 }}
      transition={{
        type: 'spring',
        stiffness: 60,
        damping: 15,
        delay: index * 0.08,
        opacity: { duration: 0.3, delay: index * 0.08 },
      }}
      whileHover={{ scale: 1.05, transition: { duration: 0.15, ease: 'easeOut' } }}
      whileDrag={{ zIndex: 100 }}
      style={{
        position: 'absolute',
        left,
        top,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
        zIndex: 5,
      }}
    >
      {children}
    </motion.div>
  )
}

// ─── Thumbnail icon ───────────────────────────────────────────────────────────

function ThumbIcon({
  label,
  src,
  left,
  top,
  index,
  constraintsRef,
  onImageClick,
}: {
  label: string
  src: string
  left: string
  top: string
  index: number
  constraintsRef: React.RefObject<HTMLDivElement | null>
  onImageClick?: () => void
}) {
  return (
    <DraggableIcon left={left} top={top} index={index} constraintsRef={constraintsRef}>
      <ImageThumb src={src} onClick={onImageClick} />
      <IconLabel>{label}</IconLabel>
    </DraggableIcon>
  )
}

// ─── Icon definitions ─────────────────────────────────────────────────────────

const PORTFOLIO_IMAGES = [
  img('/images/lemans.jpg'),
  img('/images/ucl.jpg'),
  img('/images/kostel.jpg'),
  img('/images/workses.jpg'),
  img('/images/audi.jpg'),
  img('/images/sakura.jpg'),
  img('/images/dog.jpg'),
  img('/images/rs4.jpg'),
  img('/images/bayern.jpg'),
  img('/images/adri.jpg'),
]

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const scrollRef      = useRef<HTMLDivElement>(null)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const [signing,    setSigning]    = useState(false)
  const [sigVisible, setSigVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end start'],
  })

  const scale        = useTransform(scrollYProgress, [0, 0.75], [1, 0.22])
  const opacity      = useTransform(scrollYProgress, [0.72, 1], [1, 0])
  const borderRadius = useTransform(scrollYProgress, [0, 0.75], [0, 20])

  // Trigger signature when card is nearly fully shrunk
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v >= 0.38 && !signing) {
      setSigning(true)
      setSigVisible(true)
    }
    if (v < 0.38 && signing) {
      setSigning(false)
      // sigVisible stays true until reverse animation calls onExited
    }
  })

  return (
    <div ref={scrollRef} style={{ height: '300vh', position: 'relative' }}>
      {/* Sticky frame */}
      <div
        style={{
          position:        'sticky',
          top:             0,
          height:          '100vh',
          overflow:        'hidden',
          backgroundColor: '#0a0a0a',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
        }}
      >
        {/* Outer fade wrapper — fades both card + signature together */}
        <motion.div
          style={{
            opacity,
            position: 'relative',
            width:    '100%',
            height:   '100%',
            display:  'flex',
            alignItems:      'center',
            justifyContent:  'center',
          }}
        >
          {/* Inner scale wrapper */}
          <motion.div
            style={{
              scale,
              borderRadius,
              width:           '100%',
              height:          '100%',
              transformOrigin: 'center center',
              overflow:        'hidden',
            }}
          >
          {/* Hero background + draggable content */}
          <div
            ref={constraintsRef}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              backgroundColor: '#c4b5a8',
              backgroundImage: `url(${img('/images/hero.jpg')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Vignette overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.18) 100%)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />

            <Nav />

            {/* ── JPG thumbnails ── */}
{[
              { left: '28%', top: '18%', index: 3 },
              { left: '37%', top: '28%', index: 4 },
              { left: '35%', top: '55%', index: 5 },
              { left: '14%', top: '52%', index: 6 },
              { left: '10%', top: '65%', index: 7 },
              { left: '42%', top: '63%', index: 8 },
              { left: '60%', top: '65%', index: 9 },
              { left: '84%', top: '33%', index: 10 },
            ].map(({ left, top, index }, i) => (
              <ThumbIcon
                key={`thumb-${i}`}
                label="Culture.jpg"
                src={PORTFOLIO_IMAGES[i]}
                left={left}
                top={top}
                index={index}
                constraintsRef={constraintsRef}
                onImageClick={() => setSelectedImage(PORTFOLIO_IMAGES[i])}
              />
            ))}

            {/* ── Two additional thumbs ── */}
            <ThumbIcon
              label="Culture.jpg"
              src={PORTFOLIO_IMAGES[8]}
              left="82%"
              top="15%"
              index={11}
              constraintsRef={constraintsRef}
              onImageClick={() => setSelectedImage(PORTFOLIO_IMAGES[8])}
            />
            <ThumbIcon
              label="Culture.jpg"
              src={PORTFOLIO_IMAGES[9]}
              left="87%"
              top="58%"
              index={12}
              constraintsRef={constraintsRef}
              onImageClick={() => setSelectedImage(PORTFOLIO_IMAGES[9])}
            />

            {/* ── Mail icon ── */}
            <DraggableIcon left="12%" top="15%" index={0} constraintsRef={constraintsRef}>
              <a href="mailto:vikzatlouk@gmail.com" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                <MailIcon />
                <IconLabel>Mail</IconLabel>
              </a>
            </DraggableIcon>

            {/* ── Instagram icon ── */}
            <DraggableIcon left="65%" top="42%" index={1} constraintsRef={constraintsRef}>
              <a href="https://www.instagram.com/viktorasxz/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                <InstagramIcon />
                <IconLabel>Social</IconLabel>
              </a>
            </DraggableIcon>

            {/* ── Retro app icon ── */}
            <DraggableIcon left="72%" top="22%" index={2} constraintsRef={constraintsRef}>
              <RetroIcon />
              <IconLabel>Paint</IconLabel>
            </DraggableIcon>

            {/* ── Folder icon ── */}
            <DraggableIcon left="88%" top="78%" index={13} constraintsRef={constraintsRef}>
              <FolderIcon />
              <IconLabel>Culture</IconLabel>
            </DraggableIcon>
          </div>
          </motion.div>

          {/* Signature — stays mounted during reverse animation */}
          {sigVisible && (
            <SignatureOverlay
              active={signing}
              onExited={() => setSigVisible(false)}
            />
          )}
        </motion.div>
      </div>

      {/* ─── Lightbox ─── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="hero-lightbox-backdrop"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="hero-lightbox-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <img src={selectedImage} alt="expanded" className="hero-lightbox-image" />
              <button
                className="hero-lightbox-close"
                onClick={() => setSelectedImage(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
