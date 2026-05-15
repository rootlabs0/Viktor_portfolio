import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import './Services.css'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ─────────────────────────────────────────────────────────────────────

const STRIP_WIDTH = 11000

interface Photo {
  x: number
  y: string
  w: number
  h: number
  src: string
  label: string
  meta: string   // time & place shown above the card
}

// Photos shifted left so the collage opens mid-flow — no pre-scroll needed
const PHOTOS: Photo[] = [
  { x: 680,  y: '8%',  w: 450, h: 320, src: '/images/DSCF1130-2.jpg',  label: 'COMMERCIAL · 2024', meta: 'Prague, CZ — Spring 2024'      },
  { x: 1280,  y: '57%', w: 210, h: 300, src: '/images/me-2.jpg',  label: 'FASHION · 2024',    meta: 'Berlin, DE — Feb 2024'         },
  { x: 1640, y: '12%', w: 380, h: 520, src: '/images/xh1.png',  label: 'CAMERA · 2024',   meta: 'Prague, CZ — Oct 2024'           },
  { x: 2170, y: '12%', w: 380, h: 520, src: '/images/Document-2.jpg',  label: 'EDITORIAL · 2024',      meta: 'Vienna, AT — Mar 2024'          },
  { x: 2700, y: '10%', w: 300, h: 215, src: '/images/villa.jpg',  label: 'ARCHITECTURE · 2024',     meta: 'Brno, CZ — Apr 2024'         },
  { x: 3150, y: '55%', w: 400, h: 300, src: '/images/flowers.jpg',  label: 'NATURE · 2024', meta: 'Brno, CZ — May 2024'    },
  { x: 3700, y: '20%', w: 255, h: 380, src: '/images/nophotosynthesis-2.jpg',  label: 'ABSTRACT · 2024',  meta: 'Berlin, DE — Jun 2024'          },
  { x: 4105, y: '28%', w: 500, h: 370, src: '/images/fontana-2.jpg',  label: 'URBAN · 2024',   meta: 'Rome, IT — Jul 2024'      },
  { x: 4755, y: '16%', w: 240, h: 340, src: '/images/catedral-2.jpg',  label: 'LANDMARK · 2024',   meta: 'Barcelona, ES — Aug 2024'           },
  { x: 5145, y: '35%', w: 420, h: 280, src: '/images/tram.jpg',  label: 'STREET · 2024',   meta: 'Prague, CZ — Sep 2024'           },
  { x: 5620, y: '20%', w: 380, h: 480, src: '/images/tisnov train-2.jpg',  label: 'TRANSPORT · 2024',   meta: 'Tišnov, CZ — Oct 2024'           },
  { x: 6120, y: '10%', w: 340, h: 400, src: '/images/railways man-2.jpg',  label: 'PORTRAIT · 2024',   meta: 'Railways, CZ — Oct 2024'           },
  { x: 6520, y: '50%', w: 420, h: 280, src: '/images/symmetry-2.jpg',  label: 'ARCHITECTURE · 2024',   meta: 'Czech Republic — Oct 2024'           },
  { x: 7000, y: '15%', w: 300, h: 500, src: '/images/stairs-2.jpg',  label: 'GEOMETRIC · 2024',   meta: 'Prague, CZ — Oct 2024'           },
  { x: 7380, y: '40%', w: 480, h: 340, src: '/images/ligthts-2.jpg',  label: 'NIGHT · 2024',   meta: 'Prague, CZ — Oct 2024'           },
  { x: 7920, y: '25%', w: 360, h: 380, src: '/images/cafe-2.jpg',  label: 'LIFESTYLE · 2024',   meta: 'Prague, CZ — Oct 2024'           },
  { x: 8340, y: '55%', w: 400, h: 300, src: '/images/skyscrapers-2.jpg',  label: 'URBAN · 2024',   meta: 'Prague, CZ — Oct 2024'           },
  { x: 8800, y: '12%', w: 350, h: 420, src: '/images/jiggly walk-2.jpg',  label: 'MOTION · 2024',   meta: 'Prague, CZ — Oct 2024'           },
  { x: 9220, y: '45%', w: 410, h: 310, src: '/images/theathr-2.jpg',  label: 'CULTURAL · 2024',   meta: 'Prague, CZ — Oct 2024'           },
  { x: 9700, y: '22%', w: 360, h: 400, src: '/images/ruzicka-2.jpg',  label: 'PORTRAIT · 2024',   meta: 'Prague, CZ — Oct 2024'           },
  { x: 10200, y: '18%', w: 420, h: 520, src: '/images/skyline-2.jpg',   label: 'URBAN · 2024',     meta: 'Czech Republic — 2024'            },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const stripRef   = useRef<HTMLDivElement>(null)
  const stickyRef  = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const strip   = stripRef.current
    const sticky  = stickyRef.current
    const heading = headingRef.current
    if (!section || !strip || !sticky || !heading) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${STRIP_WIDTH - window.innerWidth}`,
          scrub: true,
          pin: sticky,
          invalidateOnRefresh: true,
        },
      })

      // Strip moves full distance
      tl.to(strip, { x: -(STRIP_WIDTH - window.innerWidth), ease: 'none', force3D: true }, 0)

      // Heading moves at 35% of strip speed (in the opposite direction relative
      // to the strip), so it drifts slower across the viewport and eventually
      // scrolls off to the left
      tl.to(heading, {
        x: (STRIP_WIDTH - window.innerWidth) * 0.25,
        ease: 'none',
        force3D: true,
      }, 0)
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <section
        ref={sectionRef}
        className="services-section"
        style={{ height: `${STRIP_WIDTH}px` }}
      >
        <div ref={stickyRef} className="services-sticky">
          <div
            ref={stripRef}
            className="services-strip"
            style={{ width: `${STRIP_WIDTH}px` }}
          >
            <h2 ref={headingRef} className="srv-heading">My<br />Journey</h2>
            {PHOTOS.map((photo, idx) => (
              <div
                key={idx}
                className="srv-card-wrap"
                style={{ position: 'absolute', left: photo.x, top: photo.y }}
              >
                <span className="srv-label">{photo.label}</span>
                <span className="srv-meta">{photo.meta}</span>
                <img
                  className="srv-card-img"
                  src={photo.src}
                  alt={photo.label}
                  draggable={false}
                  loading="eager"
                  decoding="async"
                  style={{ width: photo.w, height: photo.h, cursor: 'pointer' }}
                  onClick={() => setSelectedImage(photo.src)}
                />
              </div>
            ))}
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
