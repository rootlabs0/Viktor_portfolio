import { useScroll, useTransform, motion } from 'framer-motion'
import { useRef } from 'react'

interface Image {
  src: string
  alt?: string
}

interface ZoomParallaxProps {
  /** Array of images to be displayed in the parallax effect — max 7 images */
  images: Image[]
  onImageClick?: (src: string) => void
}

// Per-slot layout — all images are 2:3 portrait
// width + height are set explicitly so cards feel large and impactful
// tight offsets create intentional overlaps between cards
const SLOTS: { width: string; height: string; top: string; left: string }[] = [
  { width: '26vw', height: '39vh', top: '0',      left: '0'      }, // 0 — center anchor
  { width: '21vw', height: '32vh', top: '-20vh',  left: '-18vw'  }, // 1 — upper-left (overlaps center)
  { width: '18vw', height: '27vh', top: '-17vh',  left: '17vw'   }, // 2 — upper-right (overlaps center)
  { width: '20vw', height: '30vh', top: '3vh',    left: '23vw'   }, // 3 — right (grazes center edge)
  { width: '19vw', height: '28vh', top: '4vh',    left: '-24vw'  }, // 4 — left (grazes center edge)
  { width: '19vw', height: '28vh', top: '22vh',   left: '-13vw'  }, // 5 — lower-left (overlaps center)
  { width: '17vw', height: '25vh', top: '21vh',   left: '19vw'   }, // 6 — lower-right (overlaps center)
]

export function ZoomParallax({ images, onImageClick }: ZoomParallaxProps) {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4])
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5])
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6])
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8])
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9])

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9]

  return (
    <div ref={container} style={{ position: 'relative', height: '300vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length]
          const slot = SLOTS[index % SLOTS.length]

          return (
            <motion.div
              key={index}
              style={{
                scale,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: slot.width,
                  height: slot.height,
                  top: slot.top,
                  left: slot.left,
                  flexShrink: 0,
                  cursor: onImageClick ? 'pointer' : 'default',
                  pointerEvents: 'auto',
                }}
                onClick={() => onImageClick?.(src)}
              >
                <img
                  src={src}
                  alt={alt || `Parallax image ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
