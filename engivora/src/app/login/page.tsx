"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

// Note: metadata export removed due to "use client" directive
// This will be handled by the layout or moved to a server component

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [requiresVerification, setRequiresVerification] = useState(false)
  const router = useRouter()

  // Check for verification success from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('verified') === 'true') {
      setSuccess("Email verified successfully! You can now log in.")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    setRequiresVerification(false)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Login successful! Redirecting...")
        // Store auth token in localStorage (in real app, use secure storage)
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        
        setTimeout(() => {
          router.push("/profile")
        }, 1000)
      } else {
        setError(data.error || "Login failed")
        if (data.requiresEmailVerification) {
          setRequiresVerification(true)
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!formData.email) {
      setError("Please enter your email address first")
      return
    }

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setSuccess("Verification email sent! Please check your inbox.")
        setError("")
      } else {
        setError(data.error || "Failed to resend verification email")
      }
    } catch (error) {
      console.error('Resend verification error:', error)
      setError("Network error. Please try again.")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <main className="flex-1 px-6 md:px-10 lg:px-20 xl:px-40 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Welcome back</h1>
            <p className="mt-2 text-gray-600">Login to continue to Engivora</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
              {requiresVerification && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Resend verification email
                </button>
              )}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">{success}</span>
            </div>
          )}

          <form className="space-y-5" aria-label="Login form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Link href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Forgot password?</Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600"
                placeholder="••••••••"
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
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account? {" "}
            <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700">Sign up</Link>
          </p>

          <div className="mt-4 text-center">
            <Link
              href="/verify-email"
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Need to verify your email? Click here
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Student:</strong> student@example.com / password123</p>
              <p><strong>Admin:</strong> admin@engivora.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


