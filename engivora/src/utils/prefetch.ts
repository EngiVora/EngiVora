// Prefetching utilities for performance optimization

interface PrefetchOptions {
  priority?: 'high' | 'low'
  cache?: boolean
  timeout?: number
}

export class ResourcePrefetcher {
  private static instance: ResourcePrefetcher
  private prefetchedUrls = new Set<string>()
  private prefetchQueue: Array<{ url: string; options: PrefetchOptions }> = []

  static getInstance(): ResourcePrefetcher {
    if (!ResourcePrefetcher.instance) {
      ResourcePrefetcher.instance = new ResourcePrefetcher()
    }
    return ResourcePrefetcher.instance
  }

  // Prefetch a resource
  async prefetch(url: string, options: PrefetchOptions = {}) {
    if (this.prefetchedUrls.has(url)) {
      return
    }

    const { priority = 'low', cache = true, timeout = 5000 } = options

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        signal: controller.signal,
        priority: priority === 'high' ? 'high' : 'low'
      })

      clearTimeout(timeoutId)

      if (response.ok && cache) {
        // Cache the response
        if ('caches' in window) {
          const cache = await caches.open('prefetch-cache-v1')
          await cache.put(url, response.clone())
        }
      }

      this.prefetchedUrls.add(url)
    } catch (error) {
      console.warn(`Failed to prefetch ${url}:`, error)
    }
  }

  // Prefetch multiple resources
  async prefetchMultiple(urls: string[], options: PrefetchOptions = {}) {
    const { priority = 'low' } = options
    
    // Process in batches to avoid overwhelming the browser
    const batchSize = priority === 'high' ? 3 : 1
    const batches = []
    
    for (let i = 0; i < urls.length; i += batchSize) {
      batches.push(urls.slice(i, i + batchSize))
    }

    for (const batch of batches) {
      await Promise.all(
        batch.map(url => this.prefetch(url, options))
      )
      
      // Small delay between batches
      if (batches.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }

  // Prefetch on hover
  prefetchOnHover(element: HTMLElement, url: string, options: PrefetchOptions = {}) {
    let timeoutId: NodeJS.Timeout

    const handleMouseEnter = () => {
      timeoutId = setTimeout(() => {
        this.prefetch(url, options)
      }, 200) // 200ms delay to avoid unnecessary prefetching
    }

    const handleMouseLeave = () => {
      clearTimeout(timeoutId)
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    // Return cleanup function
    return () => {
      clearTimeout(timeoutId)
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }

  // Prefetch on intersection (when element comes into view)
  prefetchOnIntersection(element: HTMLElement, url: string, options: PrefetchOptions = {}) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.prefetch(url, options)
            observer.unobserve(element)
          }
        })
      },
      { rootMargin: '100px' } // Start prefetching 100px before element is visible
    )

    observer.observe(element)

    // Return cleanup function
    return () => observer.unobserve(element)
  }

  // Queue prefetch for later execution
  queuePrefetch(url: string, options: PrefetchOptions = {}) {
    this.prefetchQueue.push({ url, options })
  }

  // Process the prefetch queue
  async processQueue() {
    if (this.prefetchQueue.length === 0) {
      return
    }

    const queue = [...this.prefetchQueue]
    this.prefetchQueue = []

    await Promise.all(
      queue.map(({ url, options }) => this.prefetch(url, options))
    )
  }

  // Get prefetch statistics
  getStats() {
    return {
      prefetchedCount: this.prefetchedUrls.size,
      queuedCount: this.prefetchQueue.length,
      prefetchedUrls: Array.from(this.prefetchedUrls)
    }
  }
}

// Critical resource prefetching
export function prefetchCriticalResources() {
  const prefetcher = ResourcePrefetcher.getInstance()

  // Prefetch critical pages
  const criticalPages = [
    '/jobs',
    '/blogs',
    '/admin',
    '/admin/login'
  ]

  // Prefetch with high priority
  prefetcher.prefetchMultiple(criticalPages, { priority: 'high' })

  // Prefetch API endpoints
  const criticalAPIs = [
    '/api/jobs',
    '/api/blogs',
    '/api/students/list'
  ]

  prefetcher.prefetchMultiple(criticalAPIs, { priority: 'low' })
}

// DNS prefetching for external domains
export function prefetchDNS(domains: string[]) {
  domains.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = `//${domain}`
    document.head.appendChild(link)
  })
}

// Preconnect to important origins
export function preconnectOrigins(origins: string[]) {
  origins.forEach(origin => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = origin
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

// Preload critical resources
export function preloadResources(resources: Array<{ href: string; as: string; type?: string }>) {
  resources.forEach(resource => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource.href
    link.as = resource.as
    
    if (resource.type) {
      link.type = resource.type
    }
    
    document.head.appendChild(link)
  })
}

// Initialize performance optimizations
export function initializePerformanceOptimizations() {
  // DNS prefetch for external domains
  prefetchDNS([
    'lh3.googleusercontent.com',
    'images.unsplash.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com'
  ])

  // Preconnect to important origins
  preconnectOrigins([
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ])

  // Preload critical resources
  preloadResources([
    { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
    { href: '/images/company-placeholder.svg', as: 'image' },
    { href: '/manifest.json', as: 'manifest' }
  ])

  // Prefetch critical resources after initial load
  setTimeout(() => {
    prefetchCriticalResources()
  }, 2000)
}

// Smart prefetching based on user behavior
export class SmartPrefetcher {
  private userBehavior = {
    visitedPages: new Set<string>(),
    hoveredLinks: new Set<string>(),
    timeOnPages: new Map<string, number>()
  }

  // Track user behavior
  trackPageVisit(url: string) {
    this.userBehavior.visitedPages.add(url)
    
    // Start timing
    const startTime = Date.now()
    
    // Track time when user leaves
    const trackTime = () => {
      const timeSpent = Date.now() - startTime
      this.userBehavior.timeOnPages.set(url, timeSpent)
    }
    
    window.addEventListener('beforeunload', trackTime, { once: true })
  }

  // Predict and prefetch likely next pages
  predictAndPrefetch(currentUrl: string) {
    const prefetcher = ResourcePrefetcher.getInstance()
    const predictions = this.getPredictions(currentUrl)
    
    predictions.forEach(prediction => {
      prefetcher.prefetch(prediction.url, { priority: 'low' })
    })
  }

  private getPredictions(currentUrl: string): Array<{ url: string; probability: number }> {
    // Simple prediction algorithm based on common user flows
    const predictions: Array<{ url: string; probability: number }> = []
    
    if (currentUrl === '/') {
      predictions.push(
        { url: '/jobs', probability: 0.8 },
        { url: '/blogs', probability: 0.6 },
        { url: '/admin', probability: 0.1 }
      )
    } else if (currentUrl === '/jobs') {
      predictions.push(
        { url: '/jobs/1', probability: 0.7 },
        { url: '/blogs', probability: 0.4 }
      )
    } else if (currentUrl === '/blogs') {
      predictions.push(
        { url: '/blogs/1', probability: 0.6 },
        { url: '/jobs', probability: 0.3 }
      )
    }
    
    return predictions.filter(p => p.probability > 0.3)
  }

  getStats() {
    return {
      visitedPages: this.userBehavior.visitedPages.size,
      hoveredLinks: this.userBehavior.hoveredLinks.size,
      averageTimeOnPages: Array.from(this.userBehavior.timeOnPages.values())
        .reduce((sum, time) => sum + time, 0) / this.userBehavior.timeOnPages.size
    }
  }
}
