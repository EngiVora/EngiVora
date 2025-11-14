"use client"

import Link from "next/link"
import { motion, useMotionValue, useTransform } from "framer-motion"

type ProjectCardProps = {
  title: string
  description: string
  imageUrl: string
  collaboratorsLabel?: string
  href?: string
}

export function ProjectCard({ title, description, imageUrl, collaboratorsLabel = "+2 collaborators", href = "#" }: ProjectCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-50, 50], [8, -8])
  const rotateY = useTransform(x, [-50, 50], [-8, 8])

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - r.left - r.width / 2)
    y.set(e.clientY - r.top - r.height / 2)
  }

  return (
    <motion.div
      className="group glass-panel overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-700/50 backdrop-blur-sm"
      style={{ perspective: 1000 }}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      <motion.div style={{ rotateX, rotateY }}>
        <div className="h-48 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url(${imageUrl})` }} />
        <div className="p-6">
          <h4 className="text-xl font-bold mb-3 text-slate-100">{title}</h4>
          <p className="text-sm text-slate-400 mb-5">{description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xs font-semibold text-slate-400">{collaboratorsLabel}</span>
            </div>
            <Link href={href} className="text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 group">
              View Project 
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}