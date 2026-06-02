'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * LenisScroll is a lightweight, client-side component that initializes
 * Lenis smooth kinetic scrolling. Conforms to SOP 02 guidelines.
 */
export default function LenisScroll() {
  useEffect(() => {
    // Instantiate Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom premium cubic easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    let rafId: number

    // Animation frame callback for scroll synchronization
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    // Clean up on component unmount
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return null
}
