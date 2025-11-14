"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users, ExternalLink } from "lucide-react"

export default function QuantumComputingEventPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/" className="text-sky-400 hover:text-sky-300">Home</Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link href="/events" className="text-sky-400 hover:text-sky-300">Events</Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-300">Intro to Quantum Computing</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Event Header */}
              <div className="mb-8">
                <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Webinar
                </span>
                <h1 className="text-4xl font-bold mb-4">Intro to Quantum Computing</h1>
                <p className="text-xl text-slate-400">
                  Discover the revolutionary world of quantum computing and its potential to transform technology as we know it.
                </p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                  <Calendar className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm text-slate-400">Date</p>
                    <p className="font-semibold">January 15, 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                  <Clock className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm text-slate-400">Time</p>
                    <p className="font-semibold">2:00 PM - 4:00 PM IST</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                  <MapPin className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm text-slate-400">Format</p>
                    <p className="font-semibold">Online Webinar</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                  <Users className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm text-slate-400">Registrations</p>
                    <p className="font-semibold text-green-400">450+ Students</p>
                  </div>
                </div>
              </div>

              {/* Speaker */}
              <div className="bg-slate-800/30 p-6 rounded-xl mb-8">
                <h3 className="text-xl font-semibold mb-4">Featured Speaker</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold">
                    SC
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Dr. Sarah Chen</h4>
                    <p className="text-slate-400">Senior Researcher, Quantum Research Institute</p>
                    <p className="text-sm text-slate-500 mt-1">PhD in Quantum Physics from MIT, 10+ years in quantum research</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">About This Event</h3>
                <div className="space-y-4 text-slate-300">
                  <p>
                    Join us for an exciting introduction to the fascinating world of quantum computing! 
                    This webinar is designed for students with little to no background in quantum physics 
                    but with a curiosity about this revolutionary technology.
                  </p>
                  <p>
                    Dr. Sarah Chen will guide you through the fundamental concepts of quantum computing, 
                    explain how it differs from classical computing, and showcase real-world applications 
                    that are already transforming industries.
                  </p>
                </div>
              </div>

              {/* Agenda */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Event Agenda</h3>
                <div className="space-y-3">
                  {[
                    { time: "2:00 - 2:15 PM", title: "Welcome & Introduction" },
                    { time: "2:15 - 2:45 PM", title: "Quantum Computing Fundamentals" },
                    { time: "2:45 - 3:15 PM", title: "Real-World Applications" },
                    { time: "3:15 - 3:30 PM", title: "Break" },
                    { time: "3:30 - 3:50 PM", title: "Career Opportunities in Quantum" },
                    { time: "3:50 - 4:00 PM", title: "Q&A Session" }
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-slate-800/20 rounded-lg">
                      <span className="text-sky-400 font-semibold min-w-[100px]">{item.time}</span>
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What You'll Learn */}
              <div>
                <h3 className="text-xl font-semibold mb-4">What You&apos;ll Learn</h3>
                <ul className="space-y-2 text-slate-300">
                  {[
                    "Basic principles of quantum mechanics",
                    "How quantum computers work differently from classical computers",
                    "Current applications in cryptography, optimization, and simulation",
                    "Major players in the quantum computing industry",
                    "Career paths and opportunities in quantum technology",
                    "Resources for further learning"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-sky-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-8"
            >
              {/* Registration Card */}
              <div className="bg-slate-800/50 p-6 rounded-xl mb-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-400 mb-2">FREE</div>
                  <p className="text-slate-400">Online Event</p>
                </div>
                
                <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4">
                  Register Now
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-slate-400">450+ students already registered</p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-slate-800/50 p-6 rounded-xl mb-6">
                <h4 className="font-semibold mb-4">Quick Info</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Level:</span>
                    <span>Beginner</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span>2 Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Certificate:</span>
                    <span>Provided</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Recording:</span>
                    <span>Available</span>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="bg-slate-800/50 p-6 rounded-xl">
                <h4 className="font-semibold mb-4">Share Event</h4>
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors">
                    Twitter
                  </button>
                  <button className="flex-1 bg-blue-800 hover:bg-blue-900 text-white py-2 px-3 rounded text-sm transition-colors">
                    LinkedIn
                  </button>
                  <button className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-3 rounded text-sm transition-colors">
                    Copy Link
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}