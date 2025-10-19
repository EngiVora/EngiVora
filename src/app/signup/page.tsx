"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  Building,
  Hash,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2,
  Cake
} from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    year: "",
    rollNumber: "",
    dateOfBirth: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      // Use enhanced signup endpoint that guarantees data is stored in MongoDB Atlas
      const res = await fetch('/api/auth/enhanced-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          department: formData.department,
          year: formData.year,
          rollNumber: formData.rollNumber,
          dateOfBirth: formData.dateOfBirth
        })
      })

      const data = await res.json()
      
      if (!res.ok) {
        setError(data?.error || 'Signup failed')
        return
      }

      setSuccess("Account created successfully! Redirecting to login...")
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      setError("Signup failed. Please try again.")
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 aurora-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-sky-500/20 flex items-center justify-center">
              <User className="h-10 w-10 text-sky-400" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-100">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Join Engivora to access student resources and opportunities
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="px-6 py-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-200">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-200">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-1">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm py-3"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm py-3"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Department Field */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-slate-300 mb-1">
                    Department
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-slate-500" />
                    </div>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm py-3 appearance-none"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science Engineering (CSE)">Computer Science Engineering (CSE)</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Electronics and Communication Engineering (ECE)">Electronics and Communication Engineering (ECE)</option>
                      <option value="Information Technology (IT)">Information Technology (IT)</option>
                      <option value="Artificial Intelligence and Data Science Engineering">Artificial Intelligence and Data Science Engineering</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                {/* Year Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Year of Study
                  </label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {['1st', '2nd', '3rd', '4th'].map((year) => (
                      <div key={year} className="flex items-center">
                        <input
                          id={`year-${year}`}
                          name="year"
                          type="radio"
                          value={year}
                          checked={formData.year === year}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-sky-500 border-slate-600 bg-slate-800 focus:ring-sky-500 focus:ring-offset-slate-900"
                        />
                        <label htmlFor={`year-${year}`} className="ml-2 block text-sm text-slate-300">
                          {year} Year
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Roll Number Field */}
                <div>
                  <label htmlFor="rollNumber" className="block text-sm font-medium text-slate-300 mb-1">
                    Roll Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="rollNumber"
                      name="rollNumber"
                      type="text"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm py-3"
                      placeholder="CS2021001"
                    />
                  </div>
                </div>

                {/* Date of Birth Field */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Cake className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm py-3"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm py-3"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-500 hover:text-slate-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-500 hover:text-slate-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm py-3"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-500 hover:text-slate-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-500 hover:text-slate-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <User className="h-4 w-4 mr-2" />
                      Sign up
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Additional Links */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900/50 text-slate-500">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm text-sky-400 hover:text-sky-300"
                >
                  Sign in to your account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}