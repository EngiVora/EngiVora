import React from "react"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background circle */}
        <circle cx="16" cy="16" r="15" fill="url(#gradient)" stroke="url(#gradient)" strokeWidth="2"/>
        
        {/* Letter E */}
        <path
          d="M8 8h12v3H11v4h8v3H11v4h9v3H8V8z"
          fill="white"
        />
        
        {/* Gear icon */}
        <circle cx="22" cy="22" r="3" fill="white" opacity="0.8"/>
        <circle cx="22" cy="22" r="1.5" fill="url(#gradient)"/>
        
        {/* Gear teeth */}
        <rect x="21" y="18" width="2" height="1" fill="white" opacity="0.8"/>
        <rect x="21" y="25" width="2" height="1" fill="white" opacity="0.8"/>
        <rect x="18" y="21" width="1" height="2" fill="white" opacity="0.8"/>
        <rect x="25" y="21" width="1" height="2" fill="white" opacity="0.8"/>
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6"/>
            <stop offset="100%" stopColor="#10B981"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
