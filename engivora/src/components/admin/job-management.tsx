"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { cachedFetch, debounce } from "@/utils/api-cache"
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Building,
  Plus,
  Download,
  Upload,
  Globe,
  Lock,
  Clock,
  Star,
  TrendingUp
} from "lucide-react"

export function JobManagement() {
  const [jobs, setJobs] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 20

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      params.set('limit', itemsPerPage.toString())
      params.set('page', currentPage.toString())
      
      const res = await cachedFetch(`/api/jobs?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')}`
        }
      }, 300000) // 5 minutes cache
      
      // Clone the response to avoid "body stream already read" errors
      const clonedRes = res.clone()
      const data = await clonedRes.json()
      
      if (res.ok) {
        setJobs(data.data || [])
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, currentPage])

  const debouncedFetchJobs = useMemo(
    () => debounce(fetchJobs, 300),
    [fetchJobs]
  )

  useEffect(() => {
    debouncedFetchJobs()
  }, [debouncedFetchJobs])

  const filteredJobs = useMemo(() => {
    return jobs.filter((job: any) => {
      const matchesCategory = selectedCategory === "all" || job.category === selectedCategory
      const matchesStatus = selectedStatus === "all" || (job.isActive ? "Active" : "Closed") === selectedStatus
      const matchesType = selectedType === "all" || job.type === selectedType
      return matchesCategory && matchesStatus && matchesType
    })
  }, [jobs, selectedCategory, selectedStatus, selectedType])

  const handleSelectJob = useCallback((jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }, [])

  const handleSelectAll = useCallback(() => {
    setSelectedJobs(
      selectedJobs.length === filteredJobs.length 
        ? [] 
        : filteredJobs.map((job: any) => job._id)
    )
  }, [selectedJobs.length, filteredJobs])

  const handleJobAction = (jobId: string, action: string) => {
    const job = jobs.find(j => j._id === jobId)
    switch (action) {
      case 'view':
        // Navigate to job details or open in new tab
        window.open(`/jobs/${jobId}`, '_blank')
        break
      case 'edit':
        setEditingJob(job)
        setShowEditModal(true)
        break
      case 'delete':
        handleDeleteJob(jobId)
        break
      default:
        console.log(`Action: ${action} for job: ${jobId}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800"
      case "Paused": return "bg-yellow-100 text-yellow-800"
      case "Closed": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <Globe className="h-4 w-4" />
      case "Paused": return <Clock className="h-4 w-4" />
      case "Closed": return <Lock className="h-4 w-4" />
      default: return <Lock className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time": return "bg-blue-100 text-blue-800"
      case "part-time": return "bg-purple-100 text-purple-800"
      case "contract": return "bg-orange-100 text-orange-800"
      case "internship": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatSalary = (salary: any) => {
    if (!salary) return '—'
    if (typeof salary === 'string') return salary
    if (typeof salary === 'object' && salary.min !== undefined && salary.max !== undefined) {
      const currency = salary.currency || 'INR'
      if (salary.min === salary.max) {
        return `${currency} ${salary.min.toLocaleString()}`
      }
      return `${currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`
    }
    return '—'
  }

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingJob, setEditingJob] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateJob = async (jobData: any) => {
    const token = (typeof window !== 'undefined') ? (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
    if (!token) {
      alert('Not authenticated. Please login again.')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(jobData)
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data?.error || 'Failed to create job')
        return
      }
      setJobs(prev => [data.data, ...prev])
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating job:', error)
      alert('Network error creating job')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditJob = async (jobId: string, jobData: any) => {
    const token = (typeof window !== 'undefined') ? (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
    if (!token) {
      alert('Not authenticated. Please login again.')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(jobData)
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data?.error || 'Failed to update job')
        return
      }
      setJobs(prev => prev.map(job => job._id === jobId ? data.data : job))
      setShowEditModal(false)
      setEditingJob(null)
    } catch (error) {
      console.error('Error updating job:', error)
      alert('Network error updating job')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return
    
    const token = (typeof window !== 'undefined') ? (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
    if (!token) {
      alert('Not authenticated. Please login again.')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data?.error || 'Failed to delete job')
        return
      }
      setJobs(prev => prev.filter(job => job._id !== jobId))
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Network error deleting job')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedJobs.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedJobs.length} jobs?`)) return
    
    const token = (typeof window !== 'undefined') ? (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
    if (!token) {
      alert('Not authenticated. Please login again.')
      return
    }
    setIsLoading(true)
    try {
      const deletePromises = selectedJobs.map(jobId => 
        fetch(`/api/jobs/${jobId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      )
      await Promise.all(deletePromises)
      setJobs(prev => prev.filter(job => !selectedJobs.includes(job._id)))
      setSelectedJobs([])
    } catch (error) {
      console.error('Error deleting jobs:', error)
      alert('Network error deleting jobs')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-600">Manage job postings, applications, and company partnerships</p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedJobs.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50" 
              aria-label="Delete selected jobs"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedJobs.length})
            </button>
          )}
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" aria-label="Export jobs">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" aria-label="Import jobs">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button 
            onClick={() => setShowCreateModal(true)} 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" 
            aria-label="Post new job"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post Job
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">
                {jobs.filter((j: any) => j.isActive).length}
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
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {jobs.reduce((sum: number) => sum + 0, 0)}
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
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {jobs.reduce((sum: number) => sum + 0, 0).toLocaleString()}
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
                placeholder="Search jobs, companies, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search jobs, companies, locations"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              <option value="software">Software</option>
              <option value="hardware">Hardware</option>
              <option value="mechanical">Mechanical</option>
              <option value="civil">Civil</option>
              <option value="electrical">Electrical</option>
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by job type"
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            {selectedJobs.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedJobs.length} selected
              </span>
            )}
            <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedJobs.length === filteredJobs.length && filteredJobs.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-label="Select all jobs"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posted
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-4 bg-gray-300 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <div className="h-4 w-4 bg-gray-300 rounded"></div>
                        <div className="h-4 w-4 bg-gray-300 rounded"></div>
                        <div className="h-4 w-4 bg-gray-300 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No jobs found
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job: any) => (
                <tr key={job._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedJobs.includes(job._id)}
                      onChange={() => handleSelectJob(job._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      aria-label={`Select job ${job.title}`}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-sm font-medium text-gray-900">{job.title}</h3>
                          {job.featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location || 'N/A'}
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatSalary(job.salary)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{job.company}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(job.type)}`}>
                      {job.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.isActive ? 'Active' : 'Closed')}`}>
                      {getStatusIcon(job.isActive ? 'Active' : 'Closed')}
                      <span className="ml-1">{job.isActive ? 'Active' : 'Closed'}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleJobAction(job._id, "view")}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="View job"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleJobAction(job._id, "edit")}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Edit job"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleJobAction(job._id, "delete")}
                        className="text-gray-400 hover:text-red-600"
                        aria-label="Delete job"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="More options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredJobs.length}</span> of{' '}
                <span className="font-medium">{jobs.length}</span> results
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || isLoading}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || isLoading}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <JobModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateJob}
          isLoading={isLoading}
        />
      )}

      {/* Edit Job Modal */}
      {showEditModal && editingJob && (
        <JobModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingJob(null)
          }}
          onSubmit={(data) => handleEditJob(editingJob._id, data)}
          job={editingJob}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

// Job Modal Component
function JobModal({ isOpen, onClose, onSubmit, job, isLoading }: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  job?: any
  isLoading: boolean
}) {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    company: job?.company || '',
    description: job?.description || '',
    type: job?.type || 'full-time',
    category: job?.category || 'software',
    location: job?.location || '',
    remote: job?.remote || false,
    salary: job?.salary || { min: 0, max: 0, currency: 'INR' },
    requirements: job?.requirements || [],
    skills: job?.skills || [],
    experience: job?.experience || { min: 0, max: 0 },
    applicationDeadline: job?.applicationDeadline || '',
    applicationLink: job?.applicationLink || '',
    contactEmail: job?.contactEmail || '',
    isActive: job?.isActive ?? true,
    featured: job?.featured || false
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Job title must be at least 3 characters'
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required'
    } else if (formData.company.trim().length < 2) {
      newErrors.company = 'Company name must be at least 2 characters'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 50) {
      newErrors.description = 'Description must be at least 50 characters'
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    } else if (formData.location.trim().length < 2) {
      newErrors.location = 'Location must be at least 2 characters'
    }
    
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format'
    }
    
    if (formData.applicationLink && !/^https?:\/\/.+$/.test(formData.applicationLink)) {
      newErrors.applicationLink = 'Invalid URL format'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{job ? 'Edit Job' : 'Create New Job'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  setFormData({...formData, title: e.target.value})
                  if (errors.title) setErrors({...errors, title: ''})
                }}
                className={`mt-1 block w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                placeholder="Enter job title (min 3 characters)"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => {
                  setFormData({...formData, company: e.target.value})
                  if (errors.company) setErrors({...errors, company: ''})
                }}
                className={`mt-1 block w-full border ${errors.company ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                placeholder="Enter company name (min 2 characters)"
              />
              {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={(e) => {
                setFormData({...formData, description: e.target.value})
                if (errors.description) setErrors({...errors, description: ''})
              }}
              className={`mt-1 block w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
              placeholder="Enter detailed job description (min 50 characters)"
            />
            <div className="flex justify-between mt-1">
              <span className="text-sm text-gray-500">Characters: {formData.description.length}/50 minimum</span>
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                aria-label="Select job type"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                aria-label="Select job category"
              >
                <option value="software">Software</option>
                <option value="hardware">Hardware</option>
                <option value="mechanical">Mechanical</option>
                <option value="civil">Civil</option>
                <option value="electrical">Electrical</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => {
                  setFormData({...formData, location: e.target.value})
                  if (errors.location) setErrors({...errors, location: ''})
                }}
                className={`mt-1 block w-full border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                placeholder="Enter job location (min 2 characters)"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => {
                  setFormData({...formData, contactEmail: e.target.value})
                  if (errors.contactEmail) setErrors({...errors, contactEmail: ''})
                }}
                className={`mt-1 block w-full border ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                placeholder="contact@company.com"
              />
              {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Application Link</label>
              <input
                type="url"
                value={formData.applicationLink}
                onChange={(e) => {
                  setFormData({...formData, applicationLink: e.target.value})
                  if (errors.applicationLink) setErrors({...errors, applicationLink: ''})
                }}
                className={`mt-1 block w-full border ${errors.applicationLink ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                placeholder="https://company.com/apply"
              />
              {errors.applicationLink && <p className="mt-1 text-sm text-red-600">{errors.applicationLink}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.remote}
                onChange={(e) => setFormData({...formData, remote: e.target.checked})}
                className="mr-2"
              />
              Remote Work
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="mr-2"
              />
              Active
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="mr-2"
              />
              Featured
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
              {isLoading ? 'Saving...' : (job ? 'Update Job' : 'Create Job')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
