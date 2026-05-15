import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import './Transition2.css'

export default function Transition2() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  })

  const sonyOpacity = useTransform(scrollYProgress, [0, 0.25, 0.5], [0, 1, 0])
  const canonOpacity = useTransform(scrollYProgress, [0.5, 0.75, 1], [0, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])

  return (
    <section ref={sectionRef} className="transition2-section">
      <div className="transition2-container">
        <motion.img
          src="/images/sony-mobile.webp"
          alt="sony camera"
          className="transition2-image"
          style={{ opacity: sonyOpacity, scale }}
        />
        <motion.img
          src="/images/canon.png"
          alt="canon camera"
          className="transition2-image transition2-image-canon"
          style={{ opacity: canonOpacity, scale }}
        />
      </div>
    </section>
  )
}
