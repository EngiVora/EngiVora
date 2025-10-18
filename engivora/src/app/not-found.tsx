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
  Tag
} from 'lucide-react'

export default function NotFound() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Auto-redirect after 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRedirecting(true)
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
    { href: '/jobs', icon: Briefcase, label: 'Jobs', description: 'Find job opportunities' },
    { href: '/blogs', icon: BookOpen, label: 'Blogs', description: 'Read latest articles' },
    { href: '/exams', icon: Users, label: 'Exams', description: 'Exam preparation' },
    { href: '/events', icon: Calendar, label: 'Events', description: 'Upcoming events' },
    { href: '/discounts', icon: Tag, label: 'Discounts', description: 'Student discounts' },
  ]

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  const handleSearch = () => {
    router.push('/search')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
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
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20"
              style={{ width: '400px', height: '400px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            />
            <div className="relative z-10">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4"
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
          <p className="text-xl text-gray-300 mb-4">
            Oops! The page you&apos;re looking for seems to have vanished into the digital void.
          </p>
          <p className="text-lg text-gray-400 mb-6">
            Don&apos;t worry, even the best explorers sometimes take a wrong turn!
          </p>
          
          {/* Auto-redirect countdown */}
          {countdown > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6 max-w-md mx-auto"
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Home className="h-5 w-5" />
            Go Home
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Search className="h-5 w-5" />
            Search
          </motion.button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
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
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-4 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <link.icon className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <span className="font-semibold text-white group-hover:text-blue-100 transition-colors">
                    {link.label}
                  </span>
                </div>
                <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
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
          className="mt-8 text-gray-400"
        >
          <p className="text-sm">
            Need help? Contact our support team or check our{' '}
            <a href="/help" className="text-blue-400 hover:text-blue-300 underline">
              help center
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
