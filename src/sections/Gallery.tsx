import { useRef, useState } from 'react'
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion'
import { ScrollTiltedGrid } from '../components/ui/scroll-tilted-grid'
import './Gallery.css'

const SONY_IMAGES: readonly string[] = [
  '/images/DSC00069.jpg',
  '/images/DSC00272.jpg',
  '/images/DSC00314.jpg',
  '/images/DSC00338-2.jpg',
  '/images/DSC00491.jpg',
  '/images/DSC00520-2.jpg',
  '/images/DSC00531.jpg',
  '/images/DSC00542.jpg',
  '/images/liberty.jpg',
  '/images/DSC00575.jpg',
]

export default function Gallery() {
  const sectionRef = useRef(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const { scrollYProgress: headingProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'start start'],
  })

  const headingY = useTransform(headingProgress, [0, 1], [0, -50])

  return (
    <>
      <section ref={sectionRef} className="gallery-section">
        <div className="gallery-header">
          <motion.h2 className="gallery-heading" style={{ y: headingY }}>
            Weekend gig with Sony
          </motion.h2>
          <p className="gallery-intro">
            I borrowed a Sony α7 for a week and captured this collection during that time. A fresh perspective with a new camera body, exploring familiar Prague streets and moments through a different lens.
          </p>
        </div>

        <ScrollTiltedGrid
          images={SONY_IMAGES}
          aspectRatio="3/4"
          maxWidth="2xl"
          gap={10}
          perspective={900}
          maxTilt={70}
          maxBlur={8}
          rounded="4px"
          onImageClick={setSelectedImage}
        />
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

