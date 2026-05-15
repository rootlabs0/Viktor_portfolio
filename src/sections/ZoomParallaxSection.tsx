import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ZoomParallax } from '../components/ui/zoom-parallax'
import './Gallery.css'
import './ZoomParallaxSection.css'

const IMAGES = [
  { src: '/images/ultras.jpg',   alt: 'Le Mans race circuit' },
  { src: '/images/dembele.jpg',     alt: 'Audi on the road' },
  { src: '/images/trio.jpg',   alt: 'Sakura blossom' },
  { src: '/images/finger.jpg',   alt: 'Bayern' },
  { src: '/images/circle.jpg',      alt: 'UCL' },
  { src: '/images/olise.jpg',      alt: 'Olise' },
  { src: '/images/musiala.jpg',     alt: 'Musiala' },
]

export default function ZoomParallaxSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ['start start', 'end end'],
  })

  // Fade in text only after ultras image has zoomed to fill the screen (~scale 4, progress 0.88+)
  const textOpacity = useTransform(scrollYProgress, [0.88, 0.97], [0, 1])
  const textY       = useTransform(scrollYProgress, [0.88, 0.97], ['30px', '0px'])
  const dimOpacity  = useTransform(scrollYProgress, [0.75, 0.97], [0, 0.55])

  return (
    <>
      <section className="zoom-parallax-section">
        <div ref={parallaxRef} style={{ position: 'relative' }}>
          <ZoomParallax images={IMAGES} onImageClick={setSelectedImage} />
          {/* Text overlay — fades in when ultras.jpg is at fullscreen */}
          <div className="zp-text-overlay-track">
            <div className="zp-text-overlay-sticky">
              {/* dim layer */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#000',
                  opacity: dimOpacity,
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
              <motion.div
                className="zp-text-overlay-content"
                style={{ opacity: textOpacity, y: textY, position: 'relative', zIndex: 1 }}
              >
                <p className="ultras-eyebrow">Champions League 2026</p>
                <h2 className="ultras-heading">Passion<br />Hope<br />Freedom</h2>
                <p className="ultras-body">
                  Such a moment doesn't come here and there, you gotta be ready to capture it when it does. 
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="lightbox-backdrop"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <img src={selectedImage} alt="expanded" className="lightbox-image" />
              <button
                className="lightbox-close"
                onClick={() => setSelectedImage(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
