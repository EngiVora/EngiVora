"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, ExternalLink } from "lucide-react"

// Mock data - in real app this would come from server + admin seed
const updates = [
  {
    id: 1,
    type: "exam",
    message: "GATE 2025 registration deadline extended to December 15th",
    link: "/exams/gate-2025",
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    type: "job",
    message: "Google is hiring Software Engineers for 2025 batch",
    link: "/jobs/google-software-engineer",
    timestamp: "4 hours ago"
  },
  {
    id: 3,
    type: "discount",
    message: "50% off on Coursera courses for engineering students",
    link: "/discounts/coursera-50-off",
    timestamp: "6 hours ago"
  },
  {
    id: 4,
    type: "blog",
    message: "New blog: How to prepare for technical interviews",
    link: "/blogs/technical-interview-prep",
    timestamp: "8 hours ago"
  },
  {
    id: 5,
    type: "exam",
    message: "JEE Advanced 2025 notification released",
    link: "/exams/jee-advanced-2025",
    timestamp: "12 hours ago"
  },
  {
    id: 6,
    type: "job",
    message: "Microsoft internship applications open for summer 2025",
    link: "/jobs/microsoft-internship",
    timestamp: "1 day ago"
  }
]

export function UpdateTicker() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "exam":
        return "text-blue-600 bg-blue-100"
      case "job":
        return "text-green-600 bg-green-100"
      case "discount":
        return "text-yellow-600 bg-yellow-100"
      case "blog":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "exam":
        return "Exam"
      case "job":
        return "Job"
      case "discount":
        return "Discount"
      case "blog":
        return "Blog"
      default:
        return "Update"
    }
  }

  // Step-by-step circulation (carousel) with ping-pong direction
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [paused, setPaused] = useState(false)
  const maxIndex = updates.length - 1
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex && direction === 1) {
          setDirection(-1)
          return prev - 1
        }
        if (prev <= 0 && direction === -1) {
          setDirection(1)
          return prev + 1
        }
        return prev + direction
      })
    }, 3500)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [direction, paused, maxIndex])

  return (
    <section className="relative border-b overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] grid-noise" />
      <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-12 text-sm text-slate-300">
          <div className="flex items-center gap-2 pr-4 mr-4 border-r border-white/10">
            <Bell className="h-4 w-4 text-sky-400" />
            <span className="font-semibold text-sky-300">Latest</span>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div className={`flex transition-transform duration-500 ease-in-out update-slider-${currentIndex}`}>
              {updates.map((u) => (
                <div key={u.id} className="min-w-full flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getTypeColor(u.type)} whitespace-nowrap`}>
                      {getTypeLabel(u.type)}
                    </span>
                    <span className="text-slate-200/90 whitespace-nowrap">{u.message}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 hidden sm:inline">{u.timestamp}</span>
                    <a href={u.link} className="text-sky-400 hover:text-sky-300" title="Open">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="sr-only">Open</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
