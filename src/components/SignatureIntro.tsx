import { useEffect, useRef, useState } from 'react'
import { img } from '../lib/img'

interface Props {
  onComplete: () => void
}

// ─── VZ Signature paths ───────────────────────────────────────────────────────
// ViewBox: 580 x 380
// Portrait square: 160×160 at (210, 110) — center (290, 190)
// Signature intentionally spills well beyond all four edges of the square.

const STROKES = [
  // 1 · V left arm — sharp diagonal from upper-left to the V junction
  'M 80,58 L 242,316',
  // 2 · V right arm — starts higher, slight curve into the same junction
  'M 322,36 C 316,90 295,190 242,316',
  // 3 · Z upper arc — lifts from junction up and to the right
  'M 242,316 C 278,280 344,244 386,230',
  // 4 · Z diagonal strike — the characteristic Z slash back down-left
  'M 386,230 C 360,265 318,306 294,330',
  // 5 · Z underline sweep — long tail shooting right
  'M 294,330 C 364,320 440,312 510,304',
]

// [startDelay ms, duration ms] per stroke
const SCHEDULE: [number, number][] = [
  [0,   250],
  [200, 265],
  [490, 205],
  [665, 185],
  [815, 245],
]

const DRAW_DONE = Math.max(...SCHEDULE.map(([d, dur]) => d + dur)) // ~1060 ms
const HOLD      = 900
const FADE_DUR  = 550

export default function SignatureIntro({ onComplete }: Props) {
  const svgRef  = useRef<SVGSVGElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path[data-s]'))

    // Initialise every path as fully hidden
    paths.forEach((p) => {
      const len = p.getTotalLength()
      p.style.strokeDasharray  = String(len)
      p.style.strokeDashoffset = String(len)
    })

    const timers: ReturnType<typeof setTimeout>[] = []

    // Draw each stroke in sequence
    SCHEDULE.forEach(([delay, duration], i) => {
      timers.push(
        setTimeout(() => {
          paths[i].style.transition      = `stroke-dashoffset ${duration}ms cubic-bezier(0.4,0,0.2,1)`
          paths[i].style.strokeDashoffset = '0'
        }, delay)
      )
    })

    // Hold → fade out → unmount
    timers.push(
      setTimeout(() => {
        const wrap = wrapRef.current
        if (wrap) {
          wrap.style.transition = `opacity ${FADE_DUR}ms ease`
          wrap.style.opacity    = '0'
        }
      }, DRAW_DONE + HOLD)
    )

    timers.push(
      setTimeout(() => {
        setMounted(false)
        onComplete()
      }, DRAW_DONE + HOLD + FADE_DUR + 40)
    )

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  if (!mounted) return null

  return (
    <div
      ref={wrapRef}
      style={{
        position:        'fixed',
        inset:           0,
        backgroundColor: '#080808',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        zIndex:          9999,
      }}
    >
      {/* Container sized to the SVG viewBox */}
      <div style={{ position: 'relative', width: 580, height: 380 }}>

        {/* Desaturated portrait — sits behind the signature */}
        <img
          src={img('/images/DSCF1914.jpg')}
          alt=""
          style={{
            position:       'absolute',
            left:           210,
            top:            110,
            width:          160,
            height:         160,
            objectFit:      'cover',
            objectPosition: 'center top',
            filter:         'grayscale(100%) brightness(0.38) contrast(1.15)',
            display:        'block',
          }}
        />

        {/* SVG signature — drawn on top, bleeds outside the square */}
        <svg
          ref={svgRef}
          viewBox="0 0 580 380"
          width="580"
          height="380"
          style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        >
          {STROKES.map((d, i) => (
            <path
              key={i}
              data-s
              d={d}
              stroke="white"
              strokeWidth={i === 0 || i === 1 ? 6.5 : 5.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
        </svg>

      </div>
    </div>
  )
}
