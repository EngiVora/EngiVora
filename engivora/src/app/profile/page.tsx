"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
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
  GraduationCap,
  Camera,
  UserCircle,
  BookOpen,
  Settings,
  Shield,
  Cake,
  LogOut,
  Phone
} from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  department: string
  year?: string
  rollNumber?: string
  dateOfBirth?: string
  mobileNumber?: string
  profilePicture?: string | null
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    year: "",
    rollNumber: "",
    dateOfBirth: "",
    mobileNumber: ""
  })
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
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
            rollNumber: userData.rollNumber || "",
            dateOfBirth: userData.dateOfBirth || "",
            mobileNumber: userData.mobileNumber || ""
          })
          setProfilePicture(userData.profilePicture || null)
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
            rollNumber: userData.rollNumber || "",
            dateOfBirth: userData.dateOfBirth || "",
            mobileNumber: userData.mobileNumber || ""
          })
          setProfilePicture(userData.profilePicture || null)
          setLoading(false)
          return
        }
        
        // If no user data found, redirect to login
        router.push('/login')
      } catch (_err) {
        console.error("Error loading user data:", _err)
        // Even if there's an error parsing, redirect to login
        router.push('/login')
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

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    setIsUploading(true)
    setError("")

    // In a real app, you would upload to a server
    // For now, we'll use FileReader to preview the image
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        setProfilePicture(result)
        
        // Update user data with new profile picture
        if (user) {
          const updatedUser = {
            ...user,
            profilePicture: result
          }
          
          // Update localStorage/sessionStorage
          if (localStorage.getItem('user')) {
            localStorage.setItem('user', JSON.stringify(updatedUser))
          }
          if (sessionStorage.getItem('user')) {
            sessionStorage.setItem('user', JSON.stringify(updatedUser))
          }
          
          setUser(updatedUser)
          setSuccess("Profile picture updated successfully!")
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccess("")
          }, 3000)
        }
      }
      setIsUploading(false)
    }
    reader.onerror = () => {
      setError("Failed to read image file")
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null)
    setIsUploading(false)
    setError("")
    
    // Update user data to remove profile picture
    if (user) {
      const updatedUser = {
        ...user,
        profilePicture: null
      }
      
      // Update localStorage/sessionStorage
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      if (sessionStorage.getItem('user')) {
        sessionStorage.setItem('user', JSON.stringify(updatedUser))
      }
      
      setUser(updatedUser)
      setSuccess("Profile picture removed successfully!")
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    }
  }

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Remove auth data from both localStorage and sessionStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("user");
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("authStateChange"));

      // Redirect to home page
      router.push("/");
    }
  };

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
          rollNumber: formData.rollNumber,
          dateOfBirth: formData.dateOfBirth,
          mobileNumber: formData.mobileNumber,
          profilePicture: profilePicture || undefined
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Profile Settings</h1>
            <p className="mt-2 text-slate-400">Manage your account information and preferences</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-red-600/20 text-red-300 rounded-md hover:bg-red-600/30 transition-colors border border-red-600/30"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-800">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                      {profilePicture ? (
                        <Image 
                          src={profilePicture} 
                          alt="Profile" 
                          className="h-full w-full object-cover"
                          width={96}
                          height={96}
                        />
                      ) : (
                        <UserCircle className="h-16 w-16 text-slate-500" />
                      )}
                    </div>
                    <input
                      type="file"
                      id="profilePicture"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      disabled={isUploading}
                    />
                    <label 
                      htmlFor="profilePicture"
                      className="absolute bottom-0 right-0 bg-slate-800 rounded-full p-2 border-2 border-slate-900 cursor-pointer hover:bg-slate-700 transition-colors"
                      aria-label="Change profile picture"
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 text-slate-300 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4 text-slate-300" />
                      )}
                    </label>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-100">{user.name}</h3>
                  <p className="text-sm text-slate-400">{user.email}</p>
                  <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-500/20 text-sky-300">
                    {user.role}
                  </span>
                  {profilePicture && (
                    <button
                      onClick={handleRemoveProfilePicture}
                      className="mt-3 text-sm text-red-400 hover:text-red-300 transition-colors"
                      type="button"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>
              
              <nav className="p-4">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "profile" 
                      ? "bg-sky-500/20 text-sky-300" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  Profile Information
                </button>
                
                <button
                  onClick={() => setActiveTab("academic")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors mt-2 ${
                    activeTab === "academic" 
                      ? "bg-sky-500/20 text-sky-300" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <BookOpen className="h-5 w-5 mr-3" />
                  Academic Details
                </button>
                
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors mt-2 ${
                    activeTab === "settings" 
                      ? "bg-sky-500/20 text-sky-300" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Account Settings
                </button>
                
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors mt-2 ${
                    activeTab === "security" 
                      ? "bg-sky-500/20 text-sky-300" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <Shield className="h-5 w-5 mr-3" />
                  Security
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
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
              <div className="px-6 py-4 border-b border-slate-800">
                <h2 className="text-xl font-bold text-slate-100">
                  {activeTab === "profile" && "Profile Information"}
                  {activeTab === "academic" && "Academic Details"}
                  {activeTab === "settings" && "Account Settings"}
                  {activeTab === "security" && "Security"}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {activeTab === "profile" && "Update your personal information"}
                  {activeTab === "academic" && "Manage your academic details"}
                  {activeTab === "settings" && "Configure your account preferences"}
                  {activeTab === "security" && "Manage your security settings"}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="px-6 py-6">
                {activeTab === "profile" && (
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <h3 className="text-lg font-medium text-slate-100 mb-4">Personal Information</h3>
                    </div>
                    
                    <div className="sm:col-span-6">
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
                          className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm py-3"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
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
                          className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm py-3"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-300 mb-1">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Cake className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                          type="date"
                          name="dateOfBirth"
                          id="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm py-3"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="mobileNumber" className="block text-sm font-medium text-slate-300 mb-1">
                        Mobile Number <span className="text-slate-500 text-xs">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                          type="tel"
                          name="mobileNumber"
                          id="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm py-3"
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "academic" && (
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <h3 className="text-lg font-medium text-slate-100 mb-4 mt-6">Academic Information</h3>
                    </div>
                    
                    <div className="sm:col-span-6">
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
                          className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm py-3"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
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
                          className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm py-3"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
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
                          className="pl-10 block w-full rounded-lg border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-inset sm:text-sm py-3"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {(activeTab === "settings" || activeTab === "security") && (
                  <div className="text-center py-12">
                    <div className="mx-auto h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center">
                      <Settings className="h-8 w-8 text-slate-500" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-slate-100">
                      {activeTab === "settings" ? "Account Settings" : "Security"}
                    </h3>
                    <p className="mt-2 text-sm text-slate-400">
                      {activeTab === "settings" 
                        ? "Account settings will be available soon." 
                        : "Security settings will be available soon."}
                    </p>
                  </div>
                )}
                
                {(activeTab === "profile" || activeTab === "academic") && (
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
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}