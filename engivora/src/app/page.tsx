"use client"

import { motion } from "framer-motion"
import { MetricsStrip } from "@/components/home/metrics-strip"
import { Testimonials } from "@/components/home/testimonials"
import { FAQ } from "@/components/home/faq"
import { CtaBanner } from "@/components/home/cta-banner"
import { TechCard } from "@/components/ui/tech-card"
import { ProjectCard } from "@/components/ui/project-card"
import { EventCard } from "@/components/ui/event-card"

export default function HomePage() {
  return (
    <div className="bg-slate-950 text-slate-100 aurora-bg">
      {/* Hero */}
      <section className="relative min-h-[640px] overflow-hidden grid-noise animated-grid">
        <div className="absolute inset-0 -z-10" />
        <div className="floating-orb w-[280px] h-[280px] -z-10 left-10 top-20 rounded-full" />
        <div className="floating-orb alt w-[340px] h-[340px] -z-10 right-10 top-28 rounded-full" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl neon-text"
            >
              <span className="block">Your Engineering Journey,</span>
              <span className="block bg-gradient-to-r from-teal-400 to-sky-500 bg-clip-text text-transparent">Simplified & Supercharged.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="mt-6 text-xl text-slate-400"
            >
              Stay ahead with the latest updates, resources, and opportunities tailored for engineering students. Your central hub for success is here.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="mt-12 flex justify-center gap-4"
          >
            <a href="#" className="flex items-center justify-center rounded-full bg-sky-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-sky-500/20 transition-transform hover:scale-105 neon-ring">Get Started Now</a>
            <a href="#" className="flex items-center justify-center rounded-full bg-slate-800 px-8 py-4 text-base font-semibold text-slate-100 ring-1 ring-inset ring-slate-700 hover:bg-slate-700 transition-transform hover:scale-105">Explore Features</a>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-sky-700/90 py-4 overflow-hidden glass-panel border-0 rounded-none">
          <div className="ticker flex whitespace-nowrap">
            <div className="inline-flex items-center gap-12">
              <span className="text-white font-medium text-lg flex items-center gap-2">NEW: GATE 2025 Registration Open</span>
              <span className="text-white/70 font-medium text-lg">|</span>
              <span className="text-white font-medium text-lg flex items-center gap-2">Internship at TechCorp | Deadline: 25th Dec</span>
              <span className="text-white/70 font-medium text-lg">|</span>
              <span className="text-white font-medium text-lg flex items-center gap-2">50% OFF on Engineering Textbooks</span>
              <span className="text-white/70 font-medium text-lg">|</span>
              <span className="text-white font-medium text-lg flex items-center gap-2">Webinar: AI in Modern Engineering</span>
              <span className="text-white/70 font-medium text-lg">|</span>
              <span className="text-white font-medium text-lg flex items-center gap-2">NEW: GATE 2025 Registration Open</span>
              <span className="text-white/70 font-medium text-lg">|</span>
              <span className="text-white font-medium text-lg flex items-center gap-2">Internship at TechCorp | Deadline: 25th Dec</span>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics & Logos */}
      <MetricsStrip />

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-extrabold tracking-tight">Explore Engivora&apos;s Features</h3>
            <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">Everything you need in one place. From exam schedules to career opportunities, we&apos;ve got you covered.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <TechCard
              title="Exam Updates"
              description="Never miss a deadline. Get timely notifications for major exams."
              cta="See Updates →"
              imageUrl="/vercel.svg"
              delay={0}
              icon={<svg className="h-10 w-10 text-sky-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16m0 0h12"></path><path d="M12 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6v12Z"></path><path d="M9 14h.01"></path></svg>}
            />
            <TechCard
              title="Jobs & Internships"
              description="Curated job postings and internships from top companies."
              cta="Find Opportunities →"
              imageUrl="/globe.svg"
              delay={0.05}
              icon={<svg className="h-10 w-10 text-sky-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>}
            />
            <TechCard
              title="Blogs"
              description="Insights on cutting-edge tech, career advice, and student life."
              cta="Read Articles →"
              imageUrl="/file.svg"
              delay={0.1}
              icon={<svg className="h-10 w-10 text-sky-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>}
            />
            <TechCard
              title="Discounts"
              description="Exclusive deals on textbooks, software, and student tools."
              cta="Get Deals →"
              imageUrl="/window.svg"
              delay={0.15}
              icon={<svg className="h-10 w-10 text-sky-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>}
            />
            <TechCard
              title="Work Hub"
              description="Collaborate on projects and connect with fellow students."
              cta="Enter the Hub →"
              imageUrl="/logo.png"
              delay={0.2}
              icon={<svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3.19a2 2 0 0 1 1.74.85l.23.33a2 2 0 0 0 1.74.82h3.18a2 2 0 0 0 1.74-.85l.23-.33a2 2 0 0 1 1.74-.82H21a2 2 0 0 1 2 2v3Z"></path></svg>}
            />
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-extrabold tracking-tight">Featured Student Projects</h3>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">Innovative projects by students from the Engivora community.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <ProjectCard
              title="Autonomous Delivery Drone"
              description="A project focusing on last-mile delivery solutions using UAV technology."
              imageUrl="https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1600&auto=format&fit=crop"
              collaboratorsLabel="+2 collaborators"
            />
            <ProjectCard
              title="Smart Water Management System"
              description="An IoT-based system for efficient water usage monitoring and control."
              imageUrl="https://images.unsplash.com/photo-1558478551-1a378f63328e?q=80&w=1600&auto=format&fit=crop"
            />
            <ProjectCard
              title="Submit Your Project"
              description="Get your work featured and recognized by the community."
              imageUrl="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-1">
              <div className="text-left">
                <h3 className="text-4xl font-extrabold tracking-tight">Upcoming Events</h3>
                <p className="mt-4 text-lg text-slate-400">Don&apos;t miss out on these workshops, webinars, and competitions.</p>
                <a href="#" className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-800 px-6 py-3 text-base font-semibold text-slate-100 ring-1 ring-inset ring-slate-700 hover:bg-slate-700 transition-transform hover:scale-105 neon-ring">View All Events</a>
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <EventCard day="15" mon="JAN" tag="Webinar" title="Intro to Quantum Computing" tagColor="bg-green-100 text-green-800" />
              <EventCard day="22" mon="JAN" tag="Workshop" title="Robotics & Automation" tagColor="bg-yellow-100 text-yellow-800" />
              <EventCard day="05" mon="FEB" tag="Competition" title="National Hackathon 2025" tagColor="bg-red-100 text-red-800" />
              <EventCard day="18" mon="FEB" tag="Meetup" title="Alumni Networking Night" tagColor="bg-purple-100 text-purple-800" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Poll */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-sky-800 to-sky-700 rounded-2xl shadow-xl p-8 md:p-12 lg:p-16 text-white neon-ring">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Quick Poll</h3>
                <p className="mt-4 text-lg text-sky-200">Help us understand you better! Your opinion matters.</p>
              </div>
              <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm glass-panel">
                <h4 className="font-bold text-xl mb-4">What&apos;s your biggest challenge as an engineering student?</h4>
                <form className="space-y-4">
                  {[
                    "Time Management",
                    "Tough Coursework",
                    "Finding Internships",
                    "Other",
                  ].map((label) => (
                    <label key={label} className="flex items-center p-4 rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer transition-colors">
                      <input type="radio" name="poll" className="h-5 w-5 text-teal-400 border-transparent rounded-full focus:ring-2 focus:ring-teal-400" />
                      <span className="ml-4 font-medium">{label}</span>
                    </label>
                  ))}
                  <button type="submit" className="w-full flex items-center justify-center rounded-full bg-teal-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 mt-6 neon-ring">Vote</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* CTA */}
      <CtaBanner />

    </div>
  )
}
