import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const FULL_TEXT = 'VIKTOR'

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [displayed, setDisplayed] = useState('')

  // Type characters one by one
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(FULL_TEXT.slice(0, i))
      if (i === FULL_TEXT.length) clearInterval(interval)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Trigger exit after 1.5s
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9000,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '3rem',
          color: '#1a1a1a',
          letterSpacing: '0.08em',
          minWidth: '6ch',
        }}
      >
        {displayed}
      </span>
    </motion.div>
  )
}
