"use client"

import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs'
import { isClerkConfigured } from '@/lib/clerk-utils'

export default function TestClerkPage() {
  const clerkEnabled = isClerkConfigured()
  const { isLoaded, isSignedIn, user } = useUser()

  if (!clerkEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-center mb-6">Clerk Test</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">Clerk is not configured. Please set up your Clerk API keys in the .env.local file.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-center mb-6">Clerk Test</h1>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Clerk Authentication Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          
          {isSignedIn ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {user?.imageUrl && (
                  <img 
                    src={user.imageUrl} 
                    alt={user.fullName || 'User'} 
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div>
                  <p className="text-lg font-medium">{user?.fullName}</p>
                  <p className="text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>
                  <p className="text-sm text-gray-500">User ID: {user?.id}</p>
                </div>
              </div>
              
              <div className="pt-4">
                <SignOutButton>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-6">You are not signed in</p>
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Sign In
                </button>
              </SignInButton>
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