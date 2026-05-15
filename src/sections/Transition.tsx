import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { img } from '../lib/img'
import './Transition.css'

export default function Transition() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  })

  // First half: xh1 fades in and out (0 to 0.5)
  const xh1Opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5],
    [0, 1, 0]
  )

  // Second half: Sony fades in and out (0.5 to 1)
  const sonyOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.75, 1],
    [0, 1, 0]
  )

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])

  // White until Sony is fully visible (0.75), then fades to black
  const backgroundColor = useTransform(
    scrollYProgress,
    [0.75, 1],
    ['#ffffff', '#000000']
  )

  return (
    <motion.section ref={sectionRef} className="transition-section" style={{ backgroundColor }}>
      <div className="transition-container">
        <motion.img
          src={img('/images/xh1.png')}
          alt="xh1 camera"
          className="transition-image transition-image-xh1"
          style={{
            opacity: xh1Opacity,
            scale,
          }}
        />
        <motion.img
          src={img('/images/sony-mobile.webp')}
          alt="sony camera"
          className="transition-image"
          style={{
            opacity: sonyOpacity,
            scale,
          }}
        />
      </div>
    </motion.section>
  )
}
