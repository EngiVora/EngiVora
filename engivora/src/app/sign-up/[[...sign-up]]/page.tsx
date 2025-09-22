"use client"

import { SignUp } from '@clerk/nextjs'
import { isClerkConfigured } from '@/lib/clerk-utils'
import Link from 'next/link'

export default function SignUpPage() {
  const clerkEnabled = isClerkConfigured()
  
  if (!clerkEnabled) {
    return (
      <main className="flex-1 px-6 md:px-10 lg:px-20 xl:px-40 py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Authentication Not Configured</h1>
            <p className="mt-2 text-gray-600">Clerk authentication is not set up yet.</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Setup Required</h3>
            <p className="text-yellow-700 mb-4">
              To enable authentication, please follow the setup guide in the CLERK_SETUP_GUIDE.md file.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-yellow-600">Quick steps:</p>
              <ol className="text-sm text-yellow-600 list-decimal list-inside space-y-1">
                <li>Create a Clerk account at clerk.com</li>
                <li>Get your API keys</li>
                <li>Update your .env.local file</li>
                <li>Restart the development server</li>
              </ol>
            </div>
            <Link 
              href="/"
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
    )
  }
  return (
    <main className="flex-1 px-6 md:px-10 lg:px-20 xl:px-40 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Create your account</h1>
          <p className="mt-2 text-gray-600">Join Engivora to access student resources and opportunities</p>
        </div>
        
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
                card: "shadow-sm border border-gray-200 rounded-xl",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: 
                  "border-gray-300 text-gray-700 hover:bg-gray-50",
                formFieldInput: 
                  "border-gray-300 focus:border-blue-600 focus:ring-blue-600",
              },
            }}
          />
        </div>
      </div>
    </main>
  )
}