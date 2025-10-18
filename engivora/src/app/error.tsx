"use client"

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  ArrowLeft,
  Bug,
  Wifi,
  Server
} from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-red-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-3xl opacity-20"
              style={{ width: '300px', height: '300px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            />
            <div className="relative z-10">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-4"
              >
                500
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex items-center justify-center gap-4 mb-6"
              >
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
                <h1 className="text-3xl font-bold text-white">
                  Server Error
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
            Oops! Something went wrong on our end.
          </p>
          <p className="text-lg text-gray-400 mb-6">
            Our team has been notified and is working to fix this issue.
          </p>
          
          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Bug className="h-4 w-4 text-red-400" />
                <span className="text-red-400 font-semibold">Development Error Details:</span>
              </div>
              <pre className="text-xs text-red-300 overflow-auto">
                {error.message}
              </pre>
              {error.digest && (
                <p className="text-xs text-red-400 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </motion.button>
          
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
            onClick={() => window.location.href = '/'}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Home className="h-5 w-5" />
            Go Home
          </motion.button>
        </motion.div>

        {/* Troubleshooting Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-bold text-white mb-4">
            Troubleshooting Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3">
              <RefreshCw className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-1">Refresh the page</h3>
                <p className="text-sm text-gray-300">
                  Sometimes a simple refresh can resolve temporary issues.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Wifi className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-1">Check your connection</h3>
                <p className="text-sm text-gray-300">
                  Ensure you have a stable internet connection.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Server className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-1">Server maintenance</h3>
                <p className="text-sm text-gray-300">
                  We might be performing scheduled maintenance.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Bug className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-1">Report the issue</h3>
                <p className="text-sm text-gray-300">
                  Contact support if the problem persists.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Support Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-6 text-gray-400"
        >
          <p className="text-sm">
            Still having trouble? Contact our{' '}
            <a href="/support" className="text-orange-400 hover:text-orange-300 underline">
              support team
            </a>
            {' '}or check our{' '}
            <a href="/help" className="text-orange-400 hover:text-orange-300 underline">
              help center
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
