// Performance optimization utilities

// Debounce function for input handling
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }

    const callNow = immediate && !timeout

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func(...args)
  }
}

// Throttle function for scroll/resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Request animation frame throttle
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null

  return function executedFunction(this: any, ...args: Parameters<T>) {
    if (rafId !== null) return

    rafId = requestAnimationFrame(() => {
      func.apply(this, args)
      rafId = null
    })
  }
}

// Batch DOM updates
export class DOMBatcher {
  private updates: (() => void)[] = []
  private rafId: number | null = null

  add(update: () => void) {
    this.updates.push(update)
    this.schedule()
  }

  private schedule() {
    if (this.rafId !== null) return

    this.rafId = requestAnimationFrame(() => {
      this.flush()
    })
  }

  private flush() {
    const updates = this.updates.splice(0)
    updates.forEach(update => update())
    this.rafId = null
  }
}

// Memory-efficient event listener management
export class EventManager {
  private listeners = new Map<EventTarget, Map<string, EventListener[]>>()

  add(element: EventTarget, event: string, listener: EventListener, options?: AddEventListenerOptions) {
    if (!this.listeners.has(element)) {
      this.listeners.set(element, new Map())
    }

    const elementListeners = this.listeners.get(element)!
    if (!elementListeners.has(event)) {
      elementListeners.set(event, [])
    }

    elementListeners.get(event)!.push(listener)
    element.addEventListener(event, listener, options)
  }

  remove(element: EventTarget, event: string, listener?: EventListener) {
    const elementListeners = this.listeners.get(element)
    if (!elementListeners) return

    const eventListeners = elementListeners.get(event)
    if (!eventListeners) return

    if (listener) {
      const index = eventListeners.indexOf(listener)
      if (index > -1) {
        eventListeners.splice(index, 1)
        element.removeEventListener(event, listener)
      }
    } else {
      // Remove all listeners for this event
      eventListeners.forEach(l => element.removeEventListener(event, l))
      eventListeners.length = 0
    }

    if (eventListeners.length === 0) {
      elementListeners.delete(event)
    }

    if (elementListeners.size === 0) {
      this.listeners.delete(element)
    }
  }

  removeAll() {
    for (const [element, elementListeners] of this.listeners) {
      for (const [event, listeners] of elementListeners) {
        listeners.forEach(listener => element.removeEventListener(event, listener))
      }
    }
    this.listeners.clear()
  }
}

// Virtual scrolling utilities
export interface VirtualScrollOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export class VirtualScrollCalculator {
  constructor(private options: VirtualScrollOptions) {}

  getVisibleRange(scrollTop: number) {
    const { itemHeight, containerHeight, overscan = 5 } = this.options
    
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      this.options.containerHeight / itemHeight - 1
    )

    return {
      startIndex: Math.max(0, startIndex - overscan),
      endIndex: endIndex + overscan,
      offsetY: startIndex * itemHeight
    }
  }
}

// Image lazy loading with intersection observer
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null
  private images = new Set<HTMLImageElement>()

  constructor(options?: IntersectionObserverInit) {
    // Check if IntersectionObserver is available (client-side only)
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              this.loadImage(img)
              this.observer?.unobserve(img)
            }
          })
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
          ...options
        }
      )
    }
  }

  observe(img: HTMLImageElement) {
    this.images.add(img)
    this.observer?.observe(img)
  }

  unobserve(img: HTMLImageElement) {
    this.images.delete(img)
    this.observer?.unobserve(img)
  }

  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src
    if (src) {
      img.src = src
      img.classList.remove('lazy')
      img.classList.add('loaded')
    }
  }

  disconnect() {
    this.observer?.disconnect()
    this.images.clear()
  }
}

// Resource preloader
export class ResourcePreloader {
  private preloaded = new Set<string>()

  async preloadImage(src: string): Promise<HTMLImageElement> {
    if (this.preloaded.has(src)) {
      return Promise.resolve(new Image())
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.preloaded.add(src)
        resolve(img)
      }
      img.onerror = reject
      img.src = src
    })
  }

  async preloadCSS(href: string): Promise<void> {
    if (this.preloaded.has(href)) return

    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = href
      link.onload = () => {
        this.preloaded.add(href)
        resolve()
      }
      link.onerror = reject
      document.head.appendChild(link)
    })
  }

  async preloadScript(src: string): Promise<void> {
    if (this.preloaded.has(src)) return

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        this.preloaded.add(src)
        resolve()
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
}

// Performance timing utilities
export class PerformanceTimer {
  private timers = new Map<string, number>()

  start(label: string) {
    this.timers.set(label, performance.now())
  }

  end(label: string): number {
    const startTime = this.timers.get(label)
    if (startTime === undefined) {
      console.warn(`Timer '${label}' was not started`)
      return 0
    }

    const duration = performance.now() - startTime
    this.timers.delete(label)
    return duration
  }

  measure<T>(label: string, fn: () => T): T {
    this.start(label)
    const result = fn()
    const duration = this.end(label)
    console.log(`${label}: ${duration.toFixed(2)}ms`)
    return result
  }

  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label)
    const result = await fn()
    const duration = this.end(label)
    console.log(`${label}: ${duration.toFixed(2)}ms`)
    return result
  }
}

// Bundle size analyzer
export function analyzeBundleSize() {
  if (typeof window === 'undefined') return null

  const scripts = Array.from(document.scripts)
  const stylesheets = Array.from(document.styleSheets)
  
  let totalSize = 0
  const resources: Array<{ name: string; size: number; type: string }> = []

  scripts.forEach(script => {
    if (script.src) {
      const size = script.src.length // Approximate
      totalSize += size
      resources.push({ name: script.src, size, type: 'script' })
    }
  })

  stylesheets.forEach(sheet => {
    if (sheet.href) {
      const size = sheet.href.length // Approximate
      totalSize += size
      resources.push({ name: sheet.href, size, type: 'stylesheet' })
    }
  })

  return {
    totalSize,
    resourceCount: resources.length,
    resources: resources.sort((a, b) => b.size - a.size)
  }
}

// Critical path optimization
export function optimizeCriticalPath() {
  // Preload critical resources
  const criticalResources = [
    '/fonts/inter-var.woff2',
    '/images/logo.png',
    '/manifest.json'
  ]

  criticalResources.forEach(resource => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource
    
    if (resource.endsWith('.woff2')) {
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
    } else if (resource.endsWith('.png') || resource.endsWith('.jpg')) {
      link.as = 'image'
    } else if (resource.endsWith('.json')) {
      link.as = 'fetch'
      link.crossOrigin = 'anonymous'
    }
    
    document.head.appendChild(link)
  })
}

// Memory leak detection
export function detectMemoryLeaks() {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return null
  }

  const memory = (performance as any).memory
  const usage = {
    used: memory.usedJSHeapSize,
    total: memory.totalJSHeapSize,
    limit: memory.jsHeapSizeLimit
  }

  const usagePercentage = (usage.used / usage.limit) * 100
  
  return {
    ...usage,
    percentage: usagePercentage,
    isHigh: usagePercentage > 80,
    isCritical: usagePercentage > 95
  }
}

// Export singleton instances
export const domBatcher = new DOMBatcher()
export const eventManager = new EventManager()
export const resourcePreloader = new ResourcePreloader()
export const performanceTimer = new PerformanceTimer()
export const lazyImageLoader = new LazyImageLoader()