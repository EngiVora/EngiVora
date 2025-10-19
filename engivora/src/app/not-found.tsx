"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  ArrowLeft, 
  Search, 
  AlertCircle,
  RefreshCw,
  Users,
  Briefcase,
  BookOpen,
  Calendar,
  Tag,
  Wrench,
  Cpu,
  Code,
  Zap
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'

export default function NotFound() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)
  const [isNavigating, setIsNavigating] = useState(false)

  // Auto-redirect after 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const quickLinks = [
    { href: '/', icon: Home, label: 'Home', description: 'Back to homepage' },
    { href: '/jobs', icon: Briefcase, label: 'Jobs', description: 'Engineering job opportunities' },
    { href: '/blogs', icon: BookOpen, label: 'Blogs', description: 'Tech articles & guides' },
    { href: '/exams', icon: Users, label: 'Exams', description: 'Engineering exam prep' },
    { href: '/events', icon: Calendar, label: 'Events', description: 'Tech events & workshops' },
    { href: '/discounts', icon: Tag, label: 'Discounts', description: 'Student tech discounts' },
  ]

  const engineeringIcons = [Wrench, Cpu, Code, Zap]

  const handleGoBack = () => {
    if (isNavigating) return
    
    setIsNavigating(true)
    try {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back()
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Error going back:', error)
      router.push('/')
    } finally {
      setTimeout(() => setIsNavigating(false), 1000)
    }
  }

  const handleGoHome = () => {
    if (isNavigating) return
    
    setIsNavigating(true)
    try {
      router.push('/')
    } catch (error) {
      console.error('Error navigating home:', error)
      window.location.href = '/'
    } finally {
      setTimeout(() => setIsNavigating(false), 1000)
    }
  }

  const handleSearch = () => {
    if (isNavigating) return
    
    setIsNavigating(true)
    try {
      // Try to navigate to search page, fallback to home if search doesn't exist
      router.push('/search')
    } catch (error) {
      console.error('Error navigating to search:', error)
      // Fallback: redirect to home page
      router.push('/')
    } finally {
      setTimeout(() => setIsNavigating(false), 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-noise opacity-30"></div>
      
      {/* Floating Engineering Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {engineeringIcons.map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute text-slate-600/20"
            style={{
              left: `${20 + index * 20}%`,
              top: `${30 + index * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon size={40 + index * 10} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl w-full text-center">
          {/* Header with Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Logo size="lg" />
              <span className="text-2xl font-bold gradient-text">Engivora</span>
            </div>
          </motion.div>

          {/* 404 Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-full blur-3xl opacity-20"
                style={{ width: '400px', height: '400px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              />
              <div className="relative z-10">
                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-4 neon-text"
                >
                  404
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex items-center justify-center gap-4 mb-6"
                >
                  <AlertCircle className="h-8 w-8 text-yellow-400" />
                  <h1 className="text-3xl font-bold text-white">
                    Page Not Found
                  </h1>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <p className="text-xl text-slate-300 mb-4">
              Oops! The page you&apos;re looking for seems to have vanished into the digital void.
            </p>
            <p className="text-lg text-slate-400 mb-6">
              Don&apos;t worry, even the best engineers sometimes take a wrong turn in the code!
            </p>
            
            {/* Auto-redirect countdown */}
            {countdown > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel border border-blue-500/30 rounded-lg p-4 mb-6 max-w-md mx-auto"
              >
                <div className="flex items-center justify-center gap-3">
                  <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />
                  <span className="text-blue-300">
                    Redirecting to home in <span className="font-bold text-blue-400">{countdown}</span> seconds
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.button
              whileHover={{ scale: isNavigating ? 1 : 1.05 }}
              whileTap={{ scale: isNavigating ? 1 : 0.95 }}
              onClick={handleGoBack}
              disabled={isNavigating}
              className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25 ${
                isNavigating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ArrowLeft className={`h-5 w-5 ${isNavigating ? 'animate-pulse' : ''}`} />
              {isNavigating ? 'Navigating...' : 'Go Back'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: isNavigating ? 1 : 1.05 }}
              whileTap={{ scale: isNavigating ? 1 : 0.95 }}
              onClick={handleGoHome}
              disabled={isNavigating}
              className={`bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/25 ${
                isNavigating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Home className={`h-5 w-5 ${isNavigating ? 'animate-pulse' : ''}`} />
              {isNavigating ? 'Navigating...' : 'Go Home'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: isNavigating ? 1 : 1.05 }}
              whileTap={{ scale: isNavigating ? 1 : 0.95 }}
              onClick={handleSearch}
              disabled={isNavigating}
              className={`bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 ${
                isNavigating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Search className={`h-5 w-5 ${isNavigating ? 'animate-pulse' : ''}`} />
              {isNavigating ? 'Navigating...' : 'Search'}
            </motion.button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="glass-panel rounded-2xl p-6 border border-slate-700/50"
          >
            <h2 className="text-2xl font-bold text-white mb-6 gradient-text">
              Popular Pages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass-panel hover:bg-slate-800/40 border border-slate-600/30 hover:border-blue-500/50 rounded-lg p-4 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <link.icon className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    <span className="font-semibold text-white group-hover:text-blue-100 transition-colors">
                      {link.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                    {link.description}
                  </p>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-8 text-slate-400"
          >
            <p className="text-sm">
              Need help? Contact our support team or check our{' '}
              <a href="/help" className="text-blue-400 hover:text-blue-300 underline transition-colors">
                help center
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
