"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = typeof window !== 'undefined' ? (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
        
        if (!token) {
          router.replace('/admin/login')
          return
        }

        // Verify token with server
        const res = await fetch('/api/admin/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        })

        if (res.ok) {
          setIsAuthenticated(true)
        } else {
          // Clear invalid token
          localStorage.removeItem('adminToken')
          sessionStorage.removeItem('adminToken')
          localStorage.removeItem('adminUser')
          sessionStorage.removeItem('adminUser')
          router.replace('/admin/login')
        }
      } catch (error) {
        console.error('Token verification failed:', error)
        router.replace('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
