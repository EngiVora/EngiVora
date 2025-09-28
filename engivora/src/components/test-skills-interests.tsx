"use client"

import { useState } from "react"

export function TestSkillsInterests() {
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [newInterest, setNewInterest] = useState("")

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

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Test Skills & Interests</h2>
      
      {/* Skills Test */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Skills:</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.map((skill) => (
            <span 
              key={skill} 
              className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-1 text-blue-600 hover:text-blue-900"
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
            className="flex-1 px-2 py-1 border rounded-l"
            placeholder="Add a skill"
          />
          <button
            onClick={addSkill}
            className="px-3 py-1 bg-blue-600 text-white rounded-r"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Interests Test */}
      <div>
        <h3 className="font-medium mb-2">Interests:</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {interests.map((interest) => (
            <span 
              key={interest} 
              className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-green-100 text-green-800"
            >
              {interest}
              <button
                onClick={() => removeInterest(interest)}
                className="ml-1 text-green-600 hover:text-green-900"
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
            className="flex-1 px-2 py-1 border rounded-l"
            placeholder="Add an interest"
          />
          <button
            onClick={addInterest}
            className="px-3 py-1 bg-green-600 text-white rounded-r"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Debug Info */}
      <div className="mt-4 p-2 bg-gray-100 rounded">
        <p className="text-sm"><strong>Skills:</strong> {JSON.stringify(skills)}</p>
        <p className="text-sm"><strong>Interests:</strong> {JSON.stringify(interests)}</p>
      </div>
    </div>
  )
}