"use client"

import { useState, useEffect } from "react"
import { Loader2, Save, AlertCircle, CheckCircle, X, Plus } from "lucide-react"

interface ProfileData {
  name: string
  mobileNumber: string
  college: string
  course: string
  department: string
  year: string
  rollNumber: string
  bio: string
  skills: string[]
  interests: string[]
}

const collegeYears = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year",
]

const courses = [
  "B.Tech",
  "M.Tech",
  "B.E.",
  "M.E.",
  "B.Sc",
  "M.Sc",
  "BCA",
  "MCA",
  "BBA",
  "MBA",
  "Other"
]

const departments = [
  "Computer Science Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Information Technology",
  "Electronics & Communication Engineering",
  "Aerospace Engineering",
  "Production Engineering",
  "Other"
]

// Sample skills and interests for suggestions
const sampleSkills = [
  "JavaScript", "React", "Node.js", "Python", "Java", "C++", "HTML", "CSS",
  "SQL", "MongoDB", "Git", "Docker", "AWS", "Azure", "Machine Learning",
  "Data Analysis", "UI/UX Design", "Project Management", "Communication",
  "TypeScript", "Next.js", "Express", "Vue.js", "Angular", "Svelte",
  "PostgreSQL", "MySQL", "Redis", "GraphQL", "RESTful APIs"
]

const sampleInterests = [
  "Web Development", "Mobile Apps", "AI/Machine Learning", "Data Science",
  "Cybersecurity", "Cloud Computing", "DevOps", "UI/UX Design", "Game Development",
  "Blockchain", "IoT", "Robotics", "Entrepreneurship", "Research", "Open Source",
  "Mobile Development", "Backend Development", "Frontend Development", 
  "Full Stack Development", "Database Design", "System Architecture"
]

