"use client"

import { useState } from "react"
import Image from "next/image"
import { getInitials, getAvatarBackground } from "@/utils/avatar"

interface AvatarProps {
  name: string | null | undefined
  src?: string | null
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  onClick?: () => void
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-24 w-24 text-3xl"
}

export function Avatar({ name, src, size = "md", className = "", onClick }: AvatarProps) {
  const [imageError, setImageError] = useState(false)
  const initials = getInitials(name)
  const background = getAvatarBackground(name)
  const sizeClass = sizeClasses[size]
  
  // If src is provided and no error, show image
  if (src && !imageError) {
    // Check if it's a base64 data URL
    const isBase64 = src.startsWith('data:image')
    
    return (
      <div
        className={`${sizeClass} rounded-full overflow-hidden flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
        title={name || "User"}
      >
        {isBase64 ? (
          // Use regular img tag for base64 data URLs
          <img
            src={src}
            alt={name || "User"}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          // Use Next.js Image for regular URLs
          <Image
            src={src}
            alt={name || "User"}
            width={size === "sm" ? 32 : size === "md" ? 40 : size === "lg" ? 48 : 96}
            height={size === "sm" ? 32 : size === "md" ? 40 : size === "lg" ? 48 : 96}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            unoptimized={src.startsWith('http') && !src.includes('localhost')}
          />
        )}
      </div>
    )
  }
  
  // Fallback to initials
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold text-white ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ background }}
      onClick={onClick}
      title={name || "User"}
    >
      {initials}
    </div>
  )
}

