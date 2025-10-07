"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"

type EventCardProps = {
  day: string
  mon: string
  tag: string
  title: string
  tagColor?: string
}

export function EventCard({ day, mon, tag, title, tagColor = "bg-green-100 text-green-800" }: EventCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-40, 40], [6, -6])
  const rotateY = useTransform(x, [-40, 40], [-6, 6])

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - r.left - r.width / 2)
    y.set(e.clientY - r.top - r.height / 2)
  }

  return (
    <motion.div className="glass-panel overflow-hidden" style={{ perspective: 1000 }} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0) }}>
      <motion.div style={{ rotateX, rotateY }}>
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-sky-900/50 text-sky-400 rounded-lg">
              <span className="text-3xl font-bold text-sky-400">{day}</span>
              <span className="text-xs font-semibold text-sky-300">{mon}</span>
            </div>
            <div>
              <span className={`inline-block ${tagColor} text-xs font-semibold px-3 py-1 rounded-full mb-2`}>{tag}</span>
              <h4 className="font-bold">{title}</h4>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}


