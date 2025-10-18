"use client"

import { useEffect, useState, useCallback } from 'react'

interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
  navigation: number // Navigation timing
}

interface PerformanceMonitorProps {
  onMetrics?: (metrics: PerformanceMetrics) => void
  enabled?: boolean
  reportInterval?: number
}

export function PerformanceMonitor({ 
  onMetrics, 
  enabled = true,
  reportInterval = 30000 // 30 seconds
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  // Check if Performance API is supported
  useEffect(() => {
    setIsSupported(
      typeof window !== 'undefined' && 
      'performance' in window && 
      'PerformanceObserver' in window
    )
  }, [])

  // Collect Core Web Vitals
  const collectCoreWebVitals = useCallback(() => {
    if (!enabled || !isSupported) return

    const collectedMetrics: Partial<PerformanceMetrics> = {}

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        collectedMetrics.fcp = fcpEntry.startTime
      }
    })
    fcpObserver.observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      if (lastEntry) {
        collectedMetrics.lcp = lastEntry.startTime
      }
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        collectedMetrics.fid = entry.processingStart - entry.startTime
      })
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      collectedMetrics.cls = clsValue
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

      // Navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        collectedMetrics.ttfb = navigation.responseStart - navigation.requestStart
        collectedMetrics.navigation = navigation.loadEventEnd - (navigation as any).navigationStart || 0
      }

    // Clean up observers after a delay
    setTimeout(() => {
      fcpObserver.disconnect()
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
    }, 10000)

    return collectedMetrics
  }, [enabled, isSupported])

  // Collect metrics periodically
  useEffect(() => {
    if (!enabled || !isSupported) return

    const collectMetrics = () => {
      const newMetrics = collectCoreWebVitals()
      if (newMetrics && Object.keys(newMetrics).length > 0) {
        const fullMetrics = newMetrics as PerformanceMetrics
        setMetrics(fullMetrics)
        onMetrics?.(fullMetrics)
      }
    }

    // Initial collection
    collectMetrics()

    // Periodic collection
    const interval = setInterval(collectMetrics, reportInterval)

    return () => clearInterval(interval)
  }, [enabled, isSupported, collectCoreWebVitals, onMetrics, reportInterval])

  // Memory usage monitoring
  const [memoryUsage, setMemoryUsage] = useState<any>(null)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('memory' in performance)) return

    const updateMemoryUsage = () => {
      const memory = (performance as any).memory
      if (memory) {
        setMemoryUsage({
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) // MB
        })
      }
    }

    updateMemoryUsage()
    const interval = setInterval(updateMemoryUsage, 5000) // Every 5 seconds

    return () => clearInterval(interval)
  }, [enabled])

  // Resource timing analysis
  const [resourceMetrics, setResourceMetrics] = useState<any>(null)

  useEffect(() => {
    if (!enabled || !isSupported) return

    const analyzeResources = () => {
      const resources = performance.getEntriesByType('resource')
      const analysis = {
        total: resources.length,
        totalSize: resources.reduce((sum, resource: any) => sum + (resource.transferSize || 0), 0),
        slowResources: resources.filter((resource: any) => resource.duration > 1000).length,
        failedResources: resources.filter((resource: any) => resource.transferSize === 0).length
      }

      setResourceMetrics(analysis)
    }

    // Analyze after page load
    const timeout = setTimeout(analyzeResources, 3000)
    return () => clearTimeout(timeout)
  }, [enabled, isSupported])

  // Performance score calculation
  const calculatePerformanceScore = useCallback((metrics: PerformanceMetrics): number => {
    let score = 100

    // FCP scoring (0-2.5s is good)
    if (metrics.fcp > 2500) score -= 20
    else if (metrics.fcp > 1800) score -= 10

    // LCP scoring (0-2.5s is good)
    if (metrics.lcp > 4000) score -= 25
    else if (metrics.lcp > 2500) score -= 15

    // FID scoring (0-100ms is good)
    if (metrics.fid > 300) score -= 20
    else if (metrics.fid > 100) score -= 10

    // CLS scoring (0-0.1 is good)
    if (metrics.cls > 0.25) score -= 20
    else if (metrics.cls > 0.1) score -= 10

    // TTFB scoring (0-800ms is good)
    if (metrics.ttfb > 1800) score -= 15
    else if (metrics.ttfb > 800) score -= 5

    return Math.max(0, score)
  }, [])

  const performanceScore = metrics ? calculatePerformanceScore(metrics) : null

  if (!enabled) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800">Performance</h3>
        <div className={`w-3 h-3 rounded-full ${isSupported ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
      
      {metrics && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Score:</span>
            <span className={`font-medium ${
              performanceScore! >= 90 ? 'text-green-600' : 
              performanceScore! >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {performanceScore}/100
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>FCP:</span>
            <span>{Math.round(metrics.fcp)}ms</span>
          </div>
          
          <div className="flex justify-between">
            <span>LCP:</span>
            <span>{Math.round(metrics.lcp)}ms</span>
          </div>
          
          <div className="flex justify-between">
            <span>FID:</span>
            <span>{Math.round(metrics.fid)}ms</span>
          </div>
          
          <div className="flex justify-between">
            <span>CLS:</span>
            <span>{metrics.cls.toFixed(3)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>TTFB:</span>
            <span>{Math.round(metrics.ttfb)}ms</span>
          </div>
        </div>
      )}

      {memoryUsage && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Memory Usage</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Used:</span>
              <span>{memoryUsage.used}MB</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span>{memoryUsage.total}MB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(memoryUsage.used / memoryUsage.limit) * 100}%` } as React.CSSProperties}
              />
            </div>
          </div>
        </div>
      )}

      {resourceMetrics && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Resources</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Total:</span>
              <span>{resourceMetrics.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span>{Math.round(resourceMetrics.totalSize / 1024)}KB</span>
            </div>
            <div className="flex justify-between">
              <span>Slow:</span>
              <span className={resourceMetrics.slowResources > 0 ? 'text-yellow-600' : 'text-green-600'}>
                {resourceMetrics.slowResources}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Failed:</span>
              <span className={resourceMetrics.failedResources > 0 ? 'text-red-600' : 'text-green-600'}>
                {resourceMetrics.failedResources}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for performance monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)
  }, [])

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
  }, [])

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    PerformanceMonitor: () => (
      <PerformanceMonitor 
        enabled={isMonitoring}
        onMetrics={setMetrics}
      />
    )
  }
}