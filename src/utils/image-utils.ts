// Image utility functions

// Common image domains that are allowed
export const ALLOWED_IMAGE_DOMAINS = [
  'lh3.googleusercontent.com',
  'images.unsplash.com',
  'via.placeholder.com',
  'picsum.photos',
  'cdn.jsdelivr.net',
  'github.com',
  'raw.githubusercontent.com'
]

// Check if an image URL is from an allowed domain
export function isAllowedImageDomain(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return ALLOWED_IMAGE_DOMAINS.some(domain => urlObj.hostname === domain)
  } catch {
    return false
  }
}

// Generate a placeholder image URL
export function getPlaceholderImageUrl(
  width: number = 300,
  height: number = 200,
  text: string = 'Image'
): string {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">${text}</text>
  </svg>`
  
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// Optimize image URL for different use cases
export function optimizeImageUrl(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'jpeg' | 'png'
  } = {}
): string {
  if (!url) return getPlaceholderImageUrl(options.width, options.height, 'No Image')
  
  const { width, height, quality = 80, format = 'webp' } = options
  
  // For Google Images, we can add optimization parameters
  if (url.includes('lh3.googleusercontent.com')) {
    const urlObj = new URL(url)
    if (width) urlObj.searchParams.set('w', width.toString())
    if (height) urlObj.searchParams.set('h', height.toString())
    urlObj.searchParams.set('q', quality.toString())
    return urlObj.toString()
  }
  
  // For other domains, return as is
  return url
}

// Get appropriate fallback image based on context
export function getFallbackImage(context: 'company' | 'user' | 'blog' | 'job' | 'event' = 'company'): string {
  switch (context) {
    case 'company':
      return '/images/company-placeholder.svg'
    case 'user':
      return '/images/user-placeholder.svg'
    case 'blog':
      return '/images/blog-placeholder.svg'
    case 'job':
      return '/images/job-placeholder.svg'
    case 'event':
      return '/images/event-placeholder.svg'
    default:
      return '/images/company-placeholder.svg'
  }
}

// Validate image URL
export function validateImageUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
