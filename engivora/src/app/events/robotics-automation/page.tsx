"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users, Wrench, Zap } from "lucide-react"

export default function RoboticsAutomationEventPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/" className="text-sky-400 hover:text-sky-300">Home</Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link href="/events" className="text-sky-400 hover:text-sky-300">Events</Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-300">Robotics & Automation</span>
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
                <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Workshop
                </span>
                <h1 className="text-4xl font-bold mb-4">Robotics & Automation Workshop</h1>
                <p className="text-xl text-slate-400">
                  Get hands-on experience with cutting-edge robotics technology and learn automation techniques that are shaping the future of industry.
                </p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                  <Calendar className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm text-slate-400">Date</p>
                    <p className="font-semibold">January 22, 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                  <Clock className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm text-slate-400">Time</p>
                    <p className="font-semibold">10:00 AM - 5:00 PM IST</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                  <MapPin className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm text-slate-400">Venue</p>
                    <p className="font-semibold">Engineering Lab, Building A</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                  <Users className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm text-slate-400">Capacity</p>
                    <p className="font-semibold text-orange-400">50 Students (Limited)</p>
                  </div>
                </div>
              </div>

              {/* Workshop Highlights */}
              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-6 rounded-xl mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Workshop Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-4 w-4 text-yellow-400" />
                    <span>Build your own robot</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wrench className="h-4 w-4 text-yellow-400" />
                    <span>Arduino & Raspberry Pi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wrench className="h-4 w-4 text-yellow-400" />
                    <span>Sensor integration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wrench className="h-4 w-4 text-yellow-400" />
                    <span>Take your robot home</span>
                  </div>
                </div>
              </div>

              {/* Instructor */}
              <div className="bg-slate-800/30 p-6 rounded-xl mb-8">
                <h3 className="text-xl font-semibold mb-4">Workshop Instructor</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-2xl font-bold">
                    MR
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Prof. Michael Rodriguez</h4>
                    <p className="text-slate-400">Robotics Professor, MIT</p>
                    <p className="text-sm text-slate-500 mt-1">15+ years in robotics research, Former Tesla Autopilot Team</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">About This Workshop</h3>
                <div className="space-y-4 text-slate-300">
                  <p>
                    This intensive hands-on workshop will introduce you to the exciting world of robotics and automation. 
                    You&apos;ll work with industry-standard tools and components to build functional robotic systems.
                  </p>
                  <p>
                    From basic sensors to complex actuators, you&apos;ll learn how to integrate various components 
                    to create intelligent automated systems. By the end of the workshop, you&apos;ll have built 
                    your own robot to take home!
                  </p>
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Workshop Schedule</h3>
                <div className="space-y-3">
                  {[
                    { time: "10:00 - 10:30 AM", title: "Welcome & Introduction to Robotics" },
                    { time: "10:30 - 12:00 PM", title: "Arduino Basics & Circuit Building" },
                    { time: "12:00 - 1:00 PM", title: "Lunch Break" },
                    { time: "1:00 - 2:30 PM", title: "Sensor Integration & Programming" },
                    { time: "2:30 - 2:45 PM", title: "Coffee Break" },
                    { time: "2:45 - 4:00 PM", title: "Building Your Robot" },
                    { time: "4:00 - 4:45 PM", title: "Testing & Troubleshooting" },
                    { time: "4:45 - 5:00 PM", title: "Demo & Wrap-up" }
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-slate-800/20 rounded-lg">
                      <span className="text-sky-400 font-semibold min-w-[130px]">{item.time}</span>
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Prerequisites & Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-sky-400 mb-3">Prerequisites</h4>
                    <ul className="space-y-2 text-slate-300">
                      <li>• Basic programming knowledge (any language)</li>
                      <li>• Interest in electronics and hardware</li>
                      <li>• No prior robotics experience required</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-400 mb-3">What&apos;s Provided</h4>
                    <ul className="space-y-2 text-slate-300">
                      <li>• Arduino Uno kit</li>
                      <li>• Sensors and actuators</li>
                      <li>• All necessary components</li>
                      <li>• Laptop (if needed)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Learning Outcomes */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Learning Outcomes</h3>
                <ul className="space-y-2 text-slate-300">
                  {[
                    "Understand fundamental robotics concepts and terminology",
                    "Build circuits using Arduino and various sensors",
                    "Write code to control robotic movements and responses",
                    "Integrate multiple sensors for complex behaviors",
                    "Troubleshoot common robotics problems",
                    "Plan and execute a complete robotics project"
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
                  <div className="text-3xl font-bold text-yellow-400 mb-2">₹1,499</div>
                  <p className="text-slate-400">Includes robot kit</p>
                  <p className="text-sm text-green-400">Early bird: ₹999</p>
                </div>
                
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4">
                  Register Now
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-slate-400">35/50 spots remaining</p>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-slate-800/50 p-6 rounded-xl mb-6">
                <h4 className="font-semibold mb-4">Workshop Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Level:</span>
                    <span>Beginner to Intermediate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span>7 Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Certificate:</span>
                    <span>Provided</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Take Home:</span>
                    <span>Your Robot</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Language:</span>
                    <span>English</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-slate-800/50 p-6 rounded-xl">
                <h4 className="font-semibold mb-4">Need Help?</h4>
                <p className="text-sm text-slate-400 mb-4">
                  Have questions about the workshop? Contact our team.
                </p>
                <button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded text-sm transition-colors">
                  Contact Support
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}