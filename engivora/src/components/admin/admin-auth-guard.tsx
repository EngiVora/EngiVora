"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
      if (!token) {
        router.replace('/admin/login')
      }
    } catch {
      router.replace('/admin/login')
    }
  }, [router])

  return <>{children}</>
}
