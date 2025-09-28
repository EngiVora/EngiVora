"use client"

import { useState, useEffect } from "react"

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

export default function TestProfilePage() {
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
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setMessageType("")

    try {
      // Simulate API call
      console.log("Sending profile data:", profileData)
      
      // In a real app, you would make an API call here:
      // const response = await fetch("/api/auth/profile", {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(profileData),
      // })
      
      // For testing purposes, we'll just show a success message
      setMessage("Profile updated successfully!")
      setMessageType("success")
    } catch (error) {
      setMessage("Failed to update profile")
      setMessageType("error")
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Test Profile Form</h1>
        
        {message && (
          <div className={`p-3 rounded mb-4 ${messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your name"
            />
          </div>
          
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
          
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  )
}