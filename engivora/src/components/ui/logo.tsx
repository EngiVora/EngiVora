import React from "react"
import Image from "next/image"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeToPx: Record<NonNullable<LogoProps["size"]>, number> = {
    sm: 24,
    md: 32,
    lg: 48,
  }

  const px = sizeToPx[size]

  return (
    <Image
      src="/logo.png"
      alt="Engivora logo"
      width={px}
      height={px}
      className={className}
      priority
    />
  )
}
