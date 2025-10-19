"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users, Trophy, Gift, Code, Zap } from "lucide-react"

export default function NationalHackathonEventPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/" className="text-sky-400 hover:text-sky-300">Home</Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link href="/events" className="text-sky-400 hover:text-sky-300">Events</Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-300">National Hackathon 2025</span>
        </nav>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-red-900/50 to-purple-900/50 rounded-2xl p-8 md:p-12 mb-12"
        >
          <div className="text-center">
            <span className="inline-block bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              Competition • Featured Event
            </span>
            <h1 className="text-5xl font-bold mb-4">National Hackathon 2025</h1>
            <p className="text-xl text-slate-300 mb-6 max-w-3xl mx-auto">
              India&apos;s largest student hackathon. 48 hours. 1000+ participants. ₹5 lakhs in prizes. Are you ready to code your way to victory?
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">1,250+</div>
                <div className="text-sm text-slate-400">Registrations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">₹5L</div>
                <div className="text-sm text-slate-400">Prize Pool</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">48</div>
                <div className="text-sm text-slate-400">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">100+</div>
                <div className="text-sm text-slate-400">Mentors</div>
              </div>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
              Register Your Team
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                  <Calendar className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm text-slate-400">Dates</p>
                    <p className="font-semibold">February 5-7, 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                  <Clock className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm text-slate-400">Duration</p>
                    <p className="font-semibold">48 Hours Non-Stop</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                  <MapPin className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm text-slate-400">Venue</p>
                    <p className="font-semibold">Hybrid (Online + Offline)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                  <Users className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm text-slate-400">Team Size</p>
                    <p className="font-semibold">2-4 Members</p>
                  </div>
                </div>
              </div>

              {/* Prizes */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  Prize Pool: ₹5,00,000
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 p-6 rounded-xl text-center border border-yellow-500/30">
                    <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">1st Place</h4>
                    <div className="text-3xl font-bold text-yellow-400 mb-2">₹2,00,000</div>
                    <p className="text-sm text-slate-400">+ Internship opportunities</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-600/20 to-slate-800/20 p-6 rounded-xl text-center border border-slate-500/30">
                    <Trophy className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">2nd Place</h4>
                    <div className="text-3xl font-bold text-slate-400 mb-2">₹1,50,000</div>
                    <p className="text-sm text-slate-400">+ Mentorship program</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 p-6 rounded-xl text-center border border-orange-500/30">
                    <Trophy className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">3rd Place</h4>
                    <div className="text-3xl font-bold text-orange-400 mb-2">₹1,00,000</div>
                    <p className="text-sm text-slate-400">+ Tech vouchers</p>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/30 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Special Prizes</h5>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Best AI/ML Solution: ₹25,000</li>
                      <li>• Most Innovative Idea: ₹20,000</li>
                      <li>• Best UI/UX Design: ₹15,000</li>
                    </ul>
                  </div>
                  <div className="bg-slate-800/30 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Participation Perks</h5>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Certificate of participation</li>
                      <li>• Exclusive hackathon merchandise</li>
                      <li>• Networking opportunities</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Themes */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">Hackathon Themes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Healthcare Technology", icon: "🏥", desc: "Solutions for digital health and medical innovation" },
                    { title: "Education Tech", icon: "📚", desc: "Learning platforms and educational tools" },
                    { title: "Sustainability", icon: "🌱", desc: "Climate change and environmental solutions" },
                    { title: "Fintech", icon: "💰", desc: "Financial technology and digital payments" },
                    { title: "Smart Cities", icon: "🏙️", desc: "Urban planning and IoT solutions" },
                    { title: "Open Innovation", icon: "🚀", desc: "Any creative technology solution" }
                  ].map((theme, index) => (
                    <div key={index} className="bg-slate-800/30 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{theme.icon}</span>
                        <h4 className="font-semibold">{theme.title}</h4>
                      </div>
                      <p className="text-sm text-slate-400">{theme.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">Event Schedule</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-red-400">Day 1 - February 5</h4>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span>6:00 PM</span>
                        <span className="text-slate-400">Registration & Check-in</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>7:00 PM</span>
                        <span className="text-slate-400">Opening Ceremony</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>8:00 PM</span>
                        <span className="text-slate-400">Hackathon Begins!</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-semibold text-yellow-400">Day 2 - February 6</h4>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span>10:00 AM</span>
                        <span className="text-slate-400">Mentor Sessions</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>2:00 PM</span>
                        <span className="text-slate-400">Progress Check-in</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>7:00 PM</span>
                        <span className="text-slate-400">Tech Talks</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-green-400">Day 3 - February 7</h4>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span>8:00 AM</span>
                        <span className="text-slate-400">Final Push</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>8:00 PM</span>
                        <span className="text-slate-400">Submissions Close</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>9:00 PM</span>
                        <span className="text-slate-400">Presentations & Judging</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>11:00 PM</span>
                        <span className="text-slate-400">Award Ceremony</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rules & Guidelines */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">Rules & Guidelines</h3>
                <div className="bg-slate-800/30 p-6 rounded-xl">
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-sky-400 mt-1">•</span>
                      <span>Teams must consist of 2-4 members (students only)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-sky-400 mt-1">•</span>
                      <span>All code must be written during the hackathon period</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-sky-400 mt-1">•</span>
                      <span>Teams can use any programming language or framework</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-sky-400 mt-1">•</span>
                      <span>Projects must be original and address one of the given themes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-sky-400 mt-1">•</span>
                      <span>All submissions must include source code and demo video</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-sky-400 mt-1">•</span>
                      <span>Final presentations are 5 minutes + 2 minutes Q&A</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="sticky top-8"
            >
              {/* Registration Card */}
              <div className="bg-slate-800/50 p-6 rounded-xl mb-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-400 mb-2">FREE</div>
                  <p className="text-slate-400">Early Bird Registration</p>
                  <p className="text-sm text-red-400">Limited Time Offer</p>
                </div>
                
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4">
                  Register Your Team
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-slate-400">1,250+ teams registered</p>
                  <p className="text-xs text-orange-400 mt-1">Registration closes January 31</p>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="bg-slate-800/50 p-6 rounded-xl mb-6">
                <h4 className="font-semibold mb-4">Quick Facts</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Entry Fee:</span>
                    <span className="text-green-400 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Team Size:</span>
                    <span>2-4 Members</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Eligibility:</span>
                    <span>Students Only</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Format:</span>
                    <span>Hybrid Event</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mentors:</span>
                    <span>100+ Industry Experts</span>
                  </div>
                </div>
              </div>

              {/* Sponsors */}
              <div className="bg-slate-800/50 p-6 rounded-xl mb-6">
                <h4 className="font-semibold mb-4">Sponsored By</h4>
                <div className="space-y-3 text-center">
                  <div className="bg-slate-700 p-3 rounded text-sm">🏢 Tech Giants</div>
                  <div className="bg-slate-700 p-3 rounded text-sm">🚀 Startups</div>
                  <div className="bg-slate-700 p-3 rounded text-sm">🎓 Universities</div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-slate-800/50 p-6 rounded-xl">
                <h4 className="font-semibold mb-4">Need Help?</h4>
                <p className="text-sm text-slate-400 mb-4">
                  Questions about registration or event details?
                </p>
                <div className="space-y-2">
                  <button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded text-sm transition-colors">
                    Join Discord
                  </button>
                  <button className="w-full bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded text-sm transition-colors">
                    Email Support
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