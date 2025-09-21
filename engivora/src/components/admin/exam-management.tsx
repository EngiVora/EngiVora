"use client"

import { useState } from "react"
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

interface Exam {
  id: number
  name: string
  fullName: string
  type: string
  status: string
  registrationStart: string
  registrationEnd: string
  examDate: string
  resultDate: string
  applicants: number
  seats: number
  description: string
  eligibility: string[]
  subjects: string[]
  featured: boolean
}

const mockExams: Exam[] = [
  {
    id: 1,
    name: "GATE 2025",
    fullName: "Graduate Aptitude Test in Engineering 2025",
    type: "National",
    status: "Registration Open",
    registrationStart: "2024-01-01",
    registrationEnd: "2024-02-15",
    examDate: "2024-03-15",
    resultDate: "2024-04-20",
    applicants: 125000,
    seats: 50000,
    description: "National level exam for admission to postgraduate programs in engineering...",
    eligibility: ["Bachelor's degree in Engineering", "Final year students eligible"],
    subjects: ["Computer Science", "Electronics", "Mechanical", "Civil"],
    featured: true
  },
  {
    id: 2,
    name: "JEE Advanced 2025",
    fullName: "Joint Entrance Examination Advanced 2025",
    type: "National",
    status: "Upcoming",
    registrationStart: "2024-04-01",
    registrationEnd: "2024-04-30",
    examDate: "2024-06-15",
    resultDate: "2024-07-10",
    applicants: 0,
    seats: 25000,
    description: "Advanced level exam for admission to IITs and other premier institutes...",
    eligibility: ["JEE Main qualified", "Top 2.5 lakh rank holders"],
    subjects: ["Physics", "Chemistry", "Mathematics"],
    featured: true
  },
  {
    id: 3,
    name: "CAT 2024",
    fullName: "Common Admission Test 2024",
    type: "National",
    status: "Results Declared",
    registrationStart: "2024-08-01",
    registrationEnd: "2024-09-15",
    examDate: "2024-11-24",
    resultDate: "2024-12-15",
    applicants: 250000,
    seats: 0,
    description: "National level exam for admission to MBA programs...",
    eligibility: ["Bachelor's degree", "Minimum 50% marks"],
    subjects: ["Quantitative Aptitude", "Verbal Ability", "Data Interpretation"],
    featured: false
  },
  {
    id: 4,
    name: "GRE 2024",
    fullName: "Graduate Record Examination 2024",
    type: "International",
    status: "Ongoing",
    registrationStart: "2024-01-01",
    registrationEnd: "2024-12-31",
    examDate: "Multiple dates",
    resultDate: "10-15 days after exam",
    applicants: 500000,
    seats: 0,
    description: "International standardized test for graduate school admissions...",
    eligibility: ["Bachelor's degree", "No age limit"],
    subjects: ["Verbal Reasoning", "Quantitative Reasoning", "Analytical Writing"],
    featured: false
  }
]

export function ExamManagement() {
  const [exams, setExams] = useState(mockExams)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedExams, setSelectedExams] = useState<number[]>([])

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || exam.type === selectedType
    const matchesStatus = selectedStatus === "all" || exam.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleSelectExam = (examId: number) => {
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
        : filteredExams.map(exam => exam.id)
    )
  }

  const handleExamAction = (examId: number, action: string) => {
    console.log(`Action: ${action} for exam: ${examId}`)
    // Implement exam actions here
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Registration Open": return "bg-green-100 text-green-800"
      case "Upcoming": return "bg-blue-100 text-blue-800"
      case "Ongoing": return "bg-yellow-100 text-yellow-800"
      case "Results Declared": return "bg-purple-100 text-purple-800"
      case "Closed": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Registration Open": return <CheckCircle className="h-4 w-4" />
      case "Upcoming": return <Clock className="h-4 w-4" />
      case "Ongoing": return <AlertCircle className="h-4 w-4" />
      case "Results Declared": return <CheckCircle className="h-4 w-4" />
      case "Closed": return <Lock className="h-4 w-4" />
      default: return <Lock className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "National": return "bg-blue-100 text-blue-800"
      case "International": return "bg-purple-100 text-purple-800"
      case "State": return "bg-green-100 text-green-800"
      case "University": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const isRegistrationOpen = (exam: Exam) => {
    const now = new Date()
    const start = new Date(exam.registrationStart)
    const end = new Date(exam.registrationEnd)
    return now >= start && now <= end
  }

  const isExamUpcoming = (exam: Exam) => {
    const now = new Date()
    const examDate = new Date(exam.examDate)
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
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
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
              <p className="text-sm font-medium text-gray-600">Registration Open</p>
              <p className="text-2xl font-bold text-gray-900">
                {exams.filter(e => e.status === "Registration Open").length}
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
              <p className="text-sm font-medium text-gray-600">Total Applicants</p>
              <p className="text-2xl font-bold text-gray-900">
                {exams.reduce((sum, exam) => sum + exam.applicants, 0).toLocaleString()}
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
                {exams.filter(e => e.status === "Upcoming").length}
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
              <option value="National">National</option>
              <option value="International">International</option>
              <option value="State">State</option>
              <option value="University">University</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Registration Open">Registration Open</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Results Declared">Results Declared</option>
              <option value="Closed">Closed</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedExams.includes(exam.id)}
                      onChange={() => handleSelectExam(exam.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-sm font-medium text-gray-900">{exam.name}</h3>
                          {exam.featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{exam.fullName}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{exam.description}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          {exam.subjects.slice(0, 3).map((subject, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {subject}
                            </span>
                          ))}
                          {exam.subjects.length > 3 && (
                            <span className="text-xs text-gray-500">+{exam.subjects.length - 3} more</span>
                          )}
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
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(exam.status)}`}>
                      {getStatusIcon(exam.status)}
                      <span className="ml-1">{exam.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {new Date(exam.registrationStart).toLocaleDateString()}
                      </div>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {new Date(exam.registrationEnd).toLocaleDateString()}
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
                        {exam.examDate === "Multiple dates" ? "Multiple dates" : new Date(exam.examDate).toLocaleDateString()}
                      </div>
                      {isExamUpcoming(exam) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        {exam.applicants.toLocaleString()} applicants
                      </div>
                      {exam.seats > 0 && (
                        <div className="flex items-center mt-1">
                          <GraduationCap className="h-4 w-4 text-gray-400 mr-1" />
                          {exam.seats.toLocaleString()} seats
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleExamAction(exam.id, "view")}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleExamAction(exam.id, "edit")}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleExamAction(exam.id, "applicants")}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Users className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleExamAction(exam.id, "delete")}
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredExams.length}</span> of{' '}
                <span className="font-medium">{filteredExams.length}</span> results
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
    </div>
  )
}
