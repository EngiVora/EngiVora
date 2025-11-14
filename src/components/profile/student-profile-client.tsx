"use client"

import { useState } from 'react'
import { Mail, Phone, MapPin, Calendar, GraduationCap, Award, Code, Users, ExternalLink, Share2, MessageCircle, BookmarkPlus } from 'lucide-react'
import { OptimizedImage } from '@/components/optimized-image'
import { Avatar } from '@/components/avatar'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Student {
  _id: string
  name: string
  email: string
  phone?: string
  college?: string
  yearOfStudy?: string
  branch?: string
  bio?: string
  skills?: string[]
  interests?: string[]
  profilePicture?: string
  coverPicture?: string
  location?: string
  dateOfBirth?: string
  github?: string
  linkedin?: string
  portfolio?: string
  resume?: string
  projects?: Array<{
    title: string
    description: string
    technologies: string[]
    link?: string
  }>
  achievements?: Array<{
    title: string
    description: string
    date: string
    organization?: string
  }>
  experience?: Array<{
    company: string
    position: string
    duration: string
    description: string
  }>
  createdAt: string
  updatedAt: string
}

interface StudentProfileClientProps {
  student: Student
  relatedStudents: Student[]
}

export function StudentProfileClient({ student, relatedStudents }: StudentProfileClientProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'projects' | 'experience' | 'achievements'>('about')
  const [isFollowing, setIsFollowing] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // In a real app, this would make an API call to follow/unfollow
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${student.name} - Student Profile`,
        text: `Check out ${student.name}'s profile on EngiVora`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setShowShareModal(true)
      setTimeout(() => setShowShareModal(false), 2000)
    }
  }

  const handleMessage = () => {
    // In a real app, this would open a messaging interface
    console.log('Open messaging with', student.name)
  }

  const tabs = [
    { id: 'about' as const, label: 'About', icon: Users },
    { id: 'projects' as const, label: 'Projects', icon: Code },
    { id: 'experience' as const, label: 'Experience', icon: Award },
    { id: 'achievements' as const, label: 'Achievements', icon: Award },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cover Photo & Profile Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="relative h-48 md:h-64">
            {student.coverPicture ? (
              <OptimizedImage
                src={student.coverPicture}
                alt={`${student.name} cover`}
                width={1200}
                height={300}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
            )}
            
            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <Avatar name={student.name} src={student.profilePicture} size="xl" className="w-full h-full" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={handleShare}
                className="p-2 bg-white/20 text-white rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
                aria-label="Share profile"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                className="p-2 bg-white/20 text-white rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
                aria-label="Bookmark profile"
              >
                <BookmarkPlus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 pb-6 px-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {student.name}
                </h1>
                
                {student.college && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    <span>{student.college}</span>
                  </div>
                )}

                {student.yearOfStudy && student.branch && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{student.yearOfStudy} Year, {student.branch}</span>
                  </div>
                )}

                {student.location && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{student.location}</span>
                  </div>
                )}

                {student.bio && (
                  <p className="text-gray-700 leading-relaxed mb-4 max-w-2xl">
                    {student.bio}
                  </p>
                )}

                {/* Social Links */}
                <div className="flex gap-4">
                  {student.github && (
                    <a
                      href={student.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      GitHub
                    </a>
                  )}
                  {student.linkedin && (
                    <a
                      href={student.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      LinkedIn
                    </a>
                  )}
                  {student.portfolio && (
                    <a
                      href={student.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Portfolio
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleMessage}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </button>
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        {student.skills && student.skills.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* About Tab */}
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    {student.interests && student.interests.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {student.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Info</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            <span>{student.email}</span>
                          </div>
                          {student.phone && (
                            <div className="flex items-center text-gray-600">
                              <Phone className="w-4 h-4 mr-2" />
                              <span>{student.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Profile Info</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Joined:</span>
                            <span className="text-gray-900">
                              {formatDistanceToNow(new Date(student.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Active:</span>
                            <span className="text-gray-900">
                              {formatDistanceToNow(new Date(student.updatedAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    {student.projects && student.projects.length > 0 ? (
                      student.projects.map((project, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View Project
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No projects added yet</p>
                    )}
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    {student.experience && student.experience.length > 0 ? (
                      student.experience.map((exp, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                          <p className="text-blue-600 font-medium">{exp.company}</p>
                          <p className="text-gray-600 text-sm mb-2">{exp.duration}</p>
                          <p className="text-gray-700">{exp.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No experience added yet</p>
                    )}
                  </div>
                )}

                {/* Achievements Tab */}
                {activeTab === 'achievements' && (
                  <div className="space-y-6">
                    {student.achievements && student.achievements.length > 0 ? (
                      student.achievements.map((achievement, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Award className="w-6 h-6 text-yellow-500 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {achievement.title}
                              </h3>
                              {achievement.organization && (
                                <p className="text-blue-600 font-medium">{achievement.organization}</p>
                              )}
                              <p className="text-gray-600 text-sm mb-2">{achievement.date}</p>
                              <p className="text-gray-700">{achievement.description}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No achievements added yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Students */}
            {relatedStudents.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Similar Students</h3>
                <div className="space-y-4">
                  {relatedStudents.map((relatedStudent) => (
                    <Link
                      key={relatedStudent._id}
                      href={`/profile/${relatedStudent._id}`}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <Avatar name={relatedStudent.name} src={relatedStudent.profilePicture} size="sm" className="w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {relatedStudent.name}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {relatedStudent.college}
                        </p>
                        {relatedStudent.skills && relatedStudent.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {relatedStudent.skills.slice(0, 2).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Link Copied!</h3>
            <p className="text-gray-600">Profile link has been copied to your clipboard.</p>
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
