"use client"

import { useState, useEffect } from 'react'
import { 
  Users, 
  Briefcase, 
  BookOpen, 
  Calendar, 
  Award, 
  FileText, 
  BarChart3,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload
} from 'lucide-react'
import { LazyJobManagement } from '@/components/dynamic-imports'
import { LazyBlogManagement } from '@/components/dynamic-imports'
import { LazyUserManagement } from '@/components/dynamic-imports'

interface AdminManagementClientProps {
  type: string
}

const typeConfig = {
  users: {
    title: 'User Management',
    icon: Users,
    description: 'Manage user accounts, permissions, and profiles',
    color: 'blue'
  },
  jobs: {
    title: 'Job Management',
    icon: Briefcase,
    description: 'Manage job postings and applications',
    color: 'green'
  },
  blogs: {
    title: 'Blog Management',
    icon: BookOpen,
    description: 'Manage blog posts and content',
    color: 'purple'
  },
  events: {
    title: 'Event Management',
    icon: Calendar,
    description: 'Manage events and registrations',
    color: 'orange'
  },
  exams: {
    title: 'Exam Management',
    icon: Award,
    description: 'Manage exams and registrations',
    color: 'red'
  },
  applications: {
    title: 'Application Management',
    icon: FileText,
    description: 'Manage job applications and tracking',
    color: 'indigo'
  },
  analytics: {
    title: 'Analytics Dashboard',
    icon: BarChart3,
    description: 'View platform analytics and insights',
    color: 'teal'
  }
}

export function AdminManagementClient({ type }: AdminManagementClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const config = typeConfig[type as keyof typeof typeConfig]

  if (!config) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Management Type</h1>
        <p className="text-gray-600">The requested management type does not exist.</p>
      </div>
    )
  }

  const IconComponent = config.icon

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for:`, selectedItems)
    // Implement bulk actions
  }

  const renderManagementContent = () => {
    switch (type) {
      case 'jobs':
        return <LazyJobManagement />
      case 'blogs':
        return <LazyBlogManagement />
      case 'users':
        return <LazyUserManagement />
      case 'events':
        return <EventsManagement />
      case 'exams':
        return <ExamsManagement />
      case 'applications':
        return <ApplicationsManagement />
      case 'analytics':
        return <AnalyticsManagement />
      default:
        return <DefaultManagement />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg bg-${config.color}-100`}>
            <IconComponent className={`w-6 h-6 text-${config.color}-600`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
            <p className="text-gray-600">{config.description}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${type}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by status"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Pending</option>
              </select>
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by category"
              >
                <option>All Categories</option>
                <option>Software</option>
                <option>Hardware</option>
                <option>Mechanical</option>
              </select>
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by date"
              >
                <option>All Dates</option>
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedItems.length} item(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('delete')}
                className="flex items-center gap-1 px-3 py-1 text-red-700 hover:bg-red-100 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="flex items-center gap-1 px-3 py-1 text-blue-700 hover:bg-blue-100 rounded transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Management Content */}
      {renderManagementContent()}
    </div>
  )
}

// Placeholder components for different management types
function EventsManagement() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Management</h3>
        <p className="text-gray-600">Event management functionality will be implemented here.</p>
      </div>
    </div>
  )
}

function ExamsManagement() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Management</h3>
        <p className="text-gray-600">Exam management functionality will be implemented here.</p>
      </div>
    </div>
  )
}

function ApplicationsManagement() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Management</h3>
        <p className="text-gray-600">Application management functionality will be implemented here.</p>
      </div>
    </div>
  )
}

function AnalyticsManagement() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
        <p className="text-gray-600">Analytics dashboard will be implemented here.</p>
      </div>
    </div>
  )
}

function DefaultManagement() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Management Panel</h3>
        <p className="text-gray-600">Management functionality will be implemented here.</p>
      </div>
    </div>
  )
}
