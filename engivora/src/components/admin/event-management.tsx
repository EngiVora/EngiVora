"use client"

import { useState } from "react"
import Image from "next/image"
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  MapPin,
  Users,
  Clock,
  Plus,
  Download,
  Upload,
  Globe,
  Lock,
  Star,
  TrendingUp,
  Video,
  Mic,
  Camera,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  Pause
} from "lucide-react"

interface Event {
  id: number
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
  registeredAttendees: number
  price: number
  organizer: string
  category: string
  tags: string[]
  featured: boolean
  imageUrl: string
  requirements: string
  agenda: string[]
  // Add image preview field
  imagePreview?: string
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Engineering Career Fair 2024",
    description: "Annual career fair connecting engineering students with top companies",
    type: "Career Fair",
    status: "Upcoming",
    startDate: "2024-03-15",
    endDate: "2024-03-15",
    startTime: "09:00",
    endTime: "17:00",
    location: "IIT Delhi, New Delhi",
    isOnline: false,
    maxAttendees: 500,
    registeredAttendees: 234,
    price: 0,
    organizer: "IIT Delhi Placement Cell",
    category: "Career",
    tags: ["Career", "Networking", "Jobs"],
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
    requirements: "Valid student ID required",
    agenda: [
      "09:00 - Registration & Welcome",
      "10:00 - Company Presentations",
      "12:00 - Lunch Break",
      "13:00 - Networking Session",
      "15:00 - Interview Sessions",
      "17:00 - Closing Remarks"
    ]
  },
  {
    id: 2,
    title: "AI in Engineering Workshop",
    description: "Hands-on workshop on implementing AI solutions in engineering projects",
    type: "Workshop",
    status: "Live",
    startDate: "2024-02-20",
    endDate: "2024-02-20",
    startTime: "14:00",
    endTime: "18:00",
    location: "Online",
    isOnline: true,
    maxAttendees: 100,
    registeredAttendees: 89,
    price: 500,
    organizer: "TechCorp Academy",
    category: "Education",
    tags: ["AI", "Workshop", "Technology"],
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop",
    requirements: "Basic programming knowledge",
    agenda: [
      "14:00 - Introduction to AI",
      "14:30 - Hands-on Coding",
      "16:00 - Break",
      "16:15 - Real-world Applications",
      "17:30 - Q&A Session",
      "18:00 - Workshop Ends"
    ]
  },
  {
    id: 3,
    title: "Engineering Innovation Summit",
    description: "Annual summit showcasing latest innovations in engineering",
    type: "Conference",
    status: "Completed",
    startDate: "2024-01-25",
    endDate: "2024-01-27",
    startTime: "08:00",
    endTime: "20:00",
    location: "Bangalore Convention Centre",
    isOnline: false,
    maxAttendees: 1000,
    registeredAttendees: 856,
    price: 2000,
    organizer: "Engineering Society of India",
    category: "Conference",
    tags: ["Innovation", "Technology", "Networking"],
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
    requirements: "Professional registration",
    agenda: [
      "Day 1: Keynote & Panel Discussions",
      "Day 2: Technical Sessions",
      "Day 3: Innovation Showcase"
    ]
  },
  {
    id: 4,
    title: "Webinar: Future of Renewable Energy",
    description: "Expert panel discussion on renewable energy trends and opportunities",
    type: "Webinar",
    status: "Scheduled",
    startDate: "2024-03-10",
    endDate: "2024-03-10",
    startTime: "19:00",
    endTime: "20:30",
    location: "Online",
    isOnline: true,
    maxAttendees: 200,
    registeredAttendees: 45,
    price: 0,
    organizer: "Green Energy Foundation",
    category: "Webinar",
    tags: ["Renewable Energy", "Sustainability", "Future"],
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=200&fit=crop",
    requirements: "Registration required",
    agenda: [
      "19:00 - Welcome & Introduction",
      "19:15 - Expert Panel Discussion",
      "20:00 - Q&A Session",
      "20:30 - Closing"
    ]
  },
  {
    id: 5,
    title: "Hackathon: Smart City Solutions",
    description: "48-hour hackathon to develop innovative smart city solutions",
    type: "Hackathon",
    status: "Cancelled",
    startDate: "2024-02-28",
    endDate: "2024-03-01",
    startTime: "18:00",
    endTime: "18:00",
    location: "Tech Hub Mumbai",
    isOnline: false,
    maxAttendees: 150,
    registeredAttendees: 67,
    price: 0,
    organizer: "Smart City Initiative",
    category: "Competition",
    tags: ["Hackathon", "Smart City", "Innovation"],
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop",
    requirements: "Team of 2-4 members",
    agenda: [
      "Day 1: Problem Statement & Team Formation",
      "Day 2: Development & Presentation"
    ]
  }
]

