"use client"

import { useState } from "react"

interface ApiResponse {
  success?: boolean
  error?: string
  message?: string
  profile?: Record<string, unknown>
  details?: Array<Record<string, unknown>>
}

export default function DebugProfilePage() {
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [newInterest, setNewInterest] = useState("")
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const addSkill = () => {
    const trimmedSkill = newSkill.trim()
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills(prev => [...prev, trimmedSkill])
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill))
  }

  const addInterest = () => {
    const trimmedInterest = newInterest.trim()
    if (trimmedInterest && !interests.includes(trimmedInterest)) {
      setInterests(prev => [...prev, trimmedInterest])
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setInterests(prev => prev.filter(i => i !== interest))
  }

  const testApi = async () => {
    setLoading(true)
    setResponse(null)
    
    try {
      const testData = {
        name: "Test User",
        mobileNumber: "1234567890",
        college: "Test College",
        course: "B.Tech",
        department: "Computer Science",
        year: "3rd Year",
        skills: skills,
        interests: interests
      }
      
      console.log("Sending data:", testData)
      
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      })
      
      const data = await res.json()
      console.log("Response:", data)
      setResponse(data)
    } catch (error) {
      console.error("Error:", error)
      setResponse({ error: "Network error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Debug Profile API</h1>
        
        {/* Skills Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills
          </label>
          <div className="flex flex-wrap gap-2 mb-2 min-h-[40px]">
            {skills.map((skill) => (
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
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interests
          </label>
          <div className="flex flex-wrap gap-2 mb-2 min-h-[40px]">
            {interests.map((interest) => (
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
        <div className="p-3 bg-gray-100 rounded mb-6">
          <h3 className="font-medium mb-2">Debug Info:</h3>
          <p className="text-sm"><strong>Skills:</strong> {JSON.stringify(skills)}</p>
          <p className="text-sm"><strong>Interests:</strong> {JSON.stringify(interests)}</p>
        </div>
        
        <button
          onClick={testApi}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test API"}
        </button>
        
        {response && (
          <div className="mt-6 p-3 bg-gray-100 rounded">
            <h3 className="font-medium mb-2">API Response:</h3>
            <pre className="text-sm overflow-auto">{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}