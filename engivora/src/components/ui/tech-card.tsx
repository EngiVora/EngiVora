"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import { ReactNode } from "react"

type TechCardProps = {
  title: string
  description: string
  cta?: string
  href?: string
  icon?: ReactNode
  imageUrl?: string
  delay?: number
}

export function TechCard({ title, description, cta = "Learn more →", href = "#", icon, imageUrl, delay = 0 }: TechCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-50, 50], [10, -10])
  const rotateY = useTransform(x, [-50, 50], [-10, 10])

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - rect.left - rect.width / 2
    const py = e.clientY - rect.top - rect.height / 2
    x.set(px)
    y.set(py)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className="group relative overflow-hidden rounded-2xl glass-panel h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative p-8 min-h-[220px] flex flex-col items-center text-center"
      >
        {imageUrl && (
          <div className="absolute inset-0 -z-10 opacity-20 group-hover:opacity-30 transition-opacity" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        )}
        <div className="mb-4 rounded-full bg-white/10 p-4 border border-white/20">
          {icon}
        </div>
        <h4 className="text-2xl font-bold">{title}</h4>
        <p className="mt-2 text-slate-400 text-sm">{description}</p>
        <span className="mt-6 inline-flex items-center rounded-full bg-sky-600 text-white px-5 py-2 text-sm font-semibold neon-ring">
          {cta}
        </span>
      </motion.div>
      <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10 group-hover:ring-sky-400/40 transition-colors" />
    </motion.a>
  )
}


