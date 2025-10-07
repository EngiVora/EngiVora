"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  ArrowRight,
  MapPin,
  Phone,
  Sparkles,
  GraduationCap,
  Briefcase,
  BookOpen,
  ShoppingBag
} from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const quickLinks = [
  { name: "About Us", href: "/about", icon: GraduationCap },
  { name: "Contact", href: "/contact", icon: Phone },
  { name: "Privacy Policy", href: "/privacy", icon: BookOpen },
  { name: "Terms of Service", href: "/terms", icon: Briefcase },
]

const services = [
  { name: "Exam Updates", href: "/exams", icon: BookOpen, description: "Latest exam notifications" },
  { name: "Job Opportunities", href: "/jobs", icon: Briefcase, description: "Career opportunities" },
  { name: "Career Counselling", href: "/counselling", icon: GraduationCap, description: "Expert guidance" },
  { name: "Student Discounts", href: "/discounts", icon: ShoppingBag, description: "Exclusive offers" },
]

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook, color: "hover:text-blue-400" },
  { name: "Twitter", href: "#", icon: Twitter, color: "hover:text-sky-400" },
  { name: "Instagram", href: "#", icon: Instagram, color: "hover:text-pink-400" },
  { name: "LinkedIn", href: "#", icon: Linkedin, color: "hover:text-blue-500" },
  { name: "YouTube", href: "#", icon: Youtube, color: "hover:text-red-400" },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log("Newsletter signup:", email)
    setIsSuccess(true)
    setEmail("")
    
    setTimeout(() => {
      setIsSuccess(false)
      setIsSubmitting(false)
    }, 3000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-t border-slate-800/50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-sky-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* Brand Section - Enhanced */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-4 space-y-6"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Logo size="lg" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-sky-400/20 rounded-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent">
                  Engivora
                </span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-5 w-5 text-sky-400" />
                </motion.div>
              </div>
            </div>
            
            <motion.p 
              variants={itemVariants}
              className="text-slate-300/80 text-lg leading-relaxed max-w-md"
            >
              Your ultimate engineering companion. Empowering students with exam updates, 
              career opportunities, expert guidance, and exclusive benefits.
            </motion.p>

            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-center space-x-3 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer group">
                <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm">Engineering Students Nationwide</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer group">
                <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm">+1 (555) 123-ENGI</span>
              </div>
            </motion.div>

            {/* Social Links - Enhanced */}
            <motion.div variants={itemVariants} className="flex space-x-4 pt-4">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.name}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <Link
                    href={social.href}
                    className={`flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-400 transition-all duration-300 ${social.color} hover:border-slate-600 hover:shadow-lg hover:shadow-sky-500/10`}
                  >
                    <social.icon className="h-4 w-4" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Links - Enhanced */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="font-bold text-xl mb-6 text-white flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-sky-400" />
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <motion.li 
                  key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center space-x-3 text-slate-300/80 hover:text-sky-400 transition-all duration-300 group text-lg"
                  >
                    <link.icon className="h-4 w-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
                    <span>{link.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services - Enhanced */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h3 className="font-bold text-xl mb-6 text-white flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-teal-400" />
              <span>Our Services</span>
            </h3>
            <div className="grid gap-4">
              {services.map((service) => (
                <motion.div
                  key={service.name}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Link
                    href={service.href}
                    className="flex items-start space-x-3 p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/30 hover:border-sky-500/30 transition-all duration-300 backdrop-blur-sm"
                  >
                    <service.icon className="h-5 w-5 text-sky-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-slate-200 font-medium group-hover:text-sky-300 transition-colors">
                        {service.name}
                      </div>
                      <div className="text-slate-400 text-sm mt-1">
                        {service.description}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Newsletter - Enhanced */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h3 className="font-bold text-xl mb-6 text-white flex items-center space-x-2">
              <Mail className="h-5 w-5 text-purple-400" />
              <span>Stay Updated</span>
            </h3>
            
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Sparkles className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  </motion.div>
                  <h4 className="text-green-400 font-bold text-lg mb-2">
                    Welcome Aboard! 🎉
                  </h4>
                  <p className="text-slate-300 text-sm">
                    You&apos;re now part of our engineering community!
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-slate-300/80 text-lg mb-6 leading-relaxed">
                    Get the latest exam updates, job alerts, and exclusive student offers delivered to your inbox.
                  </p>
                  
                  <form onSubmit={handleNewsletterSignup} className="space-y-4">
                    <motion.div 
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm text-slate-100 placeholder:text-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-sky-500/30 border-0 text-base"
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                        ) : (
                          <>
                            Subscribe Now
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                  
                  <p className="text-slate-400 text-xs mt-4 text-center">
                    No spam ever. Unsubscribe anytime.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Bottom Section - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-slate-800/50 mt-12 pt-8 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0"
        >
          <motion.p 
            className="text-slate-400 text-lg flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <span>© 2025 Engivora.</span>
            <span className="text-sky-400">All rights reserved.</span>
          </motion.p>
          
          <div className="flex items-center space-x-6">
            <motion.div whileHover={{ y: -2 }}>
              <Link
                href="/privacy"
                className="text-slate-400 hover:text-sky-400 transition-colors text-lg font-medium"
              >
                Privacy Policy
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link
                href="/terms"
                className="text-slate-400 hover:text-sky-400 transition-colors text-lg font-medium"
              >
                Terms of Service
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-sky-400/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </footer>
  )
}
