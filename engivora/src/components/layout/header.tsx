"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Exams", href: "/exams" },
  { name: "Jobs", href: "/jobs" },
  { name: "Blogs", href: "/blogs" },
  { name: "Discounts", href: "/discounts" },
  { name: "Work Hub", href: "/work-hub" },
]

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  // Check authentication status on component mount and when storage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // Check localStorage first
        const token = localStorage.getItem('authToken')
        const user = localStorage.getItem('user')
        
        if (token && user) {
          setIsLoggedIn(true)
          setUser(JSON.parse(user))
          return
        }
        
        // Check sessionStorage as fallback
        const sessionToken = sessionStorage.getItem('authToken')
        const sessionUser = sessionStorage.getItem('user')
        
        if (sessionToken && sessionUser) {
          setIsLoggedIn(true)
          setUser(JSON.parse(sessionUser))
          return
        }
        
        // If no auth data found
        setIsLoggedIn(false)
        setUser(null)
      } catch (err) {
        console.error("Error checking auth status:", err)
        setIsLoggedIn(false)
        setUser(null)
      }
    }
    
    // Check on mount
    checkAuthStatus()
    
    // Listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuthStatus()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    // Remove auth data from both localStorage and sessionStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('user')
    
    // Update state
    setIsLoggedIn(false)
    setUser(null)
    
    // Redirect to home page
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 w-full glass-panel accent-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center space-x-2 text-slate-100">
            <Logo size="md" />
            <span className="text-xl font-bold">Engivora</span>
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="nav-link text-slate-300 hover:text-sky-400">
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right: Auth + Search + ThemeToggle */}
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/signup"
                  className="hidden sm:inline-flex h-9 items-center justify-center rounded-full px-4 bg-sky-600 text-white text-sm font-semibold hover:bg-sky-500 transition-colors neon-ring"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center justify-center rounded-full px-4 bg-slate-800 text-slate-100 text-sm font-semibold ring-1 ring-inset ring-slate-700 hover:bg-slate-700 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <>
                <Link href="/profile" className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
            
            <button
              type="button"
              aria-label="Search"
              title="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 hover:bg-slate-800 hover:text-sky-400 transition-colors neon-ring"
            >
              <Search className="h-5 w-5" />
            </button>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}