"use client"

import { useState } from "react"
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Mail, 
  Reply,
  Archive,
  Flag,
  Download,
  Upload,
  Plus,
  Inbox,
  Star
} from "lucide-react"

const mockMessages = [
  {
    id: 1,
    subject: "Welcome to EngiVora Platform",
    sender: "Admin Team",
    recipient: "john.doe@example.com",
    content: "Welcome to our engineering platform! We're excited to have you join our community.",
    type: "Welcome",
    status: "Read",
    priority: "Normal",
    date: "2024-01-15",
    time: "10:30 AM",
    isStarred: false,
    isArchived: false
  },
  {
    id: 2,
    subject: "Exam Schedule Update",
    sender: "Exam Department",
    recipient: "all@engivora.com",
    content: "Please note that the upcoming engineering exam has been rescheduled to next week.",
    type: "Announcement",
    status: "Unread",
    priority: "High",
    date: "2024-01-14",
    time: "2:15 PM",
    isStarred: true,
    isArchived: false
  },
  {
    id: 3,
    subject: "Job Opportunity - Software Engineer",
    sender: "HR Team",
    recipient: "students@engivora.com",
    content: "We have exciting job opportunities for software engineers. Apply now!",
    type: "Job Alert",
    status: "Read",
    priority: "Normal",
    date: "2024-01-13",
    time: "9:45 AM",
    isStarred: false,
    isArchived: false
  },
  {
    id: 4,
    subject: "Discount Code for Premium Courses",
    sender: "Marketing Team",
    recipient: "premium@engivora.com",
    content: "Get 20% off on all premium courses with code PREMIUM20",
    type: "Promotion",
    status: "Read",
    priority: "Low",
    date: "2024-01-12",
    time: "4:20 PM",
    isStarred: false,
    isArchived: true
  },
  {
    id: 5,
    subject: "Technical Support Request",
    sender: "sarah.wilson@example.com",
    recipient: "Support Team",
    content: "I'm having trouble accessing my course materials. Can you help?",
    type: "Support",
    status: "Unread",
    priority: "High",
    date: "2024-01-11",
    time: "11:30 AM",
    isStarred: false,
    isArchived: false
  }
]

export function MessageManagement() {
  const [messages, setMessages] = useState(mockMessages)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [selectedMessages, setSelectedMessages] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("inbox")

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.recipient.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || message.type === selectedType
    const matchesStatus = selectedStatus === "all" || message.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || message.priority === selectedPriority
    const matchesTab = activeTab === "inbox" ? !message.isArchived : 
                      activeTab === "archived" ? message.isArchived : true
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesTab
  })

  const handleSelectMessage = (messageId: number) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    )
  }

  const handleSelectAll = () => {
    setSelectedMessages(
      selectedMessages.length === filteredMessages.length 
        ? [] 
        : filteredMessages.map(message => message.id)
    )
  }

  const handleMessageAction = (messageId: number, action: string) => {
    console.log(`Action: ${action} for message: ${messageId}`)
    
    if (action === "star") {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
      ))
    } else if (action === "archive") {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isArchived: !msg.isArchived } : msg
      ))
    } else if (action === "delete") {
      setMessages(prev => prev.filter(msg => msg.id !== messageId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Read": return "bg-green-100 text-green-800"
      case "Unread": return "bg-blue-100 text-blue-800"
      case "Draft": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800"
      case "Normal": return "bg-blue-100 text-blue-800"
      case "Low": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Welcome": return "bg-green-100 text-green-800"
      case "Announcement": return "bg-purple-100 text-purple-800"
      case "Job Alert": return "bg-blue-100 text-blue-800"
      case "Promotion": return "bg-yellow-100 text-yellow-800"
      case "Support": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Message Management</h1>
          <p className="text-gray-600">Manage communications and messages</p>
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
            New Message
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Inbox className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">
                {messages.filter(m => m.status === "Unread").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Starred</p>
              <p className="text-2xl font-bold text-gray-900">
                {messages.filter(m => m.isStarred).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <Flag className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {messages.filter(m => m.priority === "High").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("inbox")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "inbox"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Inbox className="h-4 w-4 inline mr-2" />
              Inbox ({messages.filter(m => !m.isArchived).length})
            </button>
            <button
              onClick={() => setActiveTab("archived")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "archived"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Archive className="h-4 w-4 inline mr-2" />
              Archived ({messages.filter(m => m.isArchived).length})
            </button>
          </nav>
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
                placeholder="Search messages..."
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
              <option value="Welcome">Welcome</option>
              <option value="Announcement">Announcement</option>
              <option value="Job Alert">Job Alert</option>
              <option value="Promotion">Promotion</option>
              <option value="Support">Support</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Read">Read</option>
              <option value="Unread">Unread</option>
              <option value="Draft">Draft</option>
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            {selectedMessages.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedMessages.length} selected
              </span>
            )}
            <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message.id)}
                      onChange={() => handleSelectMessage(message.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {message.isStarred ? (
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {message.subject}
                          {message.status === "Unread" && (
                            <div className="ml-2 h-2 w-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          From: {message.sender}
                        </div>
                        <div className="text-sm text-gray-500">
                          To: {message.recipient}
                        </div>
                        <div className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(message.type)}`}>
                      {message.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(message.priority)}`}>
                      {message.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{new Date(message.date).toLocaleDateString()}</div>
                    <div className="text-gray-500">{message.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleMessageAction(message.id, "view")}
                        className="text-gray-400 hover:text-gray-600"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMessageAction(message.id, "reply")}
                        className="text-gray-400 hover:text-gray-600"
                        title="Reply"
                      >
                        <Reply className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMessageAction(message.id, "star")}
                        className={`hover:text-gray-600 ${
                          message.isStarred ? "text-yellow-400" : "text-gray-400"
                        }`}
                        title="Star"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMessageAction(message.id, "archive")}
                        className="text-gray-400 hover:text-gray-600"
                        title="Archive"
                      >
                        <Archive className="h-4 w-4" />
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredMessages.length}</span> of{' '}
                <span className="font-medium">{filteredMessages.length}</span> results
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
