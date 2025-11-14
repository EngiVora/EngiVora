"use client"

import { useState } from 'react'
import { Calendar, Clock, MapPin, DollarSign, Users, ExternalLink, Share2, BookmarkPlus, FileText, Award, AlertCircle } from 'lucide-react'
import { OptimizedImage } from '@/components/optimized-image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Exam {
  _id: string
  title: string
  description: string
  category: string
  conductingBody: string
  date: string
  time: string
  duration: number // in minutes
  location: string
  isOnline: boolean
  fee: number
  eligibility: string
  syllabus: string[]
  importantDates: Array<{
    event: string
    date: string
  }>
  applicationLink?: string
  brochureLink?: string
  imageUrl?: string
  isActive: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}

interface ExamDetailClientProps {
  exam: Exam
  relatedExams: Exam[]
}

export function ExamDetailClient({ exam, relatedExams }: ExamDetailClientProps) {
  const [isRegistered, setIsRegistered] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const handleRegister = () => {
    if (exam.applicationLink) {
      window.open(exam.applicationLink, '_blank')
    } else {
      setIsRegistered(true)
      // In a real app, this would open a registration form
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // In a real app, this would save to user's bookmarks
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: exam.title,
        text: exam.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setShowShareModal(true)
      setTimeout(() => setShowShareModal(false), 2000)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const isUpcoming = new Date(exam.date) > new Date()
  const isToday = new Date(exam.date).toDateString() === new Date().toDateString()
  const isPast = new Date(exam.date) < new Date()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            {exam.imageUrl ? (
              <OptimizedImage
                src={exam.imageUrl}
                alt={exam.title}
                width={1200}
                height={400}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <Award className="w-16 h-16 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold">{exam.title}</h1>
                </div>
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isToday ? 'bg-orange-500 text-white' :
                isUpcoming ? 'bg-green-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {isToday ? 'Today' : isUpcoming ? 'Upcoming' : 'Past Exam'}
              </span>
            </div>

            {/* Featured Badge */}
            {exam.featured && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-medium">
                  Featured
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  isBookmarked 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark exam"}
              >
                <BookmarkPlus className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-white/20 text-white rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
                aria-label="Share exam"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {exam.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{formatDate(exam.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{formatTime(exam.time)} ({formatDuration(exam.duration)})</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{exam.location}</span>
                    {exam.isOnline && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Online
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-5 h-5 mr-2" />
                    <span>{exam.fee === 0 ? 'Free' : `₹${exam.fee}`}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-2" />
                    <span>Conducted by {exam.conductingBody}</span>
                  </div>
                </div>

                {exam.description && (
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {exam.description}
                  </p>
                )}
              </div>

              <div className="lg:w-80">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {exam.fee === 0 ? 'Free' : `₹${exam.fee}`}
                    </div>
                    <div className="text-gray-600">Registration Fee</div>
                  </div>

                  {isUpcoming && (
                    <button
                      onClick={handleRegister}
                      className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors mb-3"
                    >
                      {exam.applicationLink ? 'Apply Now' : 'Register'}
                    </button>
                  )}

                  {isToday && (
                    <div className="text-center">
                      <div className="flex items-center justify-center text-orange-600 mb-2">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Exam Today!</span>
                      </div>
                      <p className="text-sm text-gray-600">Good luck with your exam!</p>
                    </div>
                  )}

                  {isPast && (
                    <div className="text-center text-gray-500 py-3">
                      This exam has concluded
                    </div>
                  )}

                  {exam.brochureLink && (
                    <a
                      href={exam.brochureLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Download Brochure
                    </a>
                  )}

                  <div className="mt-4 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-medium">{exam.category}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Duration:</span>
                      <span className="font-medium">{formatDuration(exam.duration)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Eligibility */}
            {exam.eligibility && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {exam.eligibility}
                  </p>
                </div>
              </div>
            )}

            {/* Syllabus */}
            {exam.syllabus && exam.syllabus.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Syllabus</h2>
                <div className="space-y-3">
                  {exam.syllabus.map((topic, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{topic}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Important Dates */}
            {exam.importantDates && exam.importantDates.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Dates</h2>
                <div className="space-y-4">
                  {exam.importantDates.map((dateItem, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{dateItem.event}</span>
                      <span className="text-gray-600">{formatDate(dateItem.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Exams */}
            {relatedExams.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Related Exams</h3>
                <div className="space-y-4">
                  {relatedExams.map((relatedExam) => (
                    <Link
                      key={relatedExam._id}
                      href={`/exams/${relatedExam._id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relatedExam.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(relatedExam.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{relatedExam.conductingBody}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Exam Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Exam Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">
                    {formatDistanceToNow(new Date(exam.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-900">
                    {formatDistanceToNow(new Date(exam.updatedAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Exam ID:</span>
                  <span className="text-gray-900 font-mono text-xs">{exam._id.slice(-8)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Link Copied!</h3>
            <p className="text-gray-600">Exam link has been copied to your clipboard.</p>
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
