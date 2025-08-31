"use client"

import { useState, useEffect } from "react"
import { Bell, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

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
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % updates.length)
    }, 4000) // Change update every 4 seconds

    return () => clearInterval(interval)
  }, [])

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

  return (
    <section className="py-6 bg-background border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-primary">Latest Updates</span>
                </div>
                <div className="h-4 w-px bg-border"></div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">🔔</span>
                  <span className="text-sm text-muted-foreground">Live Updates</span>
                </div>
              </div>
            </div>

            <div className="mt-3 relative overflow-hidden">
                             <div 
                 className={`flex transition-transform duration-500 ease-in-out update-slider-${currentIndex}`}
               >
                {updates.map((update, index) => (
                  <div
                    key={update.id}
                    className="flex items-center justify-between min-w-full"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(update.type)}`}>
                        {getTypeLabel(update.type)}
                      </span>
                      <span className="text-sm font-medium">{update.message}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">{update.timestamp}</span>
                                             <a
                         href={update.link}
                         className="text-primary hover:text-primary/80 transition-colors"
                         title="View details"
                       >
                         <ExternalLink className="h-4 w-4" />
                         <span className="sr-only">View details</span>
                       </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots indicator */}
                         <div className="flex justify-center space-x-1 mt-3">
               {updates.map((_, index) => (
                 <button
                   key={index}
                   onClick={() => setCurrentIndex(index)}
                   className={`w-2 h-2 rounded-full transition-colors ${
                     index === currentIndex ? "bg-primary" : "bg-muted"
                   }`}
                   title={`Go to update ${index + 1}`}
                 />
               ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
