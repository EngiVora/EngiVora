// Optimized API client with caching, deduplication, and performance features

interface ApiRequestOptions extends RequestInit {
  cache?: 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached'
  timeout?: number
  retries?: number
  dedupe?: boolean
}

interface CacheEntry {
  data: any
  timestamp: number
  ttl: number
  etag?: string
}

class OptimizedAPIClient {
  private static instance: OptimizedAPIClient
  private cache = new Map<string, CacheEntry>()
  private pendingRequests = new Map<string, Promise<Response>>()
  private requestQueue: Array<() => Promise<void>> = []
  private isProcessingQueue = false
  private maxConcurrentRequests = 6

  static getInstance(): OptimizedAPIClient {
    if (!OptimizedAPIClient.instance) {
      OptimizedAPIClient.instance = new OptimizedAPIClient()
    }
    return OptimizedAPIClient.instance
  }

  // Main request method
  async request<T>(url: string, options: ApiRequestOptions = {}): Promise<T> {
    const {
      cache = 'default',
      timeout = 10000,
      retries = 3,
      dedupe = true,
      ...fetchOptions
    } = options

    const cacheKey = this.getCacheKey(url, fetchOptions)

    // Check cache first
    if (cache !== 'no-cache' && cache !== 'reload') {
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        return cached
      }
    }

    // Handle request deduplication
    if (dedupe && this.pendingRequests.has(cacheKey)) {
      const response = await this.pendingRequests.get(cacheKey)!
      return response.json()
    }

    // Create request promise
    const requestPromise = this.executeRequest(url, fetchOptions, timeout, retries)
    
    if (dedupe) {
      this.pendingRequests.set(cacheKey, requestPromise)
    }

    try {
      const response = await requestPromise
      const data = await response.json()

      // Cache successful responses
      if (response.ok && cache !== 'no-cache') {
        this.setCache(cacheKey, data, response)
      }

      return data
    } finally {
      if (dedupe) {
        this.pendingRequests.delete(cacheKey)
      }
    }
  }

  // Execute request with retries and timeout
  private async executeRequest(
    url: string, 
    options: RequestInit, 
    timeout: number, 
    retries: number
  ): Promise<Response> {
    let lastError: Error

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        })

        clearTimeout(timeoutId)
        return response
      } catch (error) {
        lastError = error as Error
        
        // Don't retry on abort (timeout) or certain HTTP errors
        if (error instanceof Error && error.name === 'AbortError') {
          break
        }

        if (attempt < retries) {
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    throw lastError!
  }

  // Cache management
  private getCacheKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET'
    const body = options.body ? JSON.stringify(options.body) : ''
    return `${method}:${url}:${body}`
  }

  private getFromCache(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  private setCache(key: string, data: any, response: Response) {
    const ttl = this.getTTLFromResponse(response)
    const etag = response.headers.get('etag') || undefined
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      etag
    })

    // Clean up old cache entries
    this.cleanupCache()
  }

  private getTTLFromResponse(response: Response): number {
    const cacheControl = response.headers.get('cache-control')
    if (cacheControl) {
      const maxAge = cacheControl.match(/max-age=(\d+)/)
      if (maxAge) {
        return parseInt(maxAge[1]) * 1000
      }
    }

    // Default TTL based on response type
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      return 5 * 60 * 1000 // 5 minutes for API responses
    }
    if (contentType?.includes('image')) {
      return 24 * 60 * 60 * 1000 // 24 hours for images
    }

    return 60 * 1000 // 1 minute default
  }

  private cleanupCache() {
    const now = Date.now()
    const maxEntries = 100

    if (this.cache.size > maxEntries) {
      const entries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
        .slice(0, this.cache.size - maxEntries)

      entries.forEach(([key]) => this.cache.delete(key))
    }

    // Remove expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // Batch requests
  async batch<T>(requests: Array<{ url: string; options?: ApiRequestOptions }>): Promise<T[]> {
    const promises = requests.map(({ url, options }) => this.request<T>(url, options))
    return Promise.all(promises)
  }

  // Queue requests to avoid overwhelming the server
  queueRequest<T>(url: string, options: ApiRequestOptions = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await this.request<T>(url, options)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })

      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return
    }

    this.isProcessingQueue = true

    while (this.requestQueue.length > 0) {
      const batch = this.requestQueue.splice(0, this.maxConcurrentRequests)
      await Promise.all(batch.map(request => request()))
    }

    this.isProcessingQueue = false
  }

  // Clear cache
  clearCache(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }

  // Get cache stats
  getCacheStats() {
    const now = Date.now()
    let validEntries = 0
    let expiredEntries = 0

    for (const entry of this.cache.values()) {
      if (now - entry.timestamp <= entry.ttl) {
        validEntries++
      } else {
        expiredEntries++
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      pendingRequests: this.pendingRequests.size,
      queuedRequests: this.requestQueue.length
    }
  }
}

// Export singleton instance
export const apiClient = OptimizedAPIClient.getInstance()

// Convenience methods
export const api = {
  get: <T>(url: string, options?: ApiRequestOptions) => 
    apiClient.request<T>(url, { ...options, method: 'GET' }),
  
  post: <T>(url: string, data?: any, options?: ApiRequestOptions) => 
    apiClient.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    }),
  
  put: <T>(url: string, data?: any, options?: ApiRequestOptions) => 
    apiClient.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    }),
  
  delete: <T>(url: string, options?: ApiRequestOptions) => 
    apiClient.request<T>(url, { ...options, method: 'DELETE' }),
  
  batch: <T>(requests: Array<{ url: string; options?: ApiRequestOptions }>) =>
    apiClient.batch<T>(requests),
  
  queue: <T>(url: string, options?: ApiRequestOptions) =>
    apiClient.queueRequest<T>(url, options),
  
  clearCache: (pattern?: string) => apiClient.clearCache(pattern),
  getStats: () => apiClient.getCacheStats()
}

// React hook for API calls with caching
export function useApiCache<T>(
  url: string | null,
  options?: ApiRequestOptions
): {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
} {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const fetchData = React.useCallback(async () => {
    if (!url) return

    setLoading(true)
    setError(null)

    try {
      const result = await api.get<T>(url, options)
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [url, options])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}

// Import React for the hook (you'll need to add this import at the top)
import React from 'react'
