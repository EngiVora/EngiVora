"use client"

import { useEffect, useState } from 'react'

interface PerformanceSummaryProps {
  showDetails?: boolean
  className?: string
}

export function PerformanceSummary({ showDetails = false, className = '' }: PerformanceSummaryProps) {
  const [metrics, setMetrics] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const resources = performance.getEntriesByType('resource')
      
      const totalSize = resources.reduce((sum: number, resource: any) => sum + (resource.transferSize || 0), 0)
      const loadTime = navigation ? navigation.loadEventEnd - navigation.fetchStart : 0
      
      setMetrics({
        loadTime: Math.round(loadTime),
        totalSize: Math.round(totalSize / 1024), // KB
        resourceCount: resources.length,
        domContentLoaded: navigation ? Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart) : 0,
        firstPaint: navigation ? Math.round(navigation.loadEventEnd - navigation.fetchStart) : 0
      })
    }

    // Collect metrics after page load
    const timeout = setTimeout(collectMetrics, 1000)
    
    // Show component after a delay
    const showTimeout = setTimeout(() => setIsVisible(true), 2000)

    return () => {
      clearTimeout(timeout)
      clearTimeout(showTimeout)
    }
  }, [])

  if (!metrics || !isVisible || !showDetails) return null

  const getPerformanceGrade = (loadTime: number) => {
    if (loadTime < 1000) return { grade: 'A', color: 'text-green-600' }
    if (loadTime < 2000) return { grade: 'B', color: 'text-yellow-600' }
    if (loadTime < 3000) return { grade: 'C', color: 'text-orange-600' }
    return { grade: 'D', color: 'text-red-600' }
  }

  const grade = getPerformanceGrade(metrics.loadTime)

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Performance</h3>
        <div className={`text-2xl font-bold ${grade.color}`}>
          {grade.grade}
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Load Time:</span>
          <span className="font-medium">{metrics.loadTime}ms</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Total Size:</span>
          <span className="font-medium">{metrics.totalSize}KB</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Resources:</span>
          <span className="font-medium">{metrics.resourceCount}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">DOM Ready:</span>
          <span className="font-medium">{metrics.domContentLoaded}ms</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          {grade.grade === 'A' && '🚀 Excellent performance!'}
          {grade.grade === 'B' && '👍 Good performance'}
          {grade.grade === 'C' && '⚠️ Room for improvement'}
          {grade.grade === 'D' && '🐌 Performance needs optimization'}
        </div>
      </div>
    </div>
  )
}

// Simple performance indicator
export function PerformanceIndicator() {
  const [loadTime, setLoadTime] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const measureLoadTime = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        const time = Math.round(navigation.loadEventEnd - navigation.fetchStart)
        setLoadTime(time)
      }
    }

    const timeout = setTimeout(measureLoadTime, 1000)
    return () => clearTimeout(timeout)
  }, [])

  if (!loadTime) return null

  const getColor = (time: number) => {
    if (time < 1000) return 'bg-green-500'
    if (time < 2000) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getColor(loadTime)}`}>
        {loadTime}ms
      </div>
    </div>
  )
}
