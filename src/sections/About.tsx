import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// Helvetica Now Display — falls back to Helvetica Neue / system sans
const DISPLAY = "'Helvetica Now Display', 'Helvetica Neue', Helvetica, Arial, sans-serif"

function FadeIn({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  return (
    <section
      id="about"
      style={{
        backgroundColor: '#0a0a0a',
        color: '#e8e4de',
        padding: '12rem 6vw 10rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Overline */}
        <FadeIn>
          <p
            style={{
              fontFamily: DISPLAY,
              fontSize: '0.7rem',
              letterSpacing: '0.22em',
              color: '#3a3a3a',
              textTransform: 'uppercase',
              marginBottom: '3.5rem',
            }}
          >
            About My Work
          </p>
        </FadeIn>

        {/* Main headline */}
        <FadeIn delay={0.08}>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: 'clamp(4rem, 9vw, 9rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: '#e8e4de',
              marginBottom: '5rem',
            }}
          >
            I shoot
            <br />
            <span style={{ color: '#2a2a2a' }}>what</span>
            <br />
            feels right.
          </h2>
        </FadeIn>

        {/* Thin rule */}
        <FadeIn delay={0.1}>
          <div style={{ width: '100%', height: '1px', backgroundColor: '#161616', marginBottom: '5rem' }} />
        </FadeIn>

        {/* Two-column row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            marginBottom: '6rem',
          }}
        >
          <FadeIn delay={0.12}>
            <p
              style={{
                fontFamily: DISPLAY,
                fontWeight: 400,
                fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
                lineHeight: 1.65,
                color: '#4a4a4a',
                maxWidth: '42ch',
              }}
            >
              What I like about photography is that it allows me to just go out and feel free. Wether I look for a creative compostion in the city, or capture a candid moment between people, I just enjoy the process of creating something that looks good to me. I don't have a specific style or subject that I shoot. I just try to follow my instincts and shoot what feels right in the moment. 
              <br /><br />
             
            </p>
          </FadeIn>

          <FadeIn delay={0.18}>
            <div>
              {[
                ['Gear', 'Anything that has a lens'],
                ['Based', 'Brno, CZ'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    padding: '1.1rem 0',
                    borderBottom: '1px solid #161616',
                  }}
                >
                  <span
                    style={{
                      fontFamily: DISPLAY,
                      fontSize: '0.68rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: '#2e2e2e',
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: DISPLAY,
                      fontSize: '0.88rem',
                      color: '#5a5a5a',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

      </div>
    </section>
  )
}
