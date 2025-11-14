"use client"

import { motion } from "framer-motion"
import { EventCard } from "@/components/ui/event-card"
import Link from "next/link"

const events = [
  {
    id: "intro-quantum-computing",
    day: "15",
    mon: "JAN",
    tag: "Webinar",
    title: "Intro to Quantum Computing",
    tagColor: "bg-green-100 text-green-800",
    description: "Learn the fundamentals of quantum computing and its applications in modern technology.",
    time: "2:00 PM - 4:00 PM IST",
    speaker: "Dr. Sarah Chen, Quantum Research Institute",
    registrations: 450,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop"
  },
  {
    id: "robotics-automation",
    day: "22",
    mon: "JAN", 
    tag: "Workshop",
    title: "Robotics & Automation",
    tagColor: "bg-yellow-100 text-yellow-800",
    description: "Hands-on workshop covering modern robotics and automation techniques.",
    time: "10:00 AM - 5:00 PM IST",
    speaker: "Prof. Michael Rodriguez, MIT",
    registrations: 280,
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&h=200&fit=crop"
  },
  {
    id: "national-hackathon-2025",
    day: "05",
    mon: "FEB",
    tag: "Competition", 
    title: "National Hackathon 2025",
    tagColor: "bg-red-100 text-red-800",
    description: "48-hour coding competition with exciting prizes and opportunities.",
    time: "February 5-7, 2025",
    speaker: "Various Industry Mentors",
    registrations: 1250,
    image: "https://images.unsplash.com/photo-1555421689-43cad7100750?w=400&h=200&fit=crop"
  },
  {
    id: "alumni-networking-night",
    day: "18",
    mon: "FEB",
    tag: "Meetup",
    title: "Alumni Networking Night", 
    tagColor: "bg-purple-100 text-purple-800",
    description: "Connect with successful alumni and expand your professional network.",
    time: "6:00 PM - 9:00 PM IST",
    speaker: "Alumni Panel Discussion",
    registrations: 320,
    image: "https://images.unsplash.com/photo-1540331547168-8b63109225b7?w=400&h=200&fit=crop"
  },
  {
    id: "ai-machine-learning-workshop",
    day: "28",
    mon: "FEB",
    tag: "Workshop",
    title: "AI & Machine Learning Basics",
    tagColor: "bg-blue-100 text-blue-800", 
    description: "Introduction to AI and ML concepts with practical implementations.",
    time: "11:00 AM - 4:00 PM IST",
    speaker: "Dr. Priya Sharma, Google AI",
    registrations: 380,
    image: "https://images.unsplash.com/photo-1677442135722-5f11e06a4e6d?w=400&h=200&fit=crop"
  },
  {
    id: "startup-pitch-competition",
    day: "12",
    mon: "MAR",
    tag: "Competition",
    title: "Startup Pitch Competition",
    tagColor: "bg-orange-100 text-orange-800",
    description: "Present your startup ideas to industry experts and investors.",
    time: "9:00 AM - 6:00 PM IST", 
    speaker: "VC Panel & Entrepreneurs",
    registrations: 150,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop"
  }
]

export default function EventsPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6">Upcoming Events</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Discover workshops, webinars, competitions, and networking opportunities designed to accelerate your engineering journey.
          </p>
        </motion.div>

        {/* Featured Event */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-sky-900/50 to-purple-900/50 rounded-2xl p-8 md:p-12 glass-panel">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Featured Event
                </span>
                <h2 className="text-3xl font-bold mb-4">National Hackathon 2025</h2>
                <p className="text-slate-300 mb-6">
                  Join India&apos;s largest student hackathon with over 1000 participants, industry mentors, 
                  and exciting prizes worth ₹5 lakhs. Code for 48 hours straight and bring your innovative ideas to life.
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="bg-slate-800/50 px-4 py-2 rounded-lg">
                    <span className="text-sm text-slate-400">Date:</span>
                    <span className="ml-2 font-semibold">Feb 5-7, 2025</span>
                  </div>
                  <div className="bg-slate-800/50 px-4 py-2 rounded-lg">
                    <span className="text-sm text-slate-400">Registrations:</span>
                    <span className="ml-2 font-semibold text-green-400">1,250+</span>
                  </div>
                </div>
                <Link 
                  href="/events/national-hackathon-2025"
                  className="inline-flex items-center justify-center rounded-full bg-sky-600 hover:bg-sky-700 px-8 py-3 text-base font-semibold text-white transition-colors"
                >
                  Learn More →
                </Link>
              </div>
              <div className="hidden lg:block">
                <div className="relative h-64 bg-gradient-to-br from-sky-600/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏆</div>
                    <p className="text-lg font-semibold">₹5 Lakhs Prize Pool</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8">All Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <EventCard
                  day={event.day}
                  mon={event.mon}
                  tag={event.tag}
                  title={event.title}
                  tagColor={event.tagColor}
                  href={`/events/${event.id}`}
                  // Add image prop
                  image={event.image}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Event Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="bg-slate-800/30 p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-sky-400 mb-2">50+</div>
            <div className="text-slate-400">Events This Year</div>
          </div>
          <div className="bg-slate-800/30 p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">5,000+</div>
            <div className="text-slate-400">Total Participants</div>
          </div>
          <div className="bg-slate-800/30 p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">100+</div>
            <div className="text-slate-400">Industry Speakers</div>
          </div>
          <div className="bg-slate-800/30 p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">₹20L+</div>
            <div className="text-slate-400">Prize Money</div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center bg-slate-800/30 p-8 rounded-2xl"
        >
          <h3 className="text-2xl font-bold mb-4">Don&apos;t Miss Out!</h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to get notified about upcoming events and registration openings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white placeholder-slate-400"
            />
            <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}