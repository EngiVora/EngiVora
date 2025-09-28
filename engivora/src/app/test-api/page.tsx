"use client"

import { useState, useEffect } from "react"

export default function TestApiPage() {
  const [profileData, setProfileData] = useState({
    name: "Test User",
    skills: [] as string[],
    interests: [] as string[]
  })
  const [newSkill, setNewSkill] = useState("")
  const [newInterest, setNewInterest] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const addSkill = () => {
    const trimmedSkill = newSkill.trim()
    if (trimmedSkill && !profileData.skills.includes(trimmedSkill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill]
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const addInterest = () => {
    const trimmedInterest = newInterest.trim()
    if (trimmedInterest && !profileData.interests.includes(trimmedInterest)) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, trimmedInterest]
      }))
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }))
  }

  const saveProfile = async () => {
    setIsLoading(true)
    setMessage("")
    
    try {
      const response = await fetch("/api/test-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage("Profile saved successfully!")
      } else {
        setMessage(`Error: ${data.error || "Failed to save profile"}`)
      }
    } catch (error) {
      setMessage("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const loadProfile = async () => {
    setIsLoading(true)
    setMessage("")
    
    try {
      const response = await fetch("/api/test-profile")
      const data = await response.json()
      
      if (response.ok && data.profile) {
        setProfileData({
          name: data.profile.name || "Test User",
          skills: Array.isArray(data.profile.skills) ? data.profile.skills : [],
          interests: Array.isArray(data.profile.interests) ? data.profile.interests : []
        })
        setMessage("Profile loaded successfully!")
      } else {
        setMessage("No profile found.")
      }
    } catch (error) {
      setMessage("Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Test API - Skills & Interests</h1>
        
        {message && (
          <div className="p-3 mb-4 rounded bg-blue-100 text-blue-700">
            {message}
          </div>
        )}
        
        <div className="space-y-6">
          {/* Skills Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-2 min-h-[40px]">
              {profileData.skills.map((skill) => (
                <span 
                  key={skill} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                placeholder="Add a skill"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-3 py-2 bg-blue-600 text-white rounded-r-md"
              >
                Add
              </button>
            </div>
          </div>
          
          {/* Interests Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interests
            </label>
            <div className="flex flex-wrap gap-2 mb-2 min-h-[40px]">
              {profileData.interests.map((interest) => (
                <span 
                  key={interest} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="ml-2 text-green-600 hover:text-green-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                placeholder="Add an interest"
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-3 py-2 bg-green-600 text-white rounded-r-md"
              >
                Add
              </button>
            </div>
          </div>
          
          {/* Debug Info */}
          <div className="p-3 bg-gray-100 rounded">
            <h3 className="font-medium mb-2">Debug Info:</h3>
            <p className="text-sm"><strong>Skills:</strong> {JSON.stringify(profileData.skills)}</p>
            <p className="text-sm"><strong>Interests:</strong> {JSON.stringify(profileData.interests)}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={saveProfile}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Profile"}
            </button>
            <button
              onClick={loadProfile}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Load Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}