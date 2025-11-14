"use client"

import { useState } from "react"
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  HelpCircle,
  BookOpen,
  Video,
  FileText,
  MessageCircle,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Star,
  User,
  CheckCircle,
  AlertCircle
} from "lucide-react"

const mockHelpArticles = [
  {
    id: 1,
    title: "Getting Started with Admin Dashboard",
    category: "Getting Started",
    type: "Article",
    status: "Published",
    views: 1250,
    helpful: 89,
    lastUpdated: "2024-01-10",
    author: "Admin Team",
    tags: ["dashboard", "admin", "basics"]
  },
  {
    id: 2,
    title: "User Management Best Practices",
    category: "User Management",
    type: "Article",
    status: "Published",
    views: 890,
    helpful: 67,
    lastUpdated: "2024-01-08",
    author: "Admin Team",
    tags: ["users", "management", "best-practices"]
  },
  {
    id: 3,
    title: "Security Configuration Guide",
    category: "Security",
    type: "Video",
    status: "Published",
    views: 2100,
    helpful: 156,
    lastUpdated: "2024-01-05",
    author: "Security Team",
    tags: ["security", "configuration", "video"]
  },
  {
    id: 4,
    title: "Troubleshooting Common Issues",
    category: "Troubleshooting",
    type: "Article",
    status: "Draft",
    views: 0,
    helpful: 0,
    lastUpdated: "2024-01-12",
    author: "Support Team",
    tags: ["troubleshooting", "issues", "support"]
  },
  {
    id: 5,
    title: "API Documentation",
    category: "Development",
    type: "Documentation",
    status: "Published",
    views: 3400,
    helpful: 234,
    lastUpdated: "2024-01-03",
    author: "Dev Team",
    tags: ["api", "documentation", "development"]
  }
]

const mockSupportTickets = [
  {
    id: 1,
    subject: "Unable to access admin dashboard",
    user: "john.doe@example.com",
    priority: "High",
    status: "Open",
    category: "Technical",
    createdAt: "2024-01-15 10:30:15",
    lastResponse: "2024-01-15 11:15:22",
    assignedTo: "Support Team"
  },
  {
    id: 2,
    subject: "Password reset not working",
    user: "jane.smith@example.com",
    priority: "Medium",
    status: "In Progress",
    category: "Account",
    createdAt: "2024-01-15 09:45:33",
    lastResponse: "2024-01-15 10:20:15",
    assignedTo: "Admin Team"
  },
  {
    id: 3,
    subject: "Feature request: Bulk user import",
    user: "mike.johnson@example.com",
    priority: "Low",
    status: "Closed",
    category: "Feature Request",
    createdAt: "2024-01-14 16:20:45",
    lastResponse: "2024-01-15 08:30:12",
    assignedTo: "Product Team"
  },
  {
    id: 4,
    subject: "System performance issues",
    user: "sarah.wilson@example.com",
    priority: "High",
    status: "Open",
    category: "Technical",
    createdAt: "2024-01-15 08:15:22",
    lastResponse: "2024-01-15 08:15:22",
    assignedTo: "Unassigned"
  }
]

const mockFaqs = [
  {
    id: 1,
    question: "How do I reset a user's password?",
    answer: "Go to User Management, find the user, click on their profile, and select 'Reset Password'. An email will be sent to the user with a temporary password.",
    category: "User Management",
    helpful: 45,
    lastUpdated: "2024-01-10"
  },
  {
    id: 2,
    question: "How can I export user data?",
    answer: "Navigate to User Management, use the filters to select the users you want to export, then click the 'Export' button. Choose your preferred format (CSV, Excel, or PDF).",
    category: "Data Export",
    helpful: 32,
    lastUpdated: "2024-01-08"
  },
  {
    id: 3,
    question: "What are the system requirements?",
    answer: "The admin dashboard requires a modern web browser (Chrome, Firefox, Safari, or Edge) with JavaScript enabled. No additional software installation is required.",
    category: "System Requirements",
    helpful: 28,
    lastUpdated: "2024-01-05"
  },
  {
    id: 4,
    question: "How do I enable two-factor authentication?",
    answer: "Go to Security Settings, enable 2FA, and configure it for your account. You can also enforce 2FA for all users or specific user groups.",
    category: "Security",
    helpful: 67,
    lastUpdated: "2024-01-12"
  }
]

export function HelpManagement() {
  const [helpArticles, setHelpArticles] = useState(mockHelpArticles)
  const [supportTickets, setSupportTickets] = useState(mockSupportTickets)
  const [faqs, setFaqs] = useState(mockFaqs)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("articles")

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    const matchesType = selectedType === "all" || article.type === selectedType
    const matchesStatus = selectedStatus === "all" || article.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "bg-green-100 text-green-800"
      case "Draft": return "bg-yellow-100 text-yellow-800"
      case "Archived": return "bg-gray-100 text-gray-800"
      case "Open": return "bg-red-100 text-red-800"
      case "In Progress": return "bg-blue-100 text-blue-800"
      case "Closed": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800"
      case "Medium": return "bg-yellow-100 text-yellow-800"
      case "Low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Article": return <FileText className="h-4 w-4" />
      case "Video": return <Video className="h-4 w-4" />
      case "Documentation": return <BookOpen className="h-4 w-4" />
      default: return <HelpCircle className="h-4 w-4" />
    }
  }

  const getUniqueCategories = () => {
    return [...new Set(helpArticles.map(article => article.category))]
  }

  const getUniqueTypes = () => {
    return [...new Set(helpArticles.map(article => article.type))]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600">Manage help articles, support tickets, and documentation</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{helpArticles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {helpArticles.filter(a => a.status === "Published").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-900">
                {supportTickets.filter(t => t.status === "Open").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">FAQs</p>
              <p className="text-2xl font-bold text-gray-900">{faqs.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("articles")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "articles"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              Help Articles
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "tickets"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <MessageCircle className="h-4 w-4 inline mr-2" />
              Support Tickets
            </button>
            <button
              onClick={() => setActiveTab("faqs")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "faqs"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <HelpCircle className="h-4 w-4 inline mr-2" />
              FAQs
            </button>
          </nav>
        </div>
      </div>

      {/* Help Articles Tab */}
      {activeTab === "articles" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {getUniqueCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  {getUniqueTypes().map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Articles Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Helpful
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            {getTypeIcon(article.type)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{article.title}</div>
                            <div className="text-sm text-gray-500">by {article.author}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {article.tags.map((tag, index) => (
                                <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {article.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {article.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(article.status)}`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {article.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {article.helpful}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(article.lastUpdated).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => console.log(`View article: ${article.id}`)}
                            className="text-gray-400 hover:text-gray-600"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => console.log(`Edit article: ${article.id}`)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
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
          </div>
        </div>
      )}

      {/* Support Tickets Tab */}
      {activeTab === "tickets" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {supportTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">#{ticket.id}</div>
                          <div className="text-sm text-gray-500">{ticket.subject}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.assignedTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => console.log(`View ticket: ${ticket.id}`)}
                            className="text-gray-400 hover:text-gray-600"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
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
          </div>
        </div>
      )}

      {/* FAQs Tab */}
      {activeTab === "faqs" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Helpful
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {faqs.map((faq) => (
                    <tr key={faq.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{faq.question}</div>
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">{faq.answer}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {faq.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {faq.helpful}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(faq.lastUpdated).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => console.log(`View FAQ: ${faq.id}`)}
                            className="text-gray-400 hover:text-gray-600"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => console.log(`Edit FAQ: ${faq.id}`)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
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
          </div>
        </div>
      )}
    </div>
  )
}
