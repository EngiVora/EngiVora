"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Search, X } from "lucide-react"
import { Logo } from "@/components/ui/logo"


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
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Check authentication status on component mount and when storage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // Check localStorage first
        const token = localStorage.getItem('authToken')
        const userStr = localStorage.getItem('user')
        
        if (token && userStr) {
          setIsLoggedIn(true)
          return
        }
        
        // Check sessionStorage as fallback
        const sessionToken = sessionStorage.getItem('authToken')
        const sessionUser = sessionStorage.getItem('user')
        
        if (sessionToken && sessionUser) {
          setIsLoggedIn(true)
          return
        }
        
        // If no auth data found
        setIsLoggedIn(false)
      } catch (err) {
        console.error("Error checking auth status:", err)
        setIsLoggedIn(false)
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

  // Handle search functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
        setSearchResults([])
      }
    }

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      searchInputRef.current?.focus()
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchOpen])

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        if (response.ok) {
          const data = await response.json()
          setSearchResults(data.results || [])
        }
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleLogout = () => {
    // Remove auth data from both localStorage and sessionStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('user')
    
    // Update state
    setIsLoggedIn(false)
    
    // Redirect to home page
    window.location.href = '/'
  }

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setSearchQuery('')
      setSearchResults([])
    }
  }

  const handleSearchClear = () => {
    setSearchQuery('')
    setSearchResults([])
    searchInputRef.current?.focus()
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results page if we want a dedicated page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
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
            
            {/* Search Component */}
            <div ref={searchContainerRef} className="relative">
              <button
                type="button"
                onClick={handleSearchToggle}
                aria-label="Search"
                title="Search"
                className={`flex h-9 w-9 items-center justify-center rounded-full text-slate-300 hover:bg-slate-800 hover:text-sky-400 transition-colors neon-ring ${
                  isSearchOpen ? 'bg-slate-800 text-sky-400' : ''
                }`}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Search Input Overlay */}
              {isSearchOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-slate-900 rounded-lg shadow-xl border border-slate-700 z-50">
                  <form onSubmit={handleSearchSubmit} className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search exams, jobs, blogs, events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 bg-slate-800 text-slate-100 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={handleSearchClear}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Search Results */}
                  {(searchQuery.trim() || isSearching) && (
                    <div className="border-t border-slate-700 max-h-80 overflow-y-auto">
                      {isSearching ? (
                        <div className="p-4 text-center text-slate-400">
                          <div className="inline-flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-400"></div>
                            Searching...
                          </div>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="py-2">
                          {searchResults.map((result, index) => (
                            <Link
                              key={index}
                              href={result.url}
                              onClick={() => setIsSearchOpen(false)}
                              className="block px-4 py-3 hover:bg-slate-800 transition-colors border-b border-slate-700 last:border-b-0"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-slate-100">{result.title}</div>
                                  <div className="text-xs text-slate-400 mt-1 line-clamp-2">{result.description}</div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      result.type === 'exam' ? 'bg-blue-100 text-blue-800' :
                                      result.type === 'job' ? 'bg-green-100 text-green-800' :
                                      result.type === 'blog' ? 'bg-purple-100 text-purple-800' :
                                      result.type === 'event' ? 'bg-orange-100 text-orange-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                                    </span>
                                    {result.date && (
                                      <span className="text-xs text-slate-500">{result.date}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                          <div className="px-4 py-3 bg-slate-800 text-center">
                            <button
                              onClick={() => {
                                setIsSearchOpen(false)
                                window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
                              }}
                              className="text-sm text-sky-400 hover:text-sky-300 font-medium"
                            >
                              View all results →
                            </button>
                          </div>
                        </div>
                      ) : searchQuery.trim() && !isSearching ? (
                        <div className="p-4 text-center text-slate-400">
                          <div className="text-sm">No results found for &quot;{searchQuery}&quot;</div>
                          <div className="text-xs mt-1">Try different keywords or check spelling</div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>


          </div>
        </div>
      </div>
    </header>
  )
}