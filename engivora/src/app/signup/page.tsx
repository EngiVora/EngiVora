"use client"

import Link from "next/link"
import { useState } from "react"
import { Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"

// Note: metadata export removed due to "use client" directive
// This will be handled by the layout or moved to a server component

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    year: "",
    rollNumber: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [requiresVerification, setRequiresVerification] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    setRequiresVerification(false)

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    // Password strength validation
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number")
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        setRequiresVerification(true)
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          department: "",
          year: "",
          rollNumber: ""
        })
      } else {
        setError(data.error || "Registration failed")
        if (data.requiresVerification) {
          setRequiresVerification(true)
        }
      }
    } catch (error) {
      console.error('Signup error:', error)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleResendVerification = async () => {
    if (!formData.email) {
      setError("Please enter your email address")
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
      } else {
        setError(data.error || "Failed to resend verification email")
      }
    } catch (error) {
      console.error('Resend verification error:', error)
      setError("Network error. Please try again.")
    }
  }

  return (
    <main className="flex-1 px-6 md:px-10 lg:px-20 xl:px-40 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Create your account</h1>
            <p className="mt-2 text-gray-600">Join Engivora to access student resources and opportunities</p>
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
              {requiresVerification && (
                <div className="text-sm text-green-700">
                  <p>Please check your email and click the verification link to activate your account.</p>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="mt-2 text-blue-600 hover:text-blue-700 underline"
                  >
                    Did not receive the email? Resend verification
                  </button>
                </div>
              )}
            </div>
          )}

          <form className="space-y-5" aria-label="Signup form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600"
                placeholder="Khushi Sinha"
              />
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 pr-10 text-sm placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must contain uppercase, lowercase, and number
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 pr-10 text-sm placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:ring-blue-600"
              >
                <option value="">Select your department</option>
                <option value="Computer Science Engineering">Computer Science Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics and Communication">Electronics and Communication</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Chemical Engineering">Chemical Engineering</option>
                <option value="Aerospace Engineering">Aerospace Engineering</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year (Optional)</label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:ring-blue-600"
                >
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700">Roll Number (Optional)</label>
                <input
                  id="rollNumber"
                  name="rollNumber"
                  type="text"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600"
                  placeholder="CS2021001"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account? {" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  )
}


