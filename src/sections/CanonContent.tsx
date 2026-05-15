import { useEffect, useRef, useState } from 'react'
import TrueFocus from '../components/TrueFocus'
import './CanonContent.css'

export default function CanonContent() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="canon-section">
      <div className="canon-inner">
        <TrueFocus
          sentence="Need Focus?"
          manualMode={false}
          blurAmount={6}
          borderColor="#e30b20"
          glowColor="rgba(227, 11, 32, 0.5)"
          animationDuration={0.8}
          pauseBetweenAnimations={1.2}
          active={active}
        />
      </div>
    </section>
  )
}
