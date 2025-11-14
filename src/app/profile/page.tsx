"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar } from "@/components/avatar"
import { AvatarSelector } from "@/components/avatar-selector"
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
  BookOpen,
  Settings,
  Shield,
  Cake,
  LogOut,
  Phone,
  Briefcase,
  FolderKanban,
  ExternalLink,
  Camera,
  X,
  Smile
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
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const [jobApplications, setJobApplications] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loadingApplications, setLoadingApplications] = useState(false)
  const [loadingProjects, setLoadingProjects] = useState(false)
  const router = useRouter()

  // Get auth token
  const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  // Load user data from database on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch user data from database
        const res = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        if (data.success && data.user) {
          const userData = data.user;
          setUser(userData);
          setProfilePicture(userData.profilePicture || userData.imageUrl || null);
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            department: userData.department || "",
            year: userData.year || "",
            rollNumber: userData.rollNumber || "",
            dateOfBirth: userData.dateOfBirth || "",
            mobileNumber: userData.mobileNumber || ""
          });
          
          // Update localStorage/sessionStorage for backward compatibility
          const storageKey = localStorage.getItem('authToken') ? 'localStorage' : 'sessionStorage';
          if (storageKey === 'localStorage') {
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            sessionStorage.setItem('user', JSON.stringify(userData));
          }
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    
    loadUserData()
  }, [router])

  // Load job applications
  useEffect(() => {
    const loadApplications = async () => {
      if (activeTab !== 'applications' || !user) return;
      
      try {
        setLoadingApplications(true);
        const token = getAuthToken();
        if (!token) return;

        const res = await fetch('/api/job-application?userOnly=true', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setJobApplications(data.data || []);
          }
        }
      } catch (err) {
        console.error("Error loading applications:", err);
      } finally {
        setLoadingApplications(false);
      }
    };

    loadApplications();
  }, [activeTab, user]);

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      if (activeTab !== 'projects' || !user) return;
      
      try {
        setLoadingProjects(true);
        const token = getAuthToken();
        if (!token) return;

        const res = await fetch('/api/auth/my-projects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setProjects(data.data || []);
          }
        }
      } catch (err) {
        console.error("Error loading projects:", err);
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, [activeTab, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      // Convert file to base64 for storage
      const reader = new FileReader()
      reader.onload = async (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          const token = getAuthToken();
          if (!token) {
            setError("Authentication required");
            setIsUploading(false);
            return;
          }

          // Save to database
          const res = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              profilePicture: result
            })
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            setError(data.error || "Failed to update profile picture");
            setIsUploading(false);
            return;
          }

          if (data.user) {
            setProfilePicture(result);
            setUser(data.user);
            
            // Update localStorage/sessionStorage for backward compatibility
            const storageKey = localStorage.getItem('authToken') ? 'localStorage' : 'sessionStorage';
            if (storageKey === 'localStorage') {
              localStorage.setItem('user', JSON.stringify(data.user));
            } else {
              sessionStorage.setItem('user', JSON.stringify(data.user));
            }
            
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
    } catch (err) {
      console.error("Profile picture update error:", err);
      setError("Failed to update profile picture");
      setIsUploading(false);
    }
  }

  const handleRemoveProfilePicture = async () => {
    setIsUploading(true)
    setError("")
    
    try {
      const token = getAuthToken();
      if (!token) {
        setError("Authentication required");
        setIsUploading(false);
        return;
      }

      // Save to database
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profilePicture: null
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to remove profile picture");
        setIsUploading(false);
        return;
      }

      if (data.user) {
        setProfilePicture(null);
        setUser(data.user);
        
        // Update localStorage/sessionStorage for backward compatibility
        const storageKey = localStorage.getItem('authToken') ? 'localStorage' : 'sessionStorage';
        if (storageKey === 'localStorage') {
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          sessionStorage.setItem('user', JSON.stringify(data.user));
        }
        
        setSuccess("Profile picture removed successfully!")
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess("")
        }, 3000)
      }
    } catch (err) {
      console.error("Remove profile picture error:", err);
      setError("Failed to remove profile picture");
    } finally {
      setIsUploading(false);
    }
  }

  const handleAvatarSelect = async (avatarPath: string) => {
    if (!avatarPath || typeof avatarPath !== 'string') {
      setError("Please select a valid avatar");
      setIsUploading(false);
      return;
    }

    setIsUploading(true)
    setError("")
    setSuccess("")
    
    try {
      const token = getAuthToken();
      if (!token) {
        setError("Authentication required. Please log in again.");
        setIsUploading(false);
        return;
      }

      // Save selected avatar to database
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profilePicture: avatarPath
        })
      });

      // Handle response
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        throw new Error("Invalid response from server. Please try again.");
      }

      if (!res.ok) {
        // Extract error message from response
        const errorMessage = data?.error || data?.message || `Server error (${res.status})`;
        throw new Error(errorMessage);
      }

      if (!data || !data.success) {
        const errorMessage = data?.error || data?.message || "Failed to update avatar";
        throw new Error(errorMessage);
      }

      if (!data.user) {
        throw new Error("No user data returned from server");
      }

      // Success - update state
      setProfilePicture(avatarPath);
      setUser(data.user);
      
      // Update localStorage/sessionStorage for backward compatibility
      try {
        const storageKey = localStorage.getItem('authToken') ? 'localStorage' : 'sessionStorage';
        if (storageKey === 'localStorage') {
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          sessionStorage.setItem('user', JSON.stringify(data.user));
        }
      } catch (storageError) {
        console.warn("Failed to update storage:", storageError);
        // Don't throw - this is not critical
      }
      
      setSuccess("Avatar updated successfully!")
      setShowAvatarSelector(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (err: any) {
      console.error("Avatar update error:", err);
      
      // Provide user-friendly error messages
      let errorMessage = "Failed to update avatar. Please try again.";
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.name === 'TypeError' && err?.message?.includes('fetch')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (err?.name === 'SyntaxError') {
        errorMessage = "Invalid response from server. Please try again.";
      }
      
      setError(errorMessage);
      // Don't close modal on error so user can try again
    } finally {
      setIsUploading(false);
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
      const token = getAuthToken();
      if (!token) {
        setError("Authentication required");
        router.push('/login');
        return;
      }

      // Save to database
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          department: formData.department,
          year: formData.year,
          rollNumber: formData.rollNumber,
          dateOfBirth: formData.dateOfBirth,
          mobileNumber: formData.mobileNumber,
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to update profile");
        return;
      }

      if (data.user) {
        // Update local state
        const updatedUser = data.user;
        setUser(updatedUser);
        setProfilePicture(updatedUser.profilePicture || updatedUser.imageUrl || null);
        
        // Update localStorage/sessionStorage for backward compatibility
        const storageKey = localStorage.getItem('authToken') ? 'localStorage' : 'sessionStorage';
        if (storageKey === 'localStorage') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        setSuccess("Profile updated successfully!")
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile. Please try again.")
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
      {/* Avatar Selector Modal */}
      <AvatarSelector
        currentAvatar={profilePicture}
        onSelect={handleAvatarSelect}
        onClose={() => {
          setShowAvatarSelector(false);
          setError(""); // Clear error when closing
        }}
        isOpen={showAvatarSelector}
        error={error}
        isUploading={isUploading}
      />
      
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
                    <Avatar 
                      name={user.name} 
                      src={profilePicture}
                      size="xl" 
                      className="border-4 border-slate-700"
                    />
                    
                    {/* Upload button overlay */}
                    <label
                      htmlFor="profilePicture"
                      className="absolute bottom-0 right-0 bg-sky-600 rounded-full p-2 border-2 border-slate-900 cursor-pointer hover:bg-sky-500 transition-all transform hover:scale-110 shadow-lg z-10"
                      title="Change profile picture"
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4 text-white" />
                      )}
                    </label>
                    
                    {/* Hidden file input */}
                    <input
                      type="file"
                      id="profilePicture"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      disabled={isUploading}
                    />
                  </div>
                  
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-100">{user.name}</h3>
                    <p className="text-sm text-slate-400">{user.email}</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-500/20 text-sky-300">
                      {user.role}
                    </span>
                    
                    {/* Choose Avatar button */}
                    <button
                      onClick={() => setShowAvatarSelector(true)}
                      disabled={isUploading}
                      className="mt-2 text-sm text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 disabled:opacity-50"
                      type="button"
                    >
                      <Smile className="h-3 w-3" />
                      Choose Avatar
                    </button>
                    
                    {/* Remove photo button */}
                    {profilePicture && (
                      <button
                        onClick={handleRemoveProfilePicture}
                        disabled={isUploading}
                        className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 disabled:opacity-50"
                        type="button"
                      >
                        <X className="h-3 w-3" />
                        Remove photo
                      </button>
                    )}
                  </div>
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
                
                <button
                  onClick={() => setActiveTab("applications")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors mt-2 ${
                    activeTab === "applications" 
                      ? "bg-sky-500/20 text-sky-300" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <Briefcase className="h-5 w-5 mr-3" />
                  Job Applications
                </button>
                
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors mt-2 ${
                    activeTab === "projects" 
                      ? "bg-sky-500/20 text-sky-300" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <FolderKanban className="h-5 w-5 mr-3" />
                  My Projects
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
                  {activeTab === "applications" && "Job Applications"}
                  {activeTab === "projects" && "My Projects"}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {activeTab === "profile" && "Update your personal information"}
                  {activeTab === "academic" && "Manage your academic details"}
                  {activeTab === "settings" && "Configure your account preferences"}
                  {activeTab === "security" && "Manage your security settings"}
                  {activeTab === "applications" && "View your job application history"}
                  {activeTab === "projects" && "View your project contributions"}
                </p>
              </div>
              
              {(activeTab === "applications" || activeTab === "projects") ? (
                // Applications and Projects Sections (outside form)
                <div className="px-6 py-6">
                  {activeTab === "applications" && (
                    <div className="space-y-4">
                      {loadingApplications ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                        </div>
                      ) : jobApplications.length === 0 ? (
                        <div className="text-center py-12">
                          <Briefcase className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-slate-100 mb-2">No Applications Yet</h3>
                          <p className="text-slate-400 mb-6">You haven't applied to any jobs yet.</p>
                          <a
                            href="/jobs"
                            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
                          >
                            Browse Jobs <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {jobApplications.map((application: any) => (
                            <div
                              key={application.applicationId}
                              className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-slate-100 mb-1">
                                    {application.jobTitle || 'Unknown Job'}
                                  </h3>
                                  <p className="text-slate-400 text-sm mb-2">{application.company || 'Unknown Company'}</p>
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      application.status === 'submitted' ? 'bg-blue-500/20 text-blue-300' :
                                      application.status === 'under_review' ? 'bg-yellow-500/20 text-yellow-300' :
                                      application.status === 'shortlisted' ? 'bg-purple-500/20 text-purple-300' :
                                      application.status === 'interview_scheduled' ? 'bg-green-500/20 text-green-300' :
                                      application.status === 'hired' ? 'bg-emerald-500/20 text-emerald-300' :
                                      'bg-red-500/20 text-red-300'
                                    }`}>
                                      {application.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-3">
                                    Applied on {new Date(application.submissionDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <a
                                  href={`/jobs/${application.jobId}`}
                                  className="inline-flex items-center text-sm text-sky-400 hover:text-sky-300 transition-colors"
                                >
                                  View Job <ExternalLink className="ml-1 h-4 w-4" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === "projects" && (
                    <div className="space-y-4">
                      {loadingProjects ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                        </div>
                      ) : projects.length === 0 ? (
                        <div className="text-center py-12">
                          <FolderKanban className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-slate-100 mb-2">No Projects Yet</h3>
                          <p className="text-slate-400 mb-6">You haven't contributed to any projects yet.</p>
                          <a
                            href="/work-hub"
                            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
                          >
                            Explore Work Hub <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {projects.map((project: any) => (
                            <div
                              key={project.id}
                              className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-semibold text-slate-100">
                                      {project.title}
                                    </h3>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      project.role === 'owner' ? 'bg-purple-500/20 text-purple-300' :
                                      project.role === 'lead' ? 'bg-blue-500/20 text-blue-300' :
                                      'bg-slate-500/20 text-slate-300'
                                    }`}>
                                      {project.role}
                                    </span>
                                  </div>
                                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                                  <div className="flex flex-wrap gap-2">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      project.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                                      project.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' :
                                      project.status === 'planning' ? 'bg-yellow-500/20 text-yellow-300' :
                                      'bg-slate-500/20 text-slate-300'
                                    }`}>
                                      {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                    <span className="px-2 py-1 rounded text-xs bg-slate-700/50 text-slate-300">
                                      {project.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                    <span className="px-2 py-1 rounded text-xs bg-slate-700/50 text-slate-300">
                                      {project.progress}% Complete
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-3">
                                    {project.role === 'owner' ? 'Created' : 'Joined'} on {new Date(project.joinedAt || project.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <a
                                  href={`/work-hub/projects/${project.id}`}
                                  className="inline-flex items-center text-sm text-sky-400 hover:text-sky-300 transition-colors"
                                >
                                  View Project <ExternalLink className="ml-1 h-4 w-4" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}