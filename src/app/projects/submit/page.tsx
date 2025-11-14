"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export default function SubmitProjectPage() {
  const [formData, setFormData] = useState({
    projectTitle: '',
    description: '',
    teamMembers: '',
    technologies: '',
    projectType: '',
    githubLink: '',
    demoLink: '',
    contactEmail: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Project submission:', formData)
    alert('Project submitted successfully! We will review it and get back to you.')
    
    // Reset form
    setFormData({
      projectTitle: '',
      description: '',
      teamMembers: '',
      technologies: '',
      projectType: '',
      githubLink: '',
      demoLink: '',
      contactEmail: ''
    })
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Submit Your Project</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Share your innovative project with the Engivora community. Get featured and inspire other students!
          </p>
        </motion.div>

        {/* Submission Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="bg-slate-900/50 p-8 rounded-2xl backdrop-blur-sm space-y-6">
            {/* Project Title */}
            <div>
              <label htmlFor="projectTitle" className="block text-sm font-medium text-slate-300 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                id="projectTitle"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="Enter your project title"
              />
            </div>

            {/* Project Type */}
            <div>
              <label htmlFor="projectType" className="block text-sm font-medium text-slate-300 mb-2">
                Project Category *
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white"
              >
                <option value="">Select a category</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-app">Mobile App</option>
                <option value="iot">IoT & Hardware</option>
                <option value="ai-ml">AI & Machine Learning</option>
                <option value="robotics">Robotics</option>
                <option value="data-science">Data Science</option>
                <option value="blockchain">Blockchain</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                Project Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="Describe your project, its purpose, and key features"
              />
            </div>

            {/* Team Members */}
            <div>
              <label htmlFor="teamMembers" className="block text-sm font-medium text-slate-300 mb-2">
                Team Members *
              </label>
              <input
                type="text"
                id="teamMembers"
                name="teamMembers"
                value={formData.teamMembers}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="e.g., John Doe, Jane Smith, Mike Johnson"
              />
            </div>

            {/* Technologies Used */}
            <div>
              <label htmlFor="technologies" className="block text-sm font-medium text-slate-300 mb-2">
                Technologies Used *
              </label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="e.g., React, Node.js, Python, Arduino"
              />
            </div>

            {/* GitHub Link */}
            <div>
              <label htmlFor="githubLink" className="block text-sm font-medium text-slate-300 mb-2">
                GitHub Repository (Optional)
              </label>
              <input
                type="url"
                id="githubLink"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="https://github.com/username/project"
              />
            </div>

            {/* Demo Link */}
            <div>
              <label htmlFor="demoLink" className="block text-sm font-medium text-slate-300 mb-2">
                Live Demo Link (Optional)
              </label>
              <input
                type="url"
                id="demoLink"
                name="demoLink"
                value={formData.demoLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="https://your-project-demo.com"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-300 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Submit Project
              </button>
            </div>
          </form>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-slate-800/30 p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-3">Submission Guidelines</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Projects should be original work by students</li>
              <li>• Include clear documentation and setup instructions</li>
              <li>• Provide working demo links when possible</li>
              <li>• We review submissions within 5-7 business days</li>
              <li>• Featured projects may be showcased on our social media</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}