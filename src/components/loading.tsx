"use client"

import { motion } from 'framer-motion'
import { Loader2, Sparkles } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
  className?: string
}

export function Loading({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false,
  className = ''
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative">
        {/* Main spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={sizeClasses[size]}
        >
          <Loader2 className="h-full w-full text-blue-500" />
        </motion.div>
        
        {/* Sparkle effect */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="h-3 w-3 text-yellow-400" />
        </motion.div>
      </div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-gray-600 font-medium ${textSizeClasses[size]}`}
        >
          {text}
        </motion.p>
      )}
      
      {/* Progress dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
            className="w-2 h-2 bg-blue-500 rounded-full"
          />
        ))}
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {content}
        </div>
      </div>
    )
  }

  return content
}

// Skeleton loading components
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-3 border-b">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded flex-1"></div>
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 border-b border-gray-100">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-200 rounded flex-1"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonList({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="rounded bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
