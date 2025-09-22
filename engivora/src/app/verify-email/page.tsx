"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Loader2, AlertCircle, CheckCircle, Mail } from "lucide-react"

type EmailServiceStatus = {
  emailService: {
    configured: boolean;
    service: string;
    mode: string;
    message: string;
  };
  instructions: string;
};

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [emailServiceStatus, setEmailServiceStatus] = useState<EmailServiceStatus | null>(null)

  // Check email service status on component mount
  useEffect(() => {
    const checkEmailStatus = async () => {
      try {
        const response = await fetch('/api/auth/email-status')
        const data = await response.json()
        setEmailServiceStatus(data)
      } catch (error) {
        console.error('Failed to check email service status:', error)
      }
    }
    checkEmailStatus()
  }, [])

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setSuccess("Verification email process initiated! Since we're using a mock email service, check the server console for your verification link.")
        
        // For demo purposes, let's also try to fetch the link from console
        // In a real app, this wouldn't be needed
        // setTimeout(() => {
        //   setVerificationLink(`${window.location.origin}/api/auth/verify-email?token=check-console-for-actual-token`)
        // }, 1000)
      } else {
        setError(data.error || "Failed to resend verification email")
      }
    } catch (error) {
      console.error('Resend verification error:', error)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 px-6 md:px-10 lg:px-20 xl:px-40 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Email Verification</h1>
            <p className="mt-2 text-gray-600">Resend verification email or get your verification link</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">{success}</span>
              </div>
            </div>
          )}

          {/* Email Service Status */}
          {emailServiceStatus && (
            <div className={`mb-6 p-4 border rounded-md ${
              emailServiceStatus.emailService.configured 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <h3 className={`text-sm font-medium mb-2 ${
                emailServiceStatus.emailService.configured 
                  ? 'text-green-800' 
                  : 'text-yellow-800'
              }`}>
                📧 Email Service Status
              </h3>
              <p className={`text-sm ${
                emailServiceStatus.emailService.configured 
                  ? 'text-green-700' 
                  : 'text-yellow-700'
              }`}>
                {emailServiceStatus.emailService.message}
              </p>
              {!emailServiceStatus.emailService.configured && (
                <p className="text-sm text-yellow-600 mt-2">
                  {emailServiceStatus.instructions}
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleResendVerification} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600"
                placeholder="Enter your email address"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend Verification Email"
              )}
            </button>
          </form>

          {/* Demo note - only show if using mock */}
          {emailServiceStatus && !emailServiceStatus.emailService.configured && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-900 mb-2">ℹ️ Development Mode Note:</h3>
              <p className="text-sm text-gray-600">
                Currently using mock email service. To enable real emails, configure EMAIL_SERVICE in your .env file.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}