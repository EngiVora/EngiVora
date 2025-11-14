"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function AutonomousDeliveryDronePage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/" className="text-sky-400 hover:text-sky-300">Home</Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-300">Autonomous Delivery Drone</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Project Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1600&auto=format&fit=crop"
              alt="Autonomous Delivery Drone"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Project Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold mb-4">Autonomous Delivery Drone</h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                A cutting-edge project focusing on last-mile delivery solutions using UAV technology. 
                This autonomous drone system is designed to revolutionize package delivery in urban environments 
                by providing efficient, cost-effective, and environmentally friendly transportation.
              </p>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-400 mb-1">Team Size</h3>
                <p className="text-xl font-bold">3 Members</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-400 mb-1">Duration</h3>
                <p className="text-xl font-bold">6 Months</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-400 mb-1">Technology</h3>
                <p className="text-xl font-bold">IoT, AI</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-400 mb-1">Status</h3>
                <p className="text-xl font-bold text-green-400">Active</p>
              </div>
            </div>

            {/* Technologies Used */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {["Python", "OpenCV", "TensorFlow", "ROS", "Arduino", "GPS"].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-sky-600/20 text-sky-400 rounded-full text-sm font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Description */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Project Overview</h3>
              <div className="space-y-4 text-slate-300">
                <p>
                  The Autonomous Delivery Drone project aims to create a fully automated delivery system 
                  capable of navigating urban environments safely and efficiently. The drone incorporates 
                  advanced computer vision and machine learning algorithms for obstacle detection and path planning.
                </p>
                <p>
                  Key features include real-time GPS tracking, weather-resistant design, secure package 
                  compartments, and integration with existing delivery management systems.
                </p>
              </div>
            </div>

            {/* Contact Team */}
            <div className="bg-slate-800/30 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3">Team Members</h3>
              <div className="space-y-2">
                <p className="text-slate-300">• <strong>Alex Chen</strong> - Lead Developer</p>
                <p className="text-slate-300">• <strong>Sarah Rodriguez</strong> - Hardware Engineer</p>
                <p className="text-slate-300">• <strong>Michael Park</strong> - AI Specialist</p>
              </div>
              <button className="mt-4 bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg transition-colors">
                Contact Team
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}