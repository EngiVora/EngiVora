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

  // Map card titles to thematic background images
  const getBackgroundImage = (title: string) => {
    const imageMap: Record<string, string> = {
      "Exam Updates": "https://images.unsplash.com/photo-1584697964358-3e14ca5765b0?auto=format&fit=crop&w=800&q=80",
      "Jobs & Internships": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      "Blogs": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
      "Discounts": "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=800&q=80",
      "Work Hub": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
    }
    return imageMap[title] || imageUrl
  }

  const backgroundImage = getBackgroundImage(title)

  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className="group relative overflow-hidden rounded-2xl glass-panel h-full border border-slate-700/50 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-300"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      {/* Background image with blur and opacity */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 -z-10 opacity-15 group-hover:opacity-20 transition-opacity duration-500"
          style={{ 
            backgroundImage: `url(${backgroundImage})`, 
            backgroundSize: "cover", 
            backgroundPosition: "center",
            filter: "blur(2px)"
          }} 
        />
      )}
      
      {/* Dark overlay to blend with dark theme */}
      <div className="absolute inset-0 -z-10 bg-slate-900/30" />
      
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative p-8 min-h-[280px] flex flex-col items-center text-center"
      >
        <div className="mb-6 rounded-2xl bg-sky-900/20 p-4 border border-sky-800/50 backdrop-blur-sm group-hover:bg-sky-900/30 transition-all duration-300">
          {icon}
        </div>
        <h4 className="text-2xl font-bold text-slate-100 mb-3">{title}</h4>
        <p className="text-slate-400 text-sm mb-6">{description}</p>
        <span className="mt-auto inline-flex items-center rounded-full bg-sky-600/20 text-sky-400 px-5 py-2.5 text-sm font-semibold border border-sky-800/50 backdrop-blur-sm hover:bg-sky-600/30 transition-all duration-300 group-hover:scale-105">
          {cta}
        </span>
      </motion.div>
      <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10 group-hover:ring-sky-400/40 transition-colors duration-300" />
    </motion.a>
  )
}