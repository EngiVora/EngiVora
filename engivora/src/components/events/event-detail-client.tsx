"use client"

import { useState } from 'react'
import { Calendar, Clock, MapPin, Users, DollarSign, ExternalLink, Share2, BookmarkPlus, User } from 'lucide-react'
import { OptimizedImage } from '@/components/optimized-image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Event {
  _id: string
  title: string
  description: string
  type: string
  status: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location: string
  isOnline: boolean
  maxAttendees: number
  price: number
  organizer: string
  category: string
  tags?: string[]
  featured: boolean
  imageUrl?: string
  requirements?: string
  agenda?: string[]
  createdAt: string
  updatedAt: string
}

interface EventDetailClientProps {
  event: Event
  relatedEvents: Event[]
}

export function EventDetailClient({ event, relatedEvents }: EventDetailClientProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

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

  const handleRegister = () => {
    setIsRegistered(true)
    // In a real app, this would make an API call to register for the event
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // In a real app, this would save to user's bookmarks
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setShowShareModal(true)
      setTimeout(() => setShowShareModal(false), 2000)
    }
  }

  const isUpcoming = new Date(event.startDate) > new Date()
  const isLive = new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date()
  const isPast = new Date(event.endDate) < new Date()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            {event.imageUrl ? (
              <OptimizedImage
                src={event.imageUrl}
                alt={event.title}
                width={1200}
                height={400}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold">{event.title}</h1>
                </div>
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isLive ? 'bg-red-500 text-white' :
                isUpcoming ? 'bg-green-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {isLive ? 'Live Now' : isUpcoming ? 'Upcoming' : 'Past Event'}
              </span>
            </div>

            {/* Featured Badge */}
            {event.featured && (
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
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark event"}
              >
                <BookmarkPlus className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-white/20 text-white rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
                aria-label="Share event"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{event.location}</span>
                    {event.isOnline && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Online
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-2" />
                    <span>Max {event.maxAttendees} attendees</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-5 h-5 mr-2" />
                    <span>{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="w-5 h-5 mr-2" />
                    <span>Organized by {event.organizer}</span>
                  </div>
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:w-80">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </div>
                    <div className="text-gray-600">per person</div>
                  </div>

                  {isUpcoming && (
                    <button
                      onClick={handleRegister}
                      disabled={isRegistered}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                        isRegistered
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isRegistered ? 'Registered ✓' : 'Register Now'}
                    </button>
                  )}

                  {isLive && (
                    <button className="w-full py-3 px-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
                      Join Live Event
                    </button>
                  )}

                  {isPast && (
                    <div className="text-center text-gray-500 py-3">
                      This event has ended
                    </div>
                  )}

                  <div className="mt-4 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-medium">{event.category}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Type:</span>
                      <span className="font-medium">{event.type}</span>
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
            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Agenda</h2>
                <div className="space-y-4">
                  {event.agenda.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {event.requirements && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {event.requirements}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Related Events</h3>
                <div className="space-y-4">
                  {relatedEvents.map((relatedEvent) => (
                    <Link
                      key={relatedEvent._id}
                      href={`/events/${relatedEvent._id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relatedEvent.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(relatedEvent.startDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{relatedEvent.location}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Event Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Event Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">
                    {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-900">
                    {formatDistanceToNow(new Date(event.updatedAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Event ID:</span>
                  <span className="text-gray-900 font-mono text-xs">{event._id.slice(-8)}</span>
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
            <p className="text-gray-600">Event link has been copied to your clipboard.</p>
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
