"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
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
  const { user, isLoaded } = useUser()
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

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isLoaded || !user) return
      
      try {
        setLoading(true)
        const response = await fetch("/api/auth/profile")
        const data = await response.json()
        
        if (response.ok && data.profile) {
          setProfileData({
            name: data.profile.name || user.fullName || "",
            mobileNumber: data.profile.mobileNumber || "",
            college: data.profile.college || "",
            course: data.profile.course || "",
            department: data.profile.department || "",
            year: data.profile.year || "",
            rollNumber: data.profile.rollNumber || "",
            bio: data.profile.bio || "",
            skills: Array.isArray(data.profile.skills) ? data.profile.skills : [],
            interests: Array.isArray(data.profile.interests) ? data.profile.interests : []
          })
        } else {
          // Initialize with user's name if no profile exists
          setProfileData(prev => ({
            ...prev,
            name: user.fullName || "",
            skills: [],
            interests: []
          }))
        }
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
      setError("");
    } else if (trimmedSkill && profileData.skills.includes(trimmedSkill)) {
      setError("This skill is already added");
    }
  }

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
      setError("");
    } else if (trimmedInterest && profileData.interests.includes(trimmedInterest)) {
      setError("This interest is already added");
    }
  }

  // Add a skill from suggestions
  const addSuggestedSkill = (skill: string) => {
    if (!profileData.skills.includes(skill)) {
      // Limit to 20 skills
      if (profileData.skills.length >= 20) {
        setError("You can add up to 20 skills only");
        return;
      }
      
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setNewSkill("");
      setSuggestedSkills([]);
      setError("");
    } else {
      setError("This skill is already added");
    }
  }

  // Add an interest from suggestions
  const addSuggestedInterest = (interest: string) => {
    if (!profileData.interests.includes(interest)) {
      // Limit to 20 interests
      if (profileData.interests.length >= 20) {
        setError("You can add up to 20 interests only");
        return;
      }
      
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
      setNewInterest("");
      setSuggestedInterests([]);
      setError("");
    } else {
      setError("This interest is already added");
    }
  }

  const removeSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
    
    // Clear error if it was about duplicate skill
    if (error === "This skill is already added" || error === "You can add up to 20 skills only") {
      setError("");
    }
  }

  const removeInterest = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
    
    // Clear error if it was about duplicate interest
    if (error === "This interest is already added" || error === "You can add up to 20 interests only") {
      setError("");
    }
  }

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  const handleInterestKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addInterest()
    }
  }

  // Handle blur events to hide suggestions
  const handleSkillInputBlur = () => {
    // Small delay to allow click events on suggestions to register first
    setTimeout(() => {
      setSuggestedSkills([]);
    }, 150);
  }

  const handleInterestInputBlur = () => {
    // Small delay to allow click events on suggestions to register first
    setTimeout(() => {
      setSuggestedInterests([]);
    }, 150);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")
    
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess("Profile updated successfully!")
        // Update the user's profile in Clerk if needed
        if (user) {
          await user.reload()
        }
      } else {
        // Show more detailed error messages
        if (data.details) {
          // If it's a validation error with details
          const errorMessages = data.details.map((detail: any) => detail.message).join(", ")
          setError(`Validation error: ${errorMessages}`)
        } else {
          setError(data.error || "Failed to update profile")
        }
      }
    } catch (err) {
      console.error("Profile update error:", err)
      setError("Network error. Please try again.")
    } finally {
      setSaving(false)
    }
  }

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
                    aria-label={`Remove skill ${skill}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <div className="flex">
                <input
                  type="text"
                  value={newSkill}
                  onChange={handleSkillInputChange}
                  onBlur={handleSkillInputBlur}
                  onKeyPress={handleSkillKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Add a skill (e.g. JavaScript, React)"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  aria-label="Add skill"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              {/* Suggestions dropdown */}
              {suggestedSkills.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-40 overflow-y-auto">
                  {suggestedSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                      onClick={() => addSuggestedSkill(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Suggestions: {sampleSkills.slice(0, 8).join(", ")}</p>
            </div>
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
                    aria-label={`Remove interest ${interest}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <div className="flex">
                <input
                  type="text"
                  value={newInterest}
                  onChange={handleInterestInputChange}
                  onBlur={handleInterestInputBlur}
                  onKeyPress={handleInterestKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Add an interest (e.g. Web Development, AI)"
                />
                <button
                  type="button"
                  onClick={addInterest}
                  className="px-3 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  aria-label="Add interest"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              {/* Suggestions dropdown */}
              {suggestedInterests.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-40 overflow-y-auto">
                  {suggestedInterests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                      onClick={() => addSuggestedInterest(interest)}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Suggestions: {sampleInterests.slice(0, 8).join(", ")}</p>
            </div>
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
            <p className="mt-1 text-sm text-gray-500">
              {profileData.bio.length}/500 characters
            </p>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}