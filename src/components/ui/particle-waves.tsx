"use client"

import { useEffect, useRef } from "react"

type Particle = { x: number; y: number; vx: number; vy: number }

export function ParticleWaves() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const num = Math.min(140, Math.floor((width * height) / 25000))
    particlesRef.current = Array.from({ length: num }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }))

    function resize() {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", resize)

    function tick() {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = "rgba(56,189,248,0.6)"
      const particles = particlesRef.current
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.strokeStyle = "rgba(99,102,241,0.35)"
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < 120) {
            ctx.globalAlpha = 1 - dist / 120
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    tick()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-200 mix-blend-screen"
    />
  )
}


