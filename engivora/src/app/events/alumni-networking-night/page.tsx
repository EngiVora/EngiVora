"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users, Network, Briefcase } from "lucide-react"

export default function AlumniNetworkingEventPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/" className="text-sky-400 hover:text-sky-300">Home</Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link href="/events" className="text-sky-400 hover:text-sky-300">Events</Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-300">Alumni Networking Night</span>
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
                <span className="inline-block bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Meetup
                </span>
                <h1 className="text-4xl font-bold mb-4">Alumni Networking Night</h1>
                <p className="text-xl text-slate-400">
                  Connect with successful alumni from top companies and expand your professional network while gaining valuable career insights.
                </p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                  <Calendar className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm text-slate-400">Date</p>
                    <p className="font-semibold">February 18, 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                  <Clock className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm text-slate-400">Time</p>
                    <p className="font-semibold">6:00 PM - 9:00 PM IST</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                  <MapPin className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm text-slate-400">Venue</p>
                    <p className="font-semibold">Grand Ballroom, Hotel Meridien</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-lg">
                  <Users className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm text-slate-400">Attendees</p>
                    <p className="font-semibold text-purple-400">320+ Registered</p>
                  </div>
                </div>
              </div>

              {/* Networking Highlights */}
              <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-6 rounded-xl mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Network className="h-5 w-5 text-purple-400" />
                  Networking Opportunities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-purple-400" />
                    <span>Meet 50+ successful alumni</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-purple-400" />
                    <span>Industry leaders from FAANG</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-purple-400" />
                    <span>Startup founders & entrepreneurs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-purple-400" />
                    <span>Live career guidance sessions</span>
                  </div>
                </div>
              </div>

              {/* Featured Alumni */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6">Featured Alumni Speakers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-800/30 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-2xl font-bold">
                        RK
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">Rahul Kumar</h4>
                        <p className="text-slate-400">Senior SDE, Google</p>
                        <p className="text-sm text-slate-500">Class of 2018</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300">
                      From campus to Google in 3 years. Rahul will share his journey and tips for cracking tech interviews.
                    </p>
                  </div>
                  
                  <div className="bg-slate-800/30 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold">
                        PS
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">Priya Sharma</h4>
                        <p className="text-slate-400">Founder, TechStart</p>
                        <p className="text-sm text-slate-500">Class of 2016</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300">
                      Built a ₹50 CR startup from her dorm room. Priya will discuss entrepreneurship and startup funding.
                    </p>
                  </div>

                  <div className="bg-slate-800/30 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-2xl font-bold">
                        AM
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">Ankit Mehta</h4>
                        <p className="text-slate-400">ML Engineer, Tesla</p>
                        <p className="text-sm text-slate-500">Class of 2019</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300">
                      Working on autonomous driving at Tesla. Ankit will talk about AI/ML career opportunities.
                    </p>
                  </div>

                  <div className="bg-slate-800/30 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-2xl font-bold">
                        SG
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">Sneha Gupta</h4>
                        <p className="text-slate-400">Product Manager, Microsoft</p>
                        <p className="text-sm text-slate-500">Class of 2017</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300">
                      Leading product development for Microsoft Teams. Sneha will discuss transitioning from engineering to product.
                    </p>
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">About This Event</h3>
                <div className="space-y-4 text-slate-300">
                  <p>
                    Join us for an exclusive evening of networking with our most successful alumni who have made their mark 
                    in top tech companies, startups, and various industries. This is your opportunity to connect with 
                    professionals who started their journey right where you are today.
                  </p>
                  <p>
                    The event features informal networking sessions, panel discussions, one-on-one mentoring opportunities, 
                    and career guidance sessions. Whether you&apos;re looking for internship opportunities, job referrals, 
                    or simply career advice, this event is designed to help you build meaningful professional connections.
                  </p>
                </div>
              </div>

              {/* Event Schedule */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Event Agenda</h3>
                <div className="space-y-3">
                  {[
                    { time: "6:00 - 6:30 PM", title: "Registration & Welcome Drinks" },
                    { time: "6:30 - 7:00 PM", title: "Opening Remarks & Alumni Introductions" },
                    { time: "7:00 - 7:45 PM", title: "Panel Discussion: Career Paths in Tech" },
                    { time: "7:45 - 8:00 PM", title: "Networking Break with Refreshments" },
                    { time: "8:00 - 8:30 PM", title: "One-on-One Mentoring Sessions" },
                    { time: "8:30 - 9:00 PM", title: "Open Networking & Closing" }
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-slate-800/20 rounded-lg">
                      <span className="text-sky-400 font-semibold min-w-[120px]">{item.time}</span>
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industries Represented */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Industries & Companies Represented</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "Google", "Microsoft", "Amazon", "Tesla",
                    "Meta", "Netflix", "Uber", "Adobe",
                    "Flipkart", "Zomato", "Paytm", "BYJU'S",
                    "Goldman Sachs", "JP Morgan", "Deloitte", "McKinsey"
                  ].map((company, index) => (
                    <div key={index} className="bg-slate-800/30 p-3 rounded-lg text-center text-sm">
                      {company}
                    </div>
                  ))}
                </div>
              </div>

              {/* What to Expect */}
              <div>
                <h3 className="text-xl font-semibold mb-4">What to Expect</h3>
                <ul className="space-y-2 text-slate-300">
                  {[
                    "Direct access to alumni from top tech companies and startups",
                    "Insights into different career paths and industry trends",
                    "Opportunity for one-on-one mentoring sessions",
                    "Tips for resume building and interview preparation",
                    "Potential internship and job referral opportunities",
                    "Building long-term professional relationships"
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
                  <div className="text-3xl font-bold text-purple-400 mb-2">₹299</div>
                  <p className="text-slate-400">Includes dinner & networking kit</p>
                  <p className="text-sm text-green-400">Students: ₹199</p>
                </div>
                
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4">
                  Register Now
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-slate-400">320+ professionals attending</p>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">85% capacity filled</p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-slate-800/50 p-6 rounded-xl mb-6">
                <h4 className="font-semibold mb-4">Event Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dress Code:</span>
                    <span>Business Casual</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span>3 Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dinner:</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Networking:</span>
                    <span>50+ Alumni</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Photos:</span>
                    <span>Professional</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-slate-800/50 p-6 rounded-xl mb-6">
                <h4 className="font-semibold mb-4">Event Coordinator</h4>
                <div className="text-sm text-slate-300">
                  <p className="mb-2"><strong>Alumni Relations Office</strong></p>
                  <p className="mb-1">📧 alumni@engivora.edu</p>
                  <p className="mb-3">📞 +91 9876543210</p>
                  <button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded text-sm transition-colors">
                    Contact Support
                  </button>
                </div>
              </div>

              {/* Alumni Stats */}
              <div className="bg-slate-800/50 p-6 rounded-xl">
                <h4 className="font-semibold mb-4">Alumni Network</h4>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">5,000+</div>
                    <div className="text-sm text-slate-400">Global Alumni</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">150+</div>
                    <div className="text-sm text-slate-400">Top Companies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">30+</div>
                    <div className="text-sm text-slate-400">Countries</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}