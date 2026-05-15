import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Footer.css'

const DISPLAY = "'Helvetica Now Display', 'Helvetica Neue', Helvetica, Arial, sans-serif"

function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

const LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/viktorasxz/' },
  { label: 'Email',     href: 'mailto:vikzatlouk@gmail.com' }
]

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      {/* Top divider line */}
      <div className="footer-rule" />

      <div className="footer-inner">
        {/* Goodbye heading */}
        <FadeIn className="footer-heading-wrap">
          <p className="footer-eyebrow" style={{ fontFamily: DISPLAY }}>
            Let's connect
          </p>
          <h2 className="footer-heading" style={{ fontFamily: DISPLAY }}>
            See something<br />
            you like?
          </h2>
        </FadeIn>

        {/* Contact block */}
        <FadeIn delay={0.12} className="footer-contact-wrap">
          <p className="footer-contact-label" style={{ fontFamily: DISPLAY }}>
            Get in touch
          </p>
          <a
            className="footer-email"
            href="mailto:viktor@zatloukal.dev"
            style={{ fontFamily: DISPLAY }}
          >
            vikzatlouk@gmail.com
          </a>

          <nav className="footer-links">
            {LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="footer-link"
                style={{ fontFamily: DISPLAY }}
              >
                {label}
                <span className="footer-link-arrow">↗</span>
              </a>
            ))}
          </nav>
        </FadeIn>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span className="footer-copy" style={{ fontFamily: DISPLAY }}>
          © {new Date().getFullYear()} Viktor Zatloukal
        </span>
        <span className="footer-bye" style={{ fontFamily: DISPLAY }}>
          Thanks for scrolling.
        </span>
      </div>
    </footer>
  )
}