export function EventManagement() {
  const [events, setEvents] = useState(mockEvents)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedEvents, setSelectedEvents] = useState<number[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalEvent, setModalEvent] = useState<Event | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || event.type === selectedType
    const matchesStatus = selectedStatus === "all" || event.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleSelectEvent = (eventId: number) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    )
  }

  const handleSelectAll = () => {
    setSelectedEvents(
      selectedEvents.length === filteredEvents.length 
        ? [] 
        : filteredEvents.map(event => event.id)
    )
  }

  const handleEventAction = (eventId: number, action: string) => {
    console.log(`Action: ${action} for event: ${eventId}`)
    // Implement event actions here
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming": return "bg-blue-100 text-blue-800"
      case "Live": return "bg-green-100 text-green-800"
      case "Completed": return "bg-gray-100 text-gray-800"
      case "Scheduled": return "bg-yellow-100 text-yellow-800"
      case "Cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Upcoming": return <Clock className="h-4 w-4" />
      case "Live": return <Play className="h-4 w-4" />
      case "Completed": return <CheckCircle className="h-4 w-4" />
      case "Scheduled": return <Calendar className="h-4 w-4" />
      case "Cancelled": return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Career Fair": return "bg-blue-100 text-blue-800"
      case "Workshop": return "bg-green-100 text-green-800"
      case "Conference": return "bg-purple-100 text-purple-800"
      case "Webinar": return "bg-orange-100 text-orange-800"
      case "Hackathon": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const isEventLive = (event: Event) => {
    const now = new Date()
    const start = new Date(`${event.startDate} ${event.startTime}`)
    const end = new Date(`${event.endDate} ${event.endTime}`)
    return now >= start && now <= end && event.status === "Live"
  }

  const isEventUpcoming = (event: Event) => {
    const now = new Date()
    const start = new Date(`${event.startDate} ${event.startTime}`)
    return now < start && event.status === "Upcoming"
  }

  const openModal = (event?: Event) => {
    setModalEvent(event || null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalEvent(null)
  }

  const handleModalSubmit = (data: any) => {
    setIsSubmitting(true)
    setTimeout(() => {
      if (modalEvent) {
        setEvents(prevEvents => prevEvents.map(event => 
          event.id === modalEvent.id ? { ...event, ...data } : event
        ))
      } else {
        setEvents(prevEvents => [...prevEvents, { ...data, id: events.length + 1 }])
      }
      closeModal()
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600">Manage events, workshops, conferences, and webinars</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <Play className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Live Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === "Live").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Attendees</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.reduce((sum, e) => sum + e.registeredAttendees, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === "Upcoming").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="Career Fair">Career Fair</option>
              <option value="Workshop">Workshop</option>
              <option value="Conference">Conference</option>
              <option value="Webinar">Webinar</option>
              <option value="Hackathon">Hackathon</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Live">Live</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            {selectedEvents.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedEvents.length} selected
              </span>
            )}
            <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEvents.length === filteredEvents.length && filteredEvents.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendees
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event.id)}
                      onChange={() => handleSelectEvent(event.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-16 w-24">
                        <Image
                          className="h-16 w-24 rounded-lg object-cover"
                          src={event.imageUrl}
                          alt={event.title}
                          width={96}
                          height={64}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                          {event.featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="text-xs text-gray-500">by {event.organizer}</span>
                          {event.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {new Date(event.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        {event.startTime} - {event.endTime}
                      </div>
                      {event.startDate !== event.endDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          to {new Date(event.endDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        {event.isOnline ? (
                          <Globe className="h-4 w-4 text-gray-400 mr-1" />
                        ) : (
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        )}
                        {event.location}
                      </div>
                      {event.isOnline && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                          Online
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                      <span className="ml-1">{event.status}</span>
                    </span>
                    {isEventLive(event) && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></div>
                          Live Now
                        </span>
                      </div>
                    )}
                    {isEventUpcoming(event) && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Upcoming
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        {event.registeredAttendees} / {event.maxAttendees}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(event.registeredAttendees / event.maxAttendees) * 100}%` }}
                        ></div>
                      </div>
                      {event.price > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          ₹{event.price} per person
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEventAction(event.id, "view")}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openModal(event)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEventAction(event.id, "attendees")}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Users className="h-4 w-4" />
                      </button>
                      {event.isOnline && (
                        <button
                          onClick={() => handleEventAction(event.id, "stream")}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Video className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEventAction(event.id, "delete")}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredEvents.length}</span> of{' '}
                <span className="font-medium">{filteredEvents.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          event={modalEvent}
          isLoading={isSubmitting}
        />
      )}
    </div>
  )
}

function EventModal({ isOpen, onClose, onSubmit, event, isLoading }: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  event?: Event | null
  isLoading: boolean
}) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    type: event?.type || 'Workshop',
    status: event?.status || 'Scheduled',
    startDate: event?.startDate || '',
    endDate: event?.endDate || '',
    startTime: event?.startTime || '09:00',
    endTime: event?.endTime || '17:00',
    location: event?.location || '',
    isOnline: event?.isOnline || false,
    maxAttendees: event?.maxAttendees || 100,
    price: event?.price || 0,
    organizer: event?.organizer || '',
    category: event?.category || 'Education',
    tags: event?.tags?.join(', ') || '',
    featured: event?.featured || false,
    requirements: event?.requirements || '',
    agenda: event?.agenda?.join('\n') || '',
    // Add image URL field
    imageUrl: event?.imageUrl || '',
  })
  
  // Add image preview state
  const [imagePreview, setImagePreview] = useState<string | null>(event?.imageUrl || null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Add image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // For now, we'll just show a preview - in a real app, you would upload to a service
    // and get back a URL to store in the database
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
      // In a real implementation, you would upload the file to a service here
      // and set the imageUrl to the returned URL
    }
    reader.readAsDataURL(file)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Event title must be at least 3 characters'
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }
    
    // Date validation
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }
    
    // Date sequence validation
    if (formData.startDate && formData.endDate && 
        new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.startDate = 'Start date must be before end date'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // For checkbox inputs, we need to check the checked property
    const checked = (e.target as HTMLInputElement).checked !== undefined ? 
      (e.target as HTMLInputElement).checked : undefined
    
    setFormData(prev => ({
      ...prev,
      [name]: checked !== undefined ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Convert comma-separated tags to array
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      
      // Convert multiline agenda to array
      const agendaArray = formData.agenda.split('\n').filter(item => item.trim() !== '')
      
      const submitData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        isOnline: formData.isOnline,
        maxAttendees: formData.maxAttendees,
        price: formData.price,
        organizer: formData.organizer,
        category: formData.category,
        tags: tagsArray,
        featured: formData.featured,
        requirements: formData.requirements,
        agenda: agendaArray,
        // Add image URL to submit data
        imageUrl: imagePreview || formData.imageUrl,
      }
      
      onSubmit(submitData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{event ? 'Edit Event' : 'Create New Event'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Event Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                placeholder="Enter event title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Education">Education</option>
                <option value="Career">Career</option>
                <option value="Conference">Conference</option>
                <option value="Competition">Competition</option>
                <option value="Webinar">Webinar</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
              placeholder="Enter event description"
            />
            <div className="flex justify-between mt-1">
              <span className="text-sm text-gray-500">Characters: {formData.description.length}/10 minimum</span>
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>

          {/* Add image upload section */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Image</label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-32 w-32 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Workshop">Workshop</option>
                <option value="Webinar">Webinar</option>
                <option value="Conference">Conference</option>
                <option value="Competition">Competition</option>
                <option value="Meetup">Meetup</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Postponed">Postponed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date *</label>
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date *</label>
              <input
                type="date"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter location or 'Online'"
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isOnline"
                  checked={formData.isOnline}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Online Event
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Attendees</label>
              <input
                type="number"
                name="maxAttendees"
                min="1"
                value={formData.maxAttendees}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
              <input
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Organizer</label>
            <input
              type="text"
              name="organizer"
              value={formData.organizer}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter organizer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="e.g., AI, Robotics, Career"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Requirements (one per line)</label>
            <textarea
              name="requirements"
              rows={2}
              value={formData.requirements}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter requirements, one per line"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Agenda (one item per line)</label>
            <textarea
              name="agenda"
              rows={3}
              value={formData.agenda}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter agenda items, one per line"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="mr-2"
              />
              Featured Event
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
