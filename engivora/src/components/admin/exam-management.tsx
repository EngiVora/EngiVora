"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Clock,
  Users,
  BookOpen,
  Plus,
  Download,
  Upload,
  Globe,
  Lock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  GraduationCap
} from "lucide-react"
import { cachedFetch, debounce } from "@/utils/api-cache"

interface Exam {
  _id: string
  title: string
  organization: string
  date: string
  category: string
  description: string
  type: string
  applicationFee: number
  eligibility: string[]
  syllabus: string[]
  examCenters: string[]
  officialWebsite: string
  isActive: boolean
  registrationStartDate: string
  registrationEndDate: string
  createdAt: string
  updatedAt: string
  // Add imageUrl field
  imageUrl?: string
}

export function ExamManagement() {
  const [exams, setExams] = useState<Exam[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedExams, setSelectedExams] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | null>(null)

  const itemsPerPage = 10

  const fetchExams = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (selectedType !== "all") params.set('type', selectedType)
      if (selectedStatus !== "all") params.set('active', selectedStatus === "Active" ? "true" : "false")
      params.set('limit', itemsPerPage.toString())
      params.set('page', currentPage.toString())
      
      const token = typeof window !== 'undefined' ? 
        (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
      
      const res = await cachedFetch(`/api/exams?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }, 300000) // 5 minutes cache
      
      const data = await res.json()
      if (res.ok) {
        setExams(data.data || [])
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Failed to fetch exams:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedType, selectedStatus, currentPage])

  const debouncedFetchExams = useCallback(
    debounce(fetchExams, 300),
    [fetchExams]
  )

  useEffect(() => {
    debouncedFetchExams()
  }, [debouncedFetchExams])

  const handleCreateExam = async (examData: any) => {
    const token = typeof window !== 'undefined' ? 
      (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
    
    if (!token) {
      alert('Not authenticated. Please login again.')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(examData)
      })
      
      const data = await res.json()
      if (!res.ok) {
        alert(data?.error || 'Failed to create exam')
        return
      }
      
      setExams(prev => [data.data, ...prev])
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating exam:', error)
      alert('Network error creating exam')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditExam = async (examId: string, examData: any) => {
    const token = typeof window !== 'undefined' ? 
      (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
    
    if (!token) {
      alert('Not authenticated. Please login again.')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch(`/api/exams/${examId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(examData)
      })
      
      const data = await res.json()
      if (!res.ok) {
        alert(data?.error || 'Failed to update exam')
        return
      }
      
      setExams(prev => prev.map(exam => exam._id === examId ? data.data : exam))
      setShowEditModal(false)
      setEditingExam(null)
    } catch (error) {
      console.error('Error updating exam:', error)
      alert('Network error updating exam')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return
    
    const token = typeof window !== 'undefined' ? 
      (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
    
    if (!token) {
      alert('Not authenticated. Please login again.')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch(`/api/exams/${examId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      
      if (!res.ok) {
        const data = await res.json()
        alert(data?.error || 'Failed to delete exam')
        return
      }
      
      setExams(prev => prev.filter(exam => exam._id !== examId))
    } catch (error) {
      console.error('Error deleting exam:', error)
      alert('Network error deleting exam')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || exam.type === selectedType
    const matchesStatus = selectedStatus === "all" || (exam.isActive ? "Active" : "Inactive") === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleSelectExam = (examId: string) => {
    setSelectedExams(prev => 
      prev.includes(examId) 
        ? prev.filter(id => id !== examId)
        : [...prev, examId]
    )
  }

  const handleSelectAll = () => {
    setSelectedExams(
      selectedExams.length === filteredExams.length 
        ? [] 
        : filteredExams.map(exam => exam._id)
    )
  }

  const handleExamAction = (examId: string, action: string) => {
    const exam = exams.find(e => e._id === examId)
    switch (action) {
      case 'view':
        // Navigate to exam details or open in new tab
        window.open(`/exams/${examId}`, '_blank')
        break
      case 'edit':
        setEditingExam(exam || null)
        setShowEditModal(true)
        break
      case 'delete':
        handleDeleteExam(examId)
        break
      default:
        console.log(`Action: ${action} for exam: ${examId}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800"
      case "Inactive": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <CheckCircle className="h-4 w-4" />
      case "Inactive": return <Lock className="h-4 w-4" />
      default: return <Lock className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "entrance": return "bg-blue-100 text-blue-800"
      case "competitive": return "bg-purple-100 text-purple-800"
      case "certification": return "bg-green-100 text-green-800"
      case "placement": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const isRegistrationOpen = (exam: Exam) => {
    const now = new Date()
    const start = new Date(exam.registrationStartDate)
    const end = new Date(exam.registrationEndDate)
    return now >= start && now <= end
  }

  const isExamUpcoming = (exam: Exam) => {
    const now = new Date()
    const examDate = new Date(exam.date)
    return now < examDate
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
          <p className="text-gray-600">Manage exam schedules, registrations, and updates</p>
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
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Exam
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Exams</p>
              <p className="text-2xl font-bold text-gray-900">
                {exams.filter(e => e.isActive).length}
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
              <p className="text-sm font-medium text-gray-600">Registration Open</p>
              <p className="text-2xl font-bold text-gray-900">
                {exams.filter(e => isRegistrationOpen(e)).length}
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
              <p className="text-sm font-medium text-gray-600">Upcoming Exams</p>
              <p className="text-2xl font-bold text-gray-900">
                {exams.filter(e => isExamUpcoming(e)).length}
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
                placeholder="Search exams..."
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
              <option value="entrance">Entrance</option>
              <option value="competitive">Competitive</option>
              <option value="certification">Certification</option>
              <option value="placement">Placement</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            {selectedExams.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedExams.length} selected
              </span>
            )}
            <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedExams.length === filteredExams.length && filteredExams.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam Date
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
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
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
              ) : filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No exams found
                  </td>
                </tr>
              ) : (
                filteredExams.map((exam) => (
                  <tr key={exam._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedExams.includes(exam._id)}
                        onChange={() => handleSelectExam(exam._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900">{exam.title}</h3>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{exam.description}</p>
                          <div className="flex items-center mt-2 space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {exam.organization}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(exam.type)}`}>
                        {exam.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(exam.isActive ? 'Active' : 'Inactive')}`}>
                        {getStatusIcon(exam.isActive ? 'Active' : 'Inactive')}
                        <span className="ml-1">{exam.isActive ? 'Active' : 'Inactive'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {new Date(exam.registrationStartDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {new Date(exam.registrationEndDate).toLocaleDateString()}
                        </div>
                        {isRegistrationOpen(exam) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                            Open Now
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {new Date(exam.date).toLocaleDateString()}
                        </div>
                        {isExamUpcoming(exam) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            Upcoming
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleExamAction(exam._id, "view")}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleExamAction(exam._id, "edit")}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleExamAction(exam._id, "delete")}
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
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredExams.length}</span> of{' '}
                <span className="font-medium">{exams.length}</span> results
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

      {/* Create Exam Modal */}
      {showCreateModal && (
        <ExamModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateExam}
          isLoading={isLoading}
        />
      )}

      {/* Edit Exam Modal */}
      {showEditModal && editingExam && (
        <ExamModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingExam(null)
          }}
          onSubmit={(data) => handleEditExam(editingExam._id, data)}
          exam={editingExam}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

// Exam Modal Component
function ExamModal({ isOpen, onClose, onSubmit, exam, isLoading }: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  exam?: Exam | null
  isLoading: boolean
}) {
  const [formData, setFormData] = useState({
    name: exam?.title || '',
    description: exam?.description || '',
    type: exam?.type || 'entrance',
    category: exam?.category || 'engineering',
    examDate: exam?.date ? new Date(exam.date).toISOString().slice(0, 16) : '',
    registrationStartDate: exam?.registrationStartDate ? new Date(exam.registrationStartDate).toISOString().slice(0, 16) : '',
    registrationEndDate: exam?.registrationEndDate ? new Date(exam.registrationEndDate).toISOString().slice(0, 16) : '',
    applicationFee: exam?.applicationFee || 0,
    eligibility: exam?.eligibility?.join('\n') || '',
    syllabus: exam?.syllabus?.join('\n') || '',
    examCenters: exam?.examCenters?.join('\n') || '',
    officialWebsite: exam?.officialWebsite || '',
    isActive: exam?.isActive ?? true,
    // Add image field
    imageUrl: exam?.imageUrl || '',
  })
  
  // Add image preview state
  const [imagePreview, setImagePreview] = useState<string | null>(exam?.imageUrl || null)
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
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Exam name is required'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Exam name must be at least 3 characters'
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }
    
    // Date validation
    if (!formData.examDate) {
      newErrors.examDate = 'Exam date is required'
    }
    
    if (!formData.registrationStartDate) {
      newErrors.registrationStartDate = 'Registration start date is required'
    }
    
    if (!formData.registrationEndDate) {
      newErrors.registrationEndDate = 'Registration end date is required'
    }
    
    // Date sequence validation
    if (formData.registrationStartDate && formData.registrationEndDate && 
        new Date(formData.registrationStartDate) >= new Date(formData.registrationEndDate)) {
      newErrors.registrationStartDate = 'Registration start must be before end date'
    }
    
    if (formData.examDate && formData.registrationEndDate && 
        new Date(formData.registrationEndDate) >= new Date(formData.examDate)) {
      newErrors.registrationEndDate = 'Registration must end before exam date'
    }
    
    // Website URL validation (if provided)
    if (formData.officialWebsite && !/^https?:\/\/.+$/.test(formData.officialWebsite)) {
      newErrors.officialWebsite = 'Invalid URL format'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Convert multiline text to arrays
      const eligibilityArray = formData.eligibility.split('\n').filter(item => item.trim() !== '')
      const syllabusArray = formData.syllabus.split('\n').filter(item => item.trim() !== '')
      const examCentersArray = formData.examCenters.split('\n').filter(item => item.trim() !== '')
      
      const submitData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        examDate: formData.examDate,
        registrationStartDate: formData.registrationStartDate,
        registrationEndDate: formData.registrationEndDate,
        applicationFee: formData.applicationFee,
        eligibility: eligibilityArray,
        syllabus: syllabusArray,
        examCenters: examCentersArray,
        officialWebsite: formData.officialWebsite,
        isActive: formData.isActive,
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
        <h2 className="text-xl font-bold mb-4">{exam ? 'Edit Exam' : 'Create New Exam'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Exam Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({...formData, name: e.target.value})
                  if (errors.name) setErrors({...errors, name: ''})
                }}
                className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                placeholder="Enter exam name (min 3 characters)"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="engineering">Engineering</option>
                <option value="medical">Medical</option>
                <option value="management">Management</option>
                <option value="law">Law</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          {/* Add image upload section */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Exam Image</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => {
                setFormData({...formData, description: e.target.value})
                if (errors.description) setErrors({...errors, description: ''})
              }}
              className={`mt-1 block w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
              placeholder="Enter exam description (min 10 characters)"
            />
            <div className="flex justify-between mt-1">
              <span className="text-sm text-gray-500">Characters: {formData.description.length}/10 minimum</span>
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
              >
                <option value="entrance">Entrance</option>
                <option value="competitive">Competitive</option>
                <option value="certification">Certification</option>
                <option value="placement">Placement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Application Fee (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.applicationFee}
                onChange={(e) => setFormData({...formData, applicationFee: Number(e.target.value)})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter fee"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Official Website</label>
              <input
                type="url"
                value={formData.officialWebsite}
                onChange={(e) => {
                  setFormData({...formData, officialWebsite: e.target.value})
                  if (errors.officialWebsite) setErrors({...errors, officialWebsite: ''})
                }}
                className={`mt-1 block w-full border ${errors.officialWebsite ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                placeholder="https://example.com"
              />
              {errors.officialWebsite && <p className="mt-1 text-sm text-red-600">{errors.officialWebsite}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Exam Date *</label>
              <input
                type="datetime-local"
                required
                value={formData.examDate}
                onChange={(e) => {
                  setFormData({...formData, examDate: e.target.value})
                  if (errors.examDate) setErrors({...errors, examDate: ''})
                }}
                className={`mt-1 block w-full border ${errors.examDate ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
              />
              {errors.examDate && <p className="mt-1 text-sm text-red-600">{errors.examDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Start *</label>
              <input
                type="datetime-local"
                required
                value={formData.registrationStartDate}
                onChange={(e) => {
                  setFormData({...formData, registrationStartDate: e.target.value})
                  if (errors.registrationStartDate) setErrors({...errors, registrationStartDate: ''})
                }}
                className={`mt-1 block w-full border ${errors.registrationStartDate ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
              />
              {errors.registrationStartDate && <p className="mt-1 text-sm text-red-600">{errors.registrationStartDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration End *</label>
              <input
                type="datetime-local"
                required
                value={formData.registrationEndDate}
                onChange={(e) => {
                  setFormData({...formData, registrationEndDate: e.target.value})
                  if (errors.registrationEndDate) setErrors({...errors, registrationEndDate: ''})
                }}
                className={`mt-1 block w-full border ${errors.registrationEndDate ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
              />
              {errors.registrationEndDate && <p className="mt-1 text-sm text-red-600">{errors.registrationEndDate}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Eligibility Criteria (one per line)</label>
            <textarea
              rows={3}
              value={formData.eligibility}
              onChange={(e) => setFormData({...formData, eligibility: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter eligibility criteria, one per line"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Syllabus (one topic per line)</label>
            <textarea
              rows={3}
              value={formData.syllabus}
              onChange={(e) => setFormData({...formData, syllabus: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter syllabus topics, one per line"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Exam Centers (one per line)</label>
            <textarea
              rows={2}
              value={formData.examCenters}
              onChange={(e) => setFormData({...formData, examCenters: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter exam centers, one per line"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="mr-2"
              />
              Active
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
              {isLoading ? 'Saving...' : (exam ? 'Update Exam' : 'Create Exam')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
