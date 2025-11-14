"use client"

import { useState, useEffect } from 'react'
import { OptimizedImage } from './optimized-image'
import { ExternalImage } from './external-image'

interface SmartImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
  priority?: boolean
  quality?: number
}

export function SmartImage(props: SmartImageProps) {
  const [useExternal, setUseExternal] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Check if the image URL is from a configured domain
  const isConfiguredDomain = (url: string): boolean => {
    const configuredDomains = [
      'lh3.googleusercontent.com',
      'images.unsplash.com',
      'via.placeholder.com',
      'picsum.photos',
      'cdn.jsdelivr.net',
      'github.com',
      'raw.githubusercontent.com'
    ]
    
    try {
      const urlObj = new URL(url)
      return configuredDomains.includes(urlObj.hostname)
    } catch {
      return false
    }
  }

  useEffect(() => {
    // If it's not a configured domain, use external image component
    if (!isConfiguredDomain(props.src)) {
      setUseExternal(true)
    }
  }, [props.src])

  const handleOptimizedImageError = () => {
    setImageError(true)
    setUseExternal(true)
  }

  // If there was an error with OptimizedImage or it's not a configured domain, use ExternalImage
  if (useExternal || imageError) {
    return <ExternalImage {...props} />
  }

  // Try OptimizedImage first for configured domains
  return (
    <div onError={handleOptimizedImageError}>
      <OptimizedImage {...props} />
    </div>
  )
}
