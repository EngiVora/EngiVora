"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TestClerkPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  // Check authentication status on component mount
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
    
    checkAuthStatus()
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
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Authentication Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          
          {isLoggedIn && user ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-medium">{user.name}</p>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-6">You are not signed in</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => router.push('/signup')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Admin Portal</h2>
          <p className="text-gray-600 mb-4">
            The admin portal uses a separate authentication system with hardcoded credentials.
          </p>
          <a 
            href="/admin/login" 
            className="inline-block px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            Go to Admin Portal
          </a>
        </div>
      </div>
    </div>
  )
}