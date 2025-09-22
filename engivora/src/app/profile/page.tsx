"use client"

import { UserProfile, useUser } from '@clerk/nextjs'
import { isClerkConfigured } from '@/lib/clerk-utils'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const clerkEnabled = isClerkConfigured()
  
  if (!clerkEnabled) {
    return (
      <main className="flex-1 px-6 md:px-10 lg:px-20 xl:px-40 py-12">
        <div className="mx-auto w-full max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Not Configured</h1>
            <p className="text-gray-600 mb-6">Clerk authentication is not set up yet.</p>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
    )
  }
  
  return <ClerkProfilePage />
}

// Separate component that uses Clerk hooks
function ClerkProfilePage() {
  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) {
    return (
      <main className="flex-1 px-6 md:px-10 lg:px-20 xl:px-40 py-12">
        <div className="mx-auto w-full max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </main>
    )
  }

  if (!isSignedIn) {
    return (
      <main className="flex-1 px-6 md:px-10 lg:px-20 xl:px-40 py-12">
        <div className="mx-auto w-full max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">Please sign in to view your profile.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 px-6 md:px-10 lg:px-20 xl:px-40 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account information and preferences</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <UserProfile 
            appearance={{
              elements: {
                card: "shadow-none border-none",
                navbar: "hidden",
                pageScrollBox: "padding-0",
                rootBox: "w-full",
              },
            }}
          />
        </div>
      </div>
    </main>
  )
}


