"use client"

import React from 'react'

// Utility to check if Clerk is properly configured
export const isClerkConfigured = () => {
  if (typeof window === 'undefined') {
    // Server-side check
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    return publishableKey && publishableKey.startsWith('pk_') && !publishableKey.includes('placeholder') && !publishableKey.includes('NOT_CONFIGURED')
  }
  
  // Client-side check
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  return publishableKey && publishableKey.startsWith('pk_') && !publishableKey.includes('placeholder') && !publishableKey.includes('NOT_CONFIGURED')
}

// Mock components for when Clerk is not configured
export const MockSignedIn: React.FC<{ children: React.ReactNode }> = () => null
export const MockSignedOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement(React.Fragment, null, children)
}
export const MockUserButton: React.FC = () => null