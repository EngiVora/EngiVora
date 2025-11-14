// Service Worker registration and management

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })
        
        console.log('Service Worker registered successfully:', registration.scope)
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, prompt user to refresh
                if (confirm('New version available! Refresh to update?')) {
                  window.location.reload()
                }
              }
            })
          }
        })
        
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    })
  }
}

export function unregisterServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister()
      })
    })
  }
}

// Cache management utilities
export class CacheManager {
  private static instance: CacheManager
  private cacheNames = {
    static: 'engivora-static-v1',
    dynamic: 'engivora-dynamic-v1'
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  async clearCache(cacheName?: string) {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return
    }

    const cacheNames = await caches.keys()
    const cachesToDelete = cacheName 
      ? cacheNames.filter(name => name.includes(cacheName))
      : cacheNames

    await Promise.all(
      cachesToDelete.map(name => caches.delete(name))
    )
  }

  async getCacheSize(): Promise<{ [key: string]: number }> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return {}
    }

    const cacheNames = await caches.keys()
    const sizes: { [key: string]: number } = {}

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName)
      const requests = await cache.keys()
      sizes[cacheName] = requests.length
    }

    return sizes
  }

  async preloadResources(urls: string[]) {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return
    }

    const cache = await caches.open(this.cacheNames.static)
    
    await Promise.all(
      urls.map(async (url) => {
        try {
          const response = await fetch(url)
          if (response.ok) {
            await cache.put(url, response)
          }
        } catch (error) {
          console.error(`Failed to preload ${url}:`, error)
        }
      })
    )
  }

  async isCached(url: string): Promise<boolean> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return false
    }

    const cacheNames = await caches.keys()
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName)
      const response = await cache.match(url)
      if (response) {
        return true
      }
    }

    return false
  }
}

// Offline queue for failed requests
export class OfflineQueue {
  private queue: Array<{
    url: string
    options: RequestInit
    timestamp: number
  }> = []

  private static instance: OfflineQueue

  static getInstance(): OfflineQueue {
    if (!OfflineQueue.instance) {
      OfflineQueue.instance = new OfflineQueue()
    }
    return OfflineQueue.instance
  }

  add(url: string, options: RequestInit) {
    this.queue.push({
      url,
      options,
      timestamp: Date.now()
    })
    
    // Store in localStorage for persistence
    this.saveToStorage()
  }

  async process() {
    if (this.queue.length === 0) {
      return
    }

    const requests = [...this.queue]
    this.queue = []

    for (const request of requests) {
      try {
        await fetch(request.url, request.options)
      } catch (error) {
        // Re-queue failed requests
        this.queue.push(request)
      }
    }

    this.saveToStorage()
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('offline-queue', JSON.stringify(this.queue))
    }
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('offline-queue')
      if (stored) {
        this.queue = JSON.parse(stored)
      }
    }
  }

  constructor() {
    this.loadFromStorage()
    
    // Process queue when online
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.process()
      })
    }
  }
}

// Network status monitoring
export class NetworkMonitor {
  private static instance: NetworkMonitor
  private isOnline = true
  private listeners: Array<(isOnline: boolean) => void> = []

  static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor()
    }
    return NetworkMonitor.instance
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine
      
      window.addEventListener('online', () => {
        this.isOnline = true
        this.notifyListeners()
      })
      
      window.addEventListener('offline', () => {
        this.isOnline = false
        this.notifyListeners()
      })
    }
  }

  addListener(listener: (isOnline: boolean) => void) {
    this.listeners.push(listener)
  }

  removeListener(listener: (isOnline: boolean) => void) {
    this.listeners = this.listeners.filter(l => l !== listener)
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline))
  }

  getStatus() {
    return this.isOnline
  }
}
