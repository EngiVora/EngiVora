"use client"

import { useState, useMemo } from 'react'
import { Search, Filter, Calendar, MapPin, DollarSign, Users, Clock, BookOpen, Briefcase, Award, Calendar as CalendarIcon } from 'lucide-react'
import { OptimizedImage } from '@/components/optimized-image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface SearchResultsClientProps {
  query: string
  results: {
    jobs: any[]
    blogs: any[]
    events: any[]
    exams: any[]
    totalResults: number
  }
  type?: string
  currentPage: number
}

export function SearchResultsClient({ query, results, type, currentPage }: SearchResultsClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'blogs' | 'events' | 'exams'>(
    type as any || 'all'
  )
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title'>('relevance')

  const tabs = [
    { id: 'all' as const, label: 'All', icon: Search, count: results.totalResults },
    { id: 'jobs' as const, label: 'Jobs', icon: Briefcase, count: results.jobs.length },
    { id: 'blogs' as const, label: 'Blogs', icon: BookOpen, count: results.blogs.length },
    { id: 'events' as const, label: 'Events', icon: CalendarIcon, count: results.events.length },
    { id: 'exams' as const, label: 'Exams', icon: Award, count: results.exams.length },
  ]

  const sortedResults = useMemo(() => {
    const items = activeTab === 'all' 
      ? [...results.jobs, ...results.blogs, ...results.events, ...results.exams]
      : results[activeTab] || []

    switch (sortBy) {
      case 'date':
        return [...items].sort((a, b) => 
          new Date(b.createdAt || b.startDate || b.date).getTime() - 
          new Date(a.createdAt || a.startDate || a.date).getTime()
        )
      case 'title':
        return [...items].sort((a, b) => 
          (a.title || '').localeCompare(b.title || '')
        )
      default:
        return items
    }
  }, [results, activeTab, sortBy])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatSalary = (salary: any) => {
    if (!salary) return 'Not specified'
    const { min, max, currency } = salary
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`
  }

  const highlightText = (text: string, query: string) => {
    if (!text || !query) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  const getItemType = (item: any) => {
    if (item.company) return 'job'
    if (item.author) return 'blog'
    if (item.organizer) return 'event'
    if (item.conductingBody) return 'exam'
    return 'unknown'
  }

  const getItemLink = (item: any) => {
    const itemType = getItemType(item)
    switch (itemType) {
      case 'job':
        return `/jobs/${item._id}`
      case 'blog':
        return `/blogs/${item._id}`
      case 'event':
        return `/events/${item._id}`
      case 'exam':
        return `/exams/${item._id}`
      default:
        return '#'
    }
  }

  const renderJobItem = (job: any) => (
    <Link
      key={job._id}
      href={`/jobs/${job._id}`}
      className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
          {job.image ? (
            <OptimizedImage
              src={job.image}
              alt={`${job.company} logo`}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              fallbackSrc="/images/company-placeholder.svg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {highlightText(job.title, query)}
          </h3>
          <p className="text-gray-600 mb-2">{job.company}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-2">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{job.location}</span>
            </div>
            <span>{job.type}</span>
            {job.salary && (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>{formatSalary(job.salary)}</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">
            {highlightText(job.description, query)}
          </p>
        </div>
        <div className="text-right text-sm text-gray-500">
          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </div>
      </div>
    </Link>
  )

  const renderBlogItem = (blog: any) => (
    <Link
      key={blog._id}
      href={`/blogs/${blog._id}`}
      className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
          {blog.image ? (
            <OptimizedImage
              src={blog.image}
              alt={blog.title}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              fallbackSrc="/images/blog-placeholder.svg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {highlightText(blog.title, query)}
          </h3>
          <p className="text-gray-600 mb-2">by {blog.author}</p>
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
            {highlightText(blog.summary, query)}
          </p>
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {blog.tags.slice(0, 3).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-right text-sm text-gray-500">
          {formatDate(blog.createdAt)}
        </div>
      </div>
    </Link>
  )

  const renderEventItem = (event: any) => (
    <Link
      key={event._id}
      href={`/events/${event._id}`}
      className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
          {event.imageUrl ? (
            <OptimizedImage
              src={event.imageUrl}
              alt={event.title}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              fallbackSrc="/images/event-placeholder.svg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {highlightText(event.title, query)}
          </h3>
          <p className="text-gray-600 mb-2">by {event.organizer}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-2">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(event.startDate)}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{event.location}</span>
            </div>
            {event.maxAttendees && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>Max {event.maxAttendees}</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">
            {highlightText(event.description, query)}
          </p>
        </div>
        <div className="text-right text-sm text-gray-500">
          {event.price === 0 ? 'Free' : `$${event.price}`}
        </div>
      </div>
    </Link>
  )

  const renderExamItem = (exam: any) => (
    <Link
      key={exam._id}
      href={`/exams/${exam._id}`}
      className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
          <div className="w-full h-full flex items-center justify-center">
            <Award className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {highlightText(exam.title, query)}
          </h3>
          <p className="text-gray-600 mb-2">{exam.conductingBody}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-2">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(exam.date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{exam.duration} minutes</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{exam.location}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">
            {highlightText(exam.description, query)}
          </p>
        </div>
        <div className="text-right text-sm text-gray-500">
          {exam.fee === 0 ? 'Free' : `₹${exam.fee}`}
        </div>
      </div>
    </Link>
  )

  const renderItem = (item: any) => {
    const itemType = getItemType(item)
    switch (itemType) {
      case 'job':
        return renderJobItem(item)
      case 'blog':
        return renderBlogItem(item)
      case 'event':
        return renderEventItem(item)
      case 'exam':
        return renderExamItem(item)
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Search className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results for &quot;{query}&quot;
              </h1>
              <p className="text-gray-600">
                {results.totalResults} results found
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Sort search results by"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Date</option>
                <option value="title">Title</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Showing {sortedResults.length} results
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {sortedResults.length > 0 ? (
            sortedResults.map((item) => renderItem(item))
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse different categories.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/jobs"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Jobs
                </Link>
                <Link
                  href="/blogs"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Browse Blogs
                </Link>
                <Link
                  href="/events"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Browse Events
                </Link>
                <Link
                  href="/exams"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Browse Exams
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
