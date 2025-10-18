// API Cache utility for performance optimization
interface CacheItem {
  data: any
  timestamp: number
  ttl: number // Time to live in milliseconds
}

class APICache {
  private cache = new Map<string, CacheItem>()

  set(key: string, data: any, ttl: number = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }

  // Clear expired items
  cleanup() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

export const apiCache = new APICache()

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Optimized fetch with caching
export async function cachedFetch(
  url: string,
  options: RequestInit = {},
  ttl: number = 300000
): Promise<Response> {
  const cacheKey = `${url}-${JSON.stringify(options)}`
  
  // Check cache first
  const cachedData = apiCache.get(cacheKey)
  if (cachedData) {
    return new Response(JSON.stringify(cachedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Fetch from API
  const response = await fetch(url, options)
  if (response.ok) {
    const data = await response.json()
    apiCache.set(cacheKey, data, ttl)
  }

  return response
}

// Cleanup expired cache items every 5 minutes
setInterval(() => {
  apiCache.cleanup()
}, 300000)
