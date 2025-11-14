"use client"

import { useEffect } from 'react'
import { initializePerformanceOptimizations } from '@/utils/prefetch'
import { optimizeCriticalPath } from '@/utils/performance-optimizations'

export function PerformanceOptimizations() {
  useEffect(() => {
    // Initialize performance optimizations
    initializePerformanceOptimizations()
    optimizeCriticalPath()
  }, [])

  return null
}