export function CustomProfileForm() {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    mobileNumber: "",
    college: "",
    course: "",
    department: "",
    year: "",
    rollNumber: "",
    bio: "",
    skills: [],
    interests: []
  })
  const [newSkill, setNewSkill] = useState("")
  const [newInterest, setNewInterest] = useState("")
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([])
  const [suggestedInterests, setSuggestedInterests] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // Check localStorage first
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setProfileData(prev => ({
            ...prev,
            name: userData.name || "",
          }))
          setIsLoaded(true)
          setLoading(false)
          return
        }
        
        // Check sessionStorage as fallback
        const sessionUser = sessionStorage.getItem('user')
        if (sessionUser) {
          const userData = JSON.parse(sessionUser)
          setUser(userData)
          setProfileData(prev => ({
            ...prev,
            name: userData.name || "",
          }))
          setIsLoaded(true)
          setLoading(false)
          return
        }
        
        // If no user data found
        setIsLoaded(true)
        setLoading(false)
      } catch (err) {
        console.error("Error checking auth status:", err)
        setIsLoaded(true)
        setLoading(false)
      }
    }
    
    checkAuthStatus()
  }, [])

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isLoaded || !user) return
      
      try {
        setLoading(true)
        // In a real app, you would fetch from your API
        // For now, we'll just initialize with user's name
        setProfileData(prev => ({
          ...prev,
          name: user.name || "",
          skills: [],
          interests: []
        }))
      } catch (err) {
        console.error("Failed to fetch profile data:", err)
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfileData()
  }, [isLoaded, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error messages when user starts typing
    if (error) setError("")
    if (success) setSuccess("")
  }

  // Handle skill input changes and show suggestions
  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewSkill(value);
    
    // Show suggestions based on input
    if (value.trim()) {
      const filtered = sampleSkills.filter(skill => 
        skill.toLowerCase().includes(value.toLowerCase()) && 
        !profileData.skills.includes(skill)
      );
      setSuggestedSkills(filtered.slice(0, 5));
    } else {
      setSuggestedSkills([]);
    }
    
    // Clear error messages
    if (error) setError("");
    if (success) setSuccess("");
  }

  // Handle interest input changes and show suggestions
  const handleInterestInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewInterest(value);
    
    // Show suggestions based on input
    if (value.trim()) {
      const filtered = sampleInterests.filter(interest => 
        interest.toLowerCase().includes(value.toLowerCase()) && 
        !profileData.interests.includes(interest)
      );
      setSuggestedInterests(filtered.slice(0, 5));
    } else {
      setSuggestedInterests([]);
    }
    
    // Clear error messages
    if (error) setError("");
    if (success) setSuccess("");
  }

  const addSkill = () => {
    const trimmedSkill = newSkill.trim();
    
    if (trimmedSkill && !profileData.skills.includes(trimmedSkill)) {
      // Limit to 20 skills
      if (profileData.skills.length >= 20) {
        setError("You can add up to 20 skills only");
        return;
      }
      
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill]
      }));
      setNewSkill("");
      setSuggestedSkills([]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addInterest = () => {
    const trimmedInterest = newInterest.trim();
    
    if (trimmedInterest && !profileData.interests.includes(trimmedInterest)) {
      // Limit to 20 interests
      if (profileData.interests.length >= 20) {
        setError("You can add up to 20 interests only");
        return;
      }
      
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, trimmedInterest]
      }));
      setNewInterest("");
      setSuggestedInterests([]);
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleInterestKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addInterest();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    
    try {
      // In a real app, you would send this data to your API
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess("Profile updated successfully!");
      
      // Update user data in localStorage/sessionStorage
      if (user) {
        const updatedUser = {
          ...user,
          name: profileData.name
        };
        
        if (localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        if (sessionStorage.getItem('user')) {
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}
        
        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span className="text-sm text-green-600">{success}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter your full name"
            />
          </div>
          
          {/* Mobile Number */}
          <div className="md:col-span-2">
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number *
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={profileData.mobileNumber}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter your mobile number"
            />
          </div>
          
          {/* College */}
          <div className="md:col-span-2">
            <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-2">
              College/University *
            </label>
            <input
              type="text"
              id="college"
              name="college"
              value={profileData.college}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter your college/university name"
            />
          </div>
          
          {/* Course */}
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
              Course *
            </label>
            <select
              id="course"
              name="course"
              value={profileData.course}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Select your course</option>
              {courses.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>
          
          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <select
              id="department"
              name="department"
              value={profileData.department}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Select your department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          {/* College Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              College Year *
            </label>
            <select
              id="year"
              name="year"
              value={profileData.year}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Select your college year</option>
              {collegeYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          {/* Roll Number */}
          <div>
            <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Roll Number
            </label>
            <input
              type="text"
              id="rollNumber"
              name="rollNumber"
              value={profileData.rollNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter your roll number"
            />
          </div>
          
          {/* Skills */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-2 min-h-[42px]">
              {profileData.skills.map((skill) => (
                <span 
                  key={skill} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 transition-all hover:bg-blue-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-900 focus:outline-none"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={newSkill}
                onChange={handleSkillInputChange}
                onKeyDown={handleSkillKeyDown}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Type a skill and press Enter or comma"
              />
              <button
                type="button"
                onClick={addSkill}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
                aria-label="Add skill"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {suggestedSkills.length > 0 && (
              <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-sm max-h-40 overflow-y-auto">
                {suggestedSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      setNewSkill(skill);
                      setTimeout(() => addSkill(), 0);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Interests */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interests
            </label>
            <div className="flex flex-wrap gap-2 mb-2 min-h-[42px]">
              {profileData.interests.map((interest) => (
                <span 
                  key={interest} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 transition-all hover:bg-green-200"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="ml-2 text-green-600 hover:text-green-900 focus:outline-none"
                    aria-label={`Remove ${interest}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={newInterest}
                onChange={handleInterestInputChange}
                onKeyDown={handleInterestKeyDown}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Type an interest and press Enter or comma"
              />
              <button
                type="button"
                onClick={addInterest}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800"
                aria-label="Add interest"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {suggestedInterests.length > 0 && (
              <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-sm max-h-40 overflow-y-auto">
                {suggestedInterests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => {
                      setNewInterest(interest);
                      setTimeout(() => addInterest(), 0);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                  >
                    {interest}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Bio */}
          <div className="md:col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}