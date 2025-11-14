"use client"

import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
  priority?: boolean
  quality?: number
  sizes?: string
  lazy?: boolean
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width = 300,
  height = 200,
  className = '',
  fallbackSrc = '/images/placeholder.jpg',
  priority = false,
  quality = 80,
  sizes,
  lazy = true,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(!lazy || priority)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setImageSrc(src)
    setHasError(false)
    setIsLoaded(false)
  }, [src])

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || !imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { 
        rootMargin: '50px',
        threshold: 0.1
      }
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [lazy, priority])

  const handleError = useCallback(() => {
    if (!hasError) {
      setHasError(true)
      setImageSrc(fallbackSrc)
      onError?.()
    }
  }, [hasError, fallbackSrc, onError])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  // Generate optimized placeholder
  const placeholderDataUrl = `data:image/svg+xml;base64,${btoa(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <circle cx="50%" cy="40%" r="20" fill="#d1d5db" opacity="0.3"/>
      <rect x="30%" y="60%" width="40%" height="8" fill="#d1d5db" opacity="0.3" rx="4"/>
      <rect x="35%" y="72%" width="30%" height="6" fill="#d1d5db" opacity="0.2" rx="3"/>
    </svg>`
  )}`

  // Responsive sizes if not provided
  const responsiveSizes = sizes || `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`

  if (!isInView) {
    return (
      <div 
        ref={imgRef}
        className={`relative overflow-hidden bg-gray-200 animate-pulse ${className}`}
        style={{ width, height }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
      </div>
    )
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className} ${!isLoaded ? 'animate-pulse' : ''}`}
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`object-cover w-full h-full transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        quality={quality}
        placeholder="blur"
        blurDataURL={placeholderDataUrl}
        sizes={responsiveSizes}
        loading={priority ? 'eager' : 'lazy'}
      />
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  )
}

// Default placeholder image component
export function PlaceholderImage({ 
  className = '', 
  width = 300, 
  height = 200,
  text = 'No Image'
}: { 
  className?: string
  width?: number
  height?: number
  text?: string
}) {
  return (
    <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
      <div className="text-center">
        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
        <p className="text-sm">{text}</p>
      </div>
    </div>
  )
}
