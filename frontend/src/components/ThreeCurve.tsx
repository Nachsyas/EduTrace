'use client'

import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface ThreeCurveProps {
  scores: number[]
  dropoutRisk: number
  startupProbability?: number
}

/**
 * ThreeCurve renders a highly responsive, custom 3D particle learning curve.
 * Ascends or descends dynamically depending on scores and dropout risk factors.
 * Conforms to SOP 02 and SOP 03 rules.
 */
export default function ThreeCurve({ scores, dropoutRisk, startupProbability = 0 }: ThreeCurveProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const isHighAlert = dropoutRisk >= 75.0
  const isAccelerated = dropoutRisk < 15.0 && startupProbability >= 70.0
  const isWarning = dropoutRisk >= 40.0 && !isHighAlert

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const container = containerRef.current
    const canvas = canvasRef.current

    // 1. Scene Setup
    const scene = new THREE.Scene()

    // 2. Camera Setup
    const width = container.clientWidth
    const height = container.clientHeight
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 12)

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // 4. Create Glowing Particle System
    const particleCount = 280
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    // Formulate initial spline shape parameters
    const xRange = 10.0
    const startX = -xRange / 2

    // Determine target parameters based on risk levels and startup success
    let baseColor = new THREE.Color('#6366f1') // Default Indigo
    let accentColor = new THREE.Color('#a855f7') // Default Purple
    let waveSpeed = 2.0
    let rotationSpeed = 0.05
    let shapeSlope = 1.2

    if (isHighAlert) {
      baseColor = new THREE.Color('#ff0033') // Neon Red
      accentColor = new THREE.Color('#ef4444') // Crimson
      waveSpeed = 0.5 // Slow flow
      rotationSpeed = 0.02 // Erratic slow rotation
      shapeSlope = -1.8 // Steep decline
    } else if (isAccelerated) {
      baseColor = new THREE.Color('#00f5d4') // Neon Teal
      accentColor = new THREE.Color('#06b6d4') // Bright Cyan
      waveSpeed = 4.5 // Fast spiral flow
      rotationSpeed = 0.2 // Fast spin
      shapeSlope = 2.5 // Steep acceleration
    } else if (isWarning) {
      baseColor = new THREE.Color('#ef4444') // Amber Red
      accentColor = new THREE.Color('#f97316') // Orange
      waveSpeed = 1.2
      rotationSpeed = 0.04
      shapeSlope = -0.8
    }

    // Populate initial coordinates
    for (let i = 0; i < particleCount; i++) {
      const t = i / (particleCount - 1)
      const x = startX + t * xRange

      const curveHeight = Math.sin(t * Math.PI) * 1.5 + (t * shapeSlope)
      const y = curveHeight + (Math.random() - 0.5) * 0.15 // Adding subtle spatial noise
      const z = (Math.random() - 0.5) * 0.5

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Blend gradient colors along the wave
      const mixedColor = baseColor.clone().lerp(accentColor, t)
      colors[i * 3] = mixedColor.r
      colors[i * 3 + 1] = mixedColor.g
      colors[i * 3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Particle texture (simple circular point)
    const createCircleTexture = () => {
      const matCanvas = document.createElement('canvas')
      matCanvas.width = 16
      matCanvas.height = 16
      const ctx = matCanvas.getContext('2d')
      if (ctx) {
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
        grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)')
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, 16, 16)
      }
      return new THREE.CanvasTexture(matCanvas)
    }

    // Material matching bento grid glow
    const material = new THREE.PointsMaterial({
      size: 0.14,
      map: createCircleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // 5. Animation loop
    let animationFrameId: number
    const startTime = performance.now()

    let isIntersecting = true
    let isVisible = true

    const animate = () => {
      if (!isIntersecting || !isVisible) {
        // Halt render loop entirely when not visible to save CPU/GPU!
        return
      }

      animationFrameId = requestAnimationFrame(animate)

      const elapsedTime = (performance.now() - startTime) / 1000
      const positionAttr = geometry.attributes.position as THREE.BufferAttribute
      const positionsArray = positionAttr.array as Float32Array

      // Animate particles in wave patterns
      for (let i = 0; i < particleCount; i++) {
        const t = i / (particleCount - 1)
        const x = positionsArray[i * 3]

        // Dynamic sine wave logic simulating real-time sequence flow
        const waveFrequency = 1.5
        const wave1 = Math.sin(x * waveFrequency + elapsedTime * waveSpeed) * 0.25
        const wave2 = Math.cos(x * 0.8 - elapsedTime * waveSpeed * 1.3) * 0.15

        const curveHeight = Math.sin(t * Math.PI) * 1.2 + (t * shapeSlope)

        // Apply wave updates to Y coordinates
        positionsArray[i * 3 + 1] = curveHeight + wave1 + wave2
      }

      positionAttr.needsUpdate = true

      // Dynamic orbital rotate based on risk level and startup capability
      points.rotation.y = elapsedTime * rotationSpeed

      renderer.render(scene, camera)
    }

    // 6. IntersectionObserver to check visibility inside viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting
        if (isIntersecting && isVisible) {
          cancelAnimationFrame(animationFrameId)
          animate()
        }
      },
      { threshold: 0.02 }
    )
    observer.observe(container)

    // 7. Visibility Change Handler
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible'
      if (isIntersecting && isVisible) {
        cancelAnimationFrame(animationFrameId)
        animate()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Start initial loop
    animate()

    // 8. Handle Container Resize
    const handleResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight

      camera.aspect = w / h
      camera.updateProjectionMatrix()

      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      observer.disconnect()
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [scores, dropoutRisk, startupProbability, isHighAlert, isAccelerated, isWarning])

  // Compute status display text and ping class dynamically
  let statusText = 'Ascending Curve (Optimal)'
  let pingBgClass = 'bg-indigo-500'
  if (isHighAlert) {
    statusText = 'Severe Declining Curve (Alert)'
    pingBgClass = 'bg-red-600'
  } else if (isAccelerated) {
    statusText = 'Accelerated Learning Trajectory (Elite)'
    pingBgClass = 'bg-teal-400'
  } else if (dropoutRisk >= 40.0) {
    statusText = 'Declining Curve (Warning)'
    pingBgClass = 'bg-red-500'
  }

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full absolute inset-0 block" />
      {/* Floating stats tag over canvas */}
      <div className="absolute bottom-4 left-4 z-10 py-1.5 px-3 border border-white/5 bg-black/60 backdrop-blur-md rounded-lg flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full animate-ping ${pingBgClass}`} />
        <span className="text-[10px] font-mono text-neutral-400 font-semibold tracking-wider uppercase">
          {statusText}
        </span>
      </div>
    </div>
  )
}
