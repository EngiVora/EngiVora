"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  User, 
  Mail, 
  Building, 
  Calendar, 
  Loader2,
  Save,
  AlertCircle,
  CheckCircle,
  Hash,
  GraduationCap
} from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  department: string
  year?: string
  rollNumber?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    year: "",
    rollNumber: ""
  })
  const router = useRouter()

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Try to get user from localStorage first
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            department: userData.department || "",
            year: userData.year || "",
            rollNumber: userData.rollNumber || ""
          })
          setLoading(false)
          return
        }
        
        // Try sessionStorage as fallback
        const sessionUser = sessionStorage.getItem('user')
        if (sessionUser) {
          const userData = JSON.parse(sessionUser)
          setUser(userData)
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            department: userData.department || "",
            year: userData.year || "",
            rollNumber: userData.rollNumber || ""
          })
          setLoading(false)
          return
        }
        
        // If no user data found, redirect to login
        router.push('/login')
      } catch (err) {
        console.error("Error loading user data:", err)
        setError("Failed to load profile data")
        setLoading(false)
      }
    }
    
    loadUserData()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")
    
    try {
      // In a real app, you would send this data to your API
      // For now, we'll just update the local storage
      if (user) {
        const updatedUser = {
          ...user,
          name: formData.name,
          email: formData.email,
          department: formData.department,
          year: formData.year,
          rollNumber: formData.rollNumber
        }
        
        // Update localStorage/sessionStorage
        if (localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
        if (sessionStorage.getItem('user')) {
          sessionStorage.setItem('user', JSON.stringify(updatedUser))
        }
        
        setUser(updatedUser)
        setSuccess("Profile updated successfully!")
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (err) {
      setError("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 aurora-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 aurora-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mx-auto max-w-2xl">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-slate-100 mb-4">Access Denied</h1>
              <p className="text-slate-400 mb-6">Please sign in to view your profile.</p>
              <button
                onClick={() => router.push('/login')}
                className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 aurora-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Profile Settings</h1>
            <p className="mt-2 text-slate-400">Manage your account information and preferences</p>
          </div>
          
          {/* Success/Error Messages */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-200">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="px-6 py-6 border-b border-slate-800">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-16 w-16 rounded-full bg-sky-500/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-sky-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-slate-100">{user.name}</h3>
                  <p className="text-sm text-slate-400">{user.email}</p>
                  <p className="text-sm text-slate-400 capitalize">
                    <span className="inline-flex items-center">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      {user.role}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="px-6 py-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <h3 className="text-lg font-medium text-slate-100 mb-4">Personal Information</h3>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <h3 className="text-lg font-medium text-slate-100 mb-4 mt-6">Academic Information</h3>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="department" className="block text-sm font-medium text-slate-300 mb-1">
                    Department
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      name="department"
                      id="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="year" className="block text-sm font-medium text-slate-300 mb-1">
                    Year
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      name="year"
                      id="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="rollNumber" className="block text-sm font-medium text-slate-300 mb-1">
                    Roll Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      name="rollNumber"
                      id="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}