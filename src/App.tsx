import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Hero from './sections/Hero'
import Services from './sections/Services'
import About from './sections/About'
import Transition from './sections/Transition'
import Transition2 from './sections/Transition2'
import Gallery from './sections/Gallery'
import CanonContent from './sections/CanonContent'
import ZoomParallaxSection from './sections/ZoomParallaxSection'

gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })

    // Keep GSAP ScrollTrigger in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis from GSAP's ticker so both share one RAF loop
    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(onTick)
    }
  }, [])

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Transition />
      <Gallery />
      <Transition2 />
      <CanonContent />
      <ZoomParallaxSection />
    </>
  )
}

export default App
